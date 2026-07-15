use crate::auth::fetch_auth;
use crate::client_version::{detect_region_from_log, fetch_client_version, Region};
use crate::encounter::EncounterStore;
use crate::fetcher::{
    build_rows, build_self, fetch_current_act, fetch_history, refresh_rows, MatchStats,
};
use crate::lockfile::read_lockfile;
use crate::match_state::current_state;
use crate::model::{MatchState, MatchView, PlayerRow};
use crate::presence::{describe_activity, fetch_self_presence, is_ffa, mode_name};
use crate::static_cache::StaticData;
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::atomic::AtomicBool;
use std::sync::Arc;
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager};
use tokio::sync::Notify;

pub fn assemble_view(
    state: MatchState,
    mode: String,
    rows: Vec<PlayerRow>,
    stale: bool,
) -> MatchView {
    MatchView {
        state,
        mode,
        activity: String::new(),
        players: rows,
        me: None,
        history: Vec::new(),
        stale,
        phase_time: 0,
        map: String::new(),
        map_image: String::new(),
        ally_score: 0,
        enemy_score: 0,
        combat_loading: false,
        history_queue: 0,
    }
}

/// Compute a smurf suspicion score (0-100) based on rank/level/stats anomalies.
/// Higher score = more suspicious. Thresholds:
/// 0-20: Normal, 20-40: Slightly suspicious, 40-60: Moderate, 60-80: High, 80+: Very high
fn compute_smurf_score(row: &PlayerRow) -> u32 {
    let mut score = 0u32;

    // Factor 1: Low account level at high rank
    // Expected: ~lvl 50 per rank tier above 10. E.g. Diamond (tier 18) should be lvl ~400+
    if row.account_level > 0 && row.rank_tier >= 12 {
        let expected_level = ((row.rank_tier - 10) * 30) as i32;
        let deficit = expected_level - row.account_level as i32;
        if deficit > 100 {
            score += 30;
        } else if deficit > 50 {
            score += 20;
        } else if deficit > 20 {
            score += 10;
        }
    }

    // Factor 2: Very high headshot percentage (> 30%)
    if row.last_hs > 30 {
        score += 20;
    } else if row.last_hs > 25 {
        score += 10;
    }

    // Factor 3: High win rate with many games (> 60% WR with 50+ games)
    if row.games > 50 && row.win_rate > 65 {
        score += 15;
    } else if row.games > 30 && row.win_rate > 70 {
        score += 10;
    }

    // Factor 4: Very high ACS (> 300)
    if row.last_acs > 300 {
        score += 15;
    } else if row.last_acs > 250 {
        score += 8;
    }

    // Factor 5: Encounter losses (we've lost to this player before)
    if row.encounter_losses > 2 {
        score += 10;
    }

    score.min(100)
}

fn resolve_region() -> Region {
    if let Ok(region) = std::env::var("VAL_REGION") {
        let shard = std::env::var("VAL_SHARD").unwrap_or_else(|_| region.clone());
        return Region { region, shard };
    }
    detect_region_from_log().unwrap_or_else(|| Region {
        region: "na".to_string(),
        shard: "na".to_string(),
    })
}

const SELF_REFRESH_EVERY: u32 = 10;

async fn poll_once(
    sd: &StaticData,
    region: &Region,
    version: &mut Option<String>,
    current_act: &mut Option<String>,
    last: &MatchView,
    last_match_id: &mut Option<String>,
    last_loop_state: &mut String,
    self_tick: &mut u32,
    _match_cache: &mut HashMap<String, MatchStats>,
    _fetch_combat: bool,
    encounters: &mut EncounterStore,
    encounter_path: &std::path::Path,
) -> Option<MatchView> {
    let lf = match read_lockfile() {
        Ok(lf) => lf,
        Err(_) => {
            *last_match_id = None;
            return Some(assemble_view(MatchState::NoGame, String::new(), Vec::new(), false));
        }
    };
    let ctx = fetch_auth(&lf).await.ok()?;
    if version.is_none() {
        *version = fetch_client_version().await.ok();
    }
    let v = version.clone()?;

    if current_act.is_none() {
        *current_act = fetch_current_act(&ctx, region, &v).await;
    }
    let act = current_act.as_deref().unwrap_or("");

    let party_map = crate::presence::fetch_party_map(&lf).await;

    *self_tick = self_tick.wrapping_add(1);
    let refresh_self = last.me.is_none() || *self_tick % SELF_REFRESH_EVERY == 0;
    let me = if refresh_self {
        build_self(&ctx, region, &v, act, sd, &party_map)
            .await
            .or_else(|| last.me.clone())
    } else {
        last.me.clone()
    };

    let history = if refresh_self {
        let fresh = fetch_history(&ctx, region, &v, sd).await;
        if fresh.is_empty() {
            last.history.clone()
        } else {
            fresh
        }
    } else {
        last.history.clone()
    };

    let presence = fetch_self_presence(&lf, &ctx.puuid).await;
    let queue_id = presence
        .as_ref()
        .map(|p| p.queue_id.clone())
        .unwrap_or_default();
    let mode = mode_name(&queue_id);
    let loop_state = presence.as_ref().map(|p| p.loop_state.as_str()).unwrap_or("");
    let activity = presence
        .as_ref()
        .map(|p| describe_activity(p, &mode))
        .unwrap_or_else(|| "Idle".to_string());

    let with_me = |view: MatchView| MatchView {
        me: me.clone(),
        history: history.clone(),
        activity: activity.clone(),
        ..view
    };

    let in_match = loop_state == "PREGAME" || loop_state == "INGAME";
    let entered = last_loop_state.as_str() != loop_state;
    *last_loop_state = loop_state.to_string();

    if !in_match {
        // Apply encounter outcomes when leaving a match
        if !last.players.is_empty() && last.state == MatchState::CoreGame {
            let won = last.ally_score > last.enemy_score;
            if let Some(ref mid) = last_match_id.clone() {
                encounters.apply_outcome(mid, won);
                let _ = encounters.save(encounter_path);
            }
        }
        *last_match_id = None;
        return Some(with_me(assemble_view(MatchState::Menu, mode, Vec::new(), false)));
    }

    let roster_loaded =
        is_ffa(&queue_id) || last.players.iter().any(|r| r.team == "Enemy");
    let settled = roster_loaded
        && !last.players.is_empty()
        && loop_state == "INGAME"
        && last.state == MatchState::CoreGame;
    if !entered && settled {
        let mut view = with_me(assemble_view(last.state, mode, last.players.clone(), false));
        if let Some(p) = presence.as_ref() {
            view.map = sd.map_name(&p.party_owner_match_map);
            view.map_image = sd.map_image(&p.party_owner_match_map);
            view.ally_score = p.ally_score;
            view.enemy_score = p.enemy_score;
        }
        return Some(view);
    }

    let cs = current_state(&ctx, region, &v, loop_state).await;
    let state = cs.state;
    let match_id = cs.match_id;
    let raw = cs.players;
    let phase_time = cs.phase_time;
    if raw.is_empty() {
        *last_match_id = None;
        return Some(with_me(assemble_view(state, mode, Vec::new(), false)));
    }

    let roster_complete = raw
        .iter()
        .all(|p| last.players.iter().any(|r| r.puuid == p.puuid));
    let new_match = match_id.is_some() && *last_match_id != match_id;
    let same_match =
        !new_match && match_id.is_some() && !last.players.is_empty() && roster_complete;
    let mut rows = if same_match {
        refresh_rows(&last.players, &raw, sd)
    } else {
        let fetched =
            build_rows(&ctx, region, &v, act, &raw, sd, &last.players, &party_map).await;
        *last_match_id = match_id.clone();
        fetched
    };

    // Record new match in encounter store
    if new_match {
        if let Some(ref mid) = match_id {
            let now = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap_or_default()
                .as_secs() as i64;
            let roster: Vec<(String, String, u32)> = rows
                .iter()
                .map(|r| (r.puuid.clone(), r.name.clone(), r.rank_tier))
                .collect();
            encounters.record_seen(mid, &roster, now);
            let _ = encounters.save(encounter_path);
        }
    }

    // Populate encounter stats on each player row
    for row in &mut rows {
        let (seen, ewins, elosses) = encounters.prior(&row.puuid);
        row.encounters = seen;
        row.encounter_wins = ewins;
        row.encounter_losses = elosses;
    }

    // Compute streak, recent wins/losses, RR trend, and smurf score
    if let Some(ref me_row) = me {
        let mut streak = 0i32;
        let mut recent_wins = 0u32;
        let mut recent_losses = 0u32;
        let mut rr_trend = 0i32;
        for h in history.iter().take(20) {
            if !h.has_stats {
                continue;
            }
            if h.won {
                recent_wins += 1;
            } else {
                recent_losses += 1;
            }
            rr_trend += h.rr_change;
        }
        // Streak: count consecutive wins/losses from most recent game
        for h in history.iter() {
            if !h.has_stats {
                continue;
            }
            if streak == 0 {
                streak = if h.won { 1 } else { -1 };
            } else if (streak > 0) == h.won {
                if h.won {
                    streak += 1;
                } else {
                    streak -= 1;
                }
            } else {
                break;
            }
        }
        // Update self row with computed stats
        for row in &mut rows {
            if row.puuid == me_row.puuid {
                row.streak = streak;
                row.recent_wins = recent_wins;
                row.recent_losses = recent_losses;
                row.rr_trend = rr_trend;
                break;
            }
        }
    }

    // Compute smurf scores for all players
    for row in &mut rows {
        row.smurf_score = compute_smurf_score(row);
    }

    if is_ffa(&queue_id) {
        for row in &mut rows {
            row.team.clear();
        }
    }
    let mut view = with_me(assemble_view(state, mode, rows, false));
    view.phase_time = phase_time;
    if let Some(p) = presence.as_ref() {
        view.map = sd.map_name(&p.party_owner_match_map);
        view.map_image = sd.map_image(&p.party_owner_match_map);
        view.ally_score = p.ally_score;
        view.enemy_score = p.enemy_score;
    }
    Some(view)
}

pub async fn run_loop(app: AppHandle, _combat_enabled: Arc<AtomicBool>, wake: Arc<Notify>) {
    let base_dir = app
        .path()
        .app_cache_dir()
        .unwrap_or_else(|_| PathBuf::from("."));
    let cache_dir = base_dir.join("static");
    let static_data = StaticData::load_or_fetch(&cache_dir);
    let encounter_path = base_dir.join("encounters.json");
    let mut encounters = EncounterStore::load(&encounter_path);
    let region = resolve_region();
    let mut version = fetch_client_version().await.ok();
    let mut current_act: Option<String> = None;
    let mut last = assemble_view(MatchState::NoGame, String::new(), Vec::new(), false);

    let mut last_match_id: Option<String> = None;
    let mut last_loop_state = String::new();
    let mut self_tick = 0u32;
    let mut match_cache: HashMap<String, MatchStats> = HashMap::new();

    tauri::async_runtime::spawn(crate::websocket::run_presence_socket(wake.clone()));

    loop {
        let view = match poll_once(
            &static_data,
            &region,
            &mut version,
            &mut current_act,
            &last,
            &mut last_match_id,
            &mut last_loop_state,
            &mut self_tick,
            &mut match_cache,
            false,
            &mut encounters,
            &encounter_path,
        )
        .await
        {
            Some(view) => {
                last = view.clone();
                view
            }
            None if last.players.is_empty() => {
                assemble_view(MatchState::NoGame, String::new(), Vec::new(), false)
            }
            None => {
                let mut stale = last.clone();
                stale.stale = true;
                stale
            }
        };

        let _ = app.emit("match-view", &view);

        let interval = match view.state {
            MatchState::PreGame => Duration::from_millis(1200),
            _ => Duration::from_secs(3),
        };
        tokio::select! {
            _ = tokio::time::sleep(interval) => {}
            _ = wake.notified() => {}
        }
    }
}
