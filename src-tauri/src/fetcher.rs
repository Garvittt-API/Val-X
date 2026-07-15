#![allow(dead_code)]

use crate::auth::{pvp_headers, AuthContext};
use crate::client_version::Region;
use crate::match_state::RawPlayer;
use crate::model::{HistoryEntry, PlayerRow, ScoreEntry};
use crate::static_cache::StaticData;
use serde_json::Value;
use std::collections::HashMap;

async fn get_json_retry(url: &str, ctx: &AuthContext, version: &str) -> Option<Value> {
    crate::http::get_json_retry(url, pvp_headers(ctx, version)).await
}

#[derive(Debug, PartialEq, Eq, Default)]
pub struct Mmr {
    pub tier: u32,
    pub rr: u32,
    pub peak: u32,
    pub peak_season: String,
    pub wins: u32,
    pub games: u32,
    pub leaderboard: u32,
}

pub async fn fetch_current_act(ctx: &AuthContext, region: &Region, version: &str) -> Option<String> {
    let url = format!("{}/content-service/v3/content", region.shared_base());
    let body = crate::http::get_json_retry(&url, pvp_headers(ctx, version)).await?;
    let seasons = body.get("Seasons").and_then(|s| s.as_array())?;
    seasons
        .iter()
        .find(|s| {
            s.get("IsActive").and_then(|v| v.as_bool()) == Some(true)
                && s.get("Type").and_then(|v| v.as_str()) == Some("act")
        })
        .and_then(|s| s.get("ID").and_then(|v| v.as_str()).map(String::from))
}

pub fn parse_mmr(json: &Value, current_act: &str) -> Mmr {
    let seasons = json
        .get("QueueSkills")
        .and_then(|q| q.get("competitive"))
        .and_then(|c| c.get("SeasonalInfoBySeasonID"))
        .and_then(|s| s.as_object());

    let mut tier = 0u32;
    let mut rr = 0u32;
    let mut wins = 0u32;
    let mut games = 0u32;
    let mut leaderboard = 0u32;
    let mut current_season = current_act.to_string();

    if !current_act.is_empty() {
        if let Some(info) = seasons.and_then(|s| s.get(current_act)) {
            tier = info.get("CompetitiveTier").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
            if tier <= 2 {
                tier = 0;
            }
            rr = info.get("RankedRating").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
            games = info.get("NumberOfGames").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
            wins = info
                .get("NumberOfWinsWithPlacements")
                .or_else(|| info.get("NumberOfWins"))
                .and_then(|v| v.as_u64())
                .unwrap_or(0) as u32;
            leaderboard = info.get("LeaderboardRank").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
        }
    } else {
        let latest = json.get("LatestCompetitiveUpdate");
        tier = latest
            .and_then(|l| l.get("TierAfterUpdate"))
            .and_then(|v| v.as_u64())
            .unwrap_or(0) as u32;
        rr = latest
            .and_then(|l| l.get("RankedRatingAfterUpdate"))
            .and_then(|v| v.as_u64())
            .unwrap_or(0) as u32;
        current_season = latest
            .and_then(|l| l.get("SeasonID"))
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string();
    }

    let mut peak = tier;
    let mut peak_season = current_season.clone();
    if let Some(seasons) = seasons {
        for (id, info) in seasons {
            let mut season_peak = 0;
            if let Some(wins_by_tier) = info.get("WinsByTier").and_then(|w| w.as_object()) {
                for key in wins_by_tier.keys() {
                    if let Ok(t) = key.parse::<u32>() {
                        season_peak = season_peak.max(t);
                    }
                }
            }
            if let Some(t) = info.get("CompetitiveTier").and_then(|v| v.as_u64()) {
                season_peak = season_peak.max(t as u32);
            }
            if season_peak > peak {
                peak = season_peak;
                peak_season = id.clone();
            }
            if current_act.is_empty() && id == &current_season {
                wins = info
                    .get("NumberOfWinsWithPlacements")
                    .or_else(|| info.get("NumberOfWins"))
                    .and_then(|v| v.as_u64())
                    .unwrap_or(0) as u32;
                games = info.get("NumberOfGames").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
                leaderboard = info
                    .get("LeaderboardRank")
                    .and_then(|v| v.as_u64())
                    .unwrap_or(0) as u32;
            }
        }
    }
    Mmr {
        tier,
        rr,
        peak,
        peak_season,
        wins,
        games,
        leaderboard,
    }
}

pub fn win_rate(mmr: &Mmr) -> u32 {
    if mmr.games > 0 {
        mmr.wins * 100 / mmr.games
    } else {
        0
    }
}

pub async fn fetch_names(
    ctx: &AuthContext,
    region: &Region,
    version: &str,
    puuids: &[String],
) -> HashMap<String, String> {
    let url = format!("{}/name-service/v2/players", region.pd_base());
    let body =
        crate::http::put_json_retry(&url, pvp_headers(ctx, version), &serde_json::json!(puuids))
            .await;
    let mut out = HashMap::new();
    if let Some(arr) = body.and_then(|v| v.as_array().cloned()) {
        for entry in arr {
            if let (Some(puuid), Some(name), Some(tag)) = (
                entry.get("Subject").and_then(|v| v.as_str()),
                entry.get("GameName").and_then(|v| v.as_str()),
                entry.get("TagLine").and_then(|v| v.as_str()),
            ) {
                out.insert(puuid.to_string(), format!("{name}#{tag}"));
            }
        }
    }
    out
}

pub async fn fetch_mmr(
    ctx: &AuthContext,
    region: &Region,
    version: &str,
    puuid: &str,
    current_act: &str,
) -> Option<Mmr> {
    let url = format!("{}/mmr/v1/players/{}", region.pd_base(), puuid);
    let body = get_json_retry(&url, ctx, version).await;
    body.map(|v| parse_mmr(&v, current_act))
}

pub async fn fetch_account_level(
    ctx: &AuthContext,
    region: &Region,
    version: &str,
    puuid: &str,
) -> u32 {
    let url = format!("{}/account-xp/v1/players/{}", region.pd_base(), puuid);
    let body = get_json_retry(&url, ctx, version).await;
    body.and_then(|v| {
        v.get("Progress")
            .and_then(|p| p.get("Level"))
            .and_then(|v| v.as_u64())
            .map(|v| v as u32)
    })
    .unwrap_or(0)
}

pub async fn fetch_loadout_card(
    ctx: &AuthContext,
    region: &Region,
    version: &str,
    puuid: &str,
) -> String {
    let url = format!(
        "{}/personalization/v2/players/{}/playerloadout",
        region.pd_base(),
        puuid
    );
    get_json_retry(&url, ctx, version)
        .await
        .and_then(|v| {
            v.get("Identity")
                .and_then(|i| i.get("PlayerCardID"))
                .and_then(|c| c.as_str())
                .map(String::from)
        })
        .unwrap_or_default()
}

pub fn parse_history(json: &Value, sd: &StaticData) -> Vec<HistoryEntry> {
    let matches = match json.get("Matches").and_then(|m| m.as_array()) {
        Some(arr) => arr,
        None => return Vec::new(),
    };
    matches
        .iter()
        .map(|m| {
            let tier = m
                .get("TierAfterUpdate")
                .and_then(|v| v.as_u64())
                .unwrap_or(0) as u32;
            let map_id = m.get("MapID").and_then(|v| v.as_str()).unwrap_or("");
            HistoryEntry {
                map: sd.map_name(map_id),
                map_image: sd.map_image(map_id),
                rr_change: m
                    .get("RankedRatingEarned")
                    .and_then(|v| v.as_i64())
                    .unwrap_or(0) as i32,
                tier,
                rank_name: sd.rank_name(tier),
                ranked: true,
                ..Default::default()
            }
        })
        .collect()
}

pub fn headshot_pct(detail: &Value, puuid: &str) -> u32 {
    let (mut head, mut body, mut leg) = (0u64, 0u64, 0u64);
    if let Some(rounds) = detail.get("roundResults").and_then(|r| r.as_array()) {
        for round in rounds {
            if let Some(stats) = round.get("playerStats").and_then(|p| p.as_array()) {
                for ps in stats {
                    if ps.get("subject").and_then(|v| v.as_str()) != Some(puuid) {
                        continue;
                    }
                    if let Some(damage) = ps.get("damage").and_then(|d| d.as_array()) {
                        for d in damage {
                            head += d.get("headshots").and_then(|v| v.as_u64()).unwrap_or(0);
                            body += d.get("bodyshots").and_then(|v| v.as_u64()).unwrap_or(0);
                            leg += d.get("legshots").and_then(|v| v.as_u64()).unwrap_or(0);
                        }
                    }
                }
            }
        }
    }
    let total = head + body + leg;
    if total > 0 {
        (head * 100 / total) as u32
    } else {
        0
    }
}

pub async fn fetch_match_detail(
    ctx: &AuthContext,
    region: &Region,
    version: &str,
    match_id: &str,
) -> Option<Value> {
    let url = format!("{}/match-details/v1/matches/{}", region.pd_base(), match_id);
    get_json_retry(&url, ctx, version).await
}

#[derive(Clone, Default)]
pub struct MatchStats {
    pub kills: u32,
    pub deaths: u32,
    pub assists: u32,
    pub acs: u32,
    pub adr: u32,
    pub kast: u32,
    pub hs: u32,
    pub self_rounds: u32,
    pub enemy_rounds: u32,
    pub won: bool,
    pub map: String,
    pub map_image: String,
    pub agent_icon: String,
    pub agent_name: String,
    pub scoreboard: Vec<ScoreEntry>,
}

pub fn parse_match_stats(detail: &Value, puuid: &str, sd: &StaticData) -> MatchStats {
    let players = detail.get("players").and_then(|p| p.as_array());
    let me = match players.and_then(|arr| {
        arr.iter()
            .find(|p| p.get("subject").and_then(|v| v.as_str()) == Some(puuid))
    }) {
        Some(m) => m,
        None => return MatchStats::default(),
    };
    let character_id = me.get("characterId").and_then(|v| v.as_str()).unwrap_or("");
    let team_id = me.get("teamId").and_then(|v| v.as_str()).unwrap_or("");
    let match_info = detail.get("matchInfo");
    let map_path = match_info
        .and_then(|m| m.get("mapId"))
        .and_then(|v| v.as_str())
        .unwrap_or("");
    let queue_id = match_info
        .and_then(|m| m.get("queueId"))
        .and_then(|v| v.as_str())
        .unwrap_or("");
    let rounds_based = crate::presence::has_rounds(queue_id);
    let stat = |k: &str| {
        me.get("stats")
            .and_then(|s| s.get(k))
            .and_then(|v| v.as_u64())
            .unwrap_or(0) as u32
    };
    let rounds = stat("roundsPlayed").max(1);
    let acs = if rounds_based { stat("score") / rounds } else { 0 };
    let hs = if rounds_based { headshot_pct(detail, puuid) } else { 0 };

    let mut won = false;
    let mut self_rounds = 0;
    let mut enemy_rounds = 0;
    if let Some(teams) = detail.get("teams").and_then(|t| t.as_array()) {
        for t in teams {
            let r = t.get("roundsWon").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
            if t.get("teamId").and_then(|v| v.as_str()) == Some(team_id) {
                self_rounds = r;
                won = t.get("won").and_then(|v| v.as_bool()).unwrap_or(false);
            } else {
                enemy_rounds = enemy_rounds.max(r);
            }
        }
    }

    // ADR: sum damageDealt across all rounds for this player
    let adr = if rounds_based {
        let mut total_damage = 0u64;
        if let Some(rounds_arr) = detail.get("roundResults").and_then(|r| r.as_array()) {
            for round in rounds_arr {
                if let Some(ps_arr) = round.get("playerStats").and_then(|p| p.as_array()) {
                    for ps in ps_arr {
                        if ps.get("subject").and_then(|v| v.as_str()) != Some(puuid) {
                            continue;
                        }
                        total_damage += ps
                            .get("damageDealt")
                            .and_then(|v| v.as_u64())
                            .unwrap_or(0);
                    }
                }
            }
        }
        (total_damage / rounds as u64) as u32
    } else {
        0
    };

    // KAST: percentage of rounds where player got a Kill, Assist, Survived, or was Traded
    let kast = if rounds_based {
        let mut kast_rounds = 0u32;
        if let Some(rounds_arr) = detail.get("roundResults").and_then(|r| r.as_array()) {
            for round in rounds_arr {
                let mut killed = false;
                let mut assisted = false;
                let mut survived = false;
                let mut traded = false;

                // Check player stats for kills, assists, alive status
                if let Some(ps_arr) = round.get("playerStats").and_then(|p| p.as_array()) {
                    for ps in ps_arr {
                        let subject = ps.get("subject").and_then(|v| v.as_str());
                        if subject == Some(puuid) {
                            let kills = ps
                                .get("kills")
                                .and_then(|v| v.as_array())
                                .map(|a| a.len() as u32)
                                .unwrap_or(0);
                            let assists = ps
                                .get("assists")
                                .and_then(|v| v.as_array())
                                .map(|a| a.len() as u32)
                                .unwrap_or(0);
                            killed = kills > 0;
                            assisted = assists > 0;
                        }
                    }
                }

                // Refined alive check: player survived if they're in playerStats
                // and NOT in any kill's victim list
                if let Some(ps_arr) = round.get("playerStats").and_then(|p| p.as_array()) {
                    let is_self = |ps: &Value| {
                        ps.get("subject").and_then(|v| v.as_str()) == Some(puuid)
                    };
                    if ps_arr.iter().any(|ps| is_self(ps)) {
                        // Check if this player was killed: look for them in other players' kill lists
                        let was_killed = ps_arr.iter().any(|ps| {
                            if is_self(ps) {
                                return false;
                            }
                            if let Some(kills) = ps.get("kills").and_then(|k| k.as_array()) {
                                kills.iter().any(|k| {
                                    k.get("victim")
                                        .and_then(|v| v.as_str())
                                        == Some(puuid)
                                })
                            } else {
                                false
                            }
                        });
                        survived = !was_killed;

                        // Check trade: player was killed, but a teammate killed the
                        // attacker within the same round
                        if was_killed {
                            // Find who killed us
                            if let Some(attacker) = ps_arr.iter().find_map(|ps| {
                                if is_self(ps) {
                                    return None;
                                }
                                let kills = ps.get("kills").and_then(|k| k.as_array())?;
                                let kill = kills.iter().find(|k| {
                                    k.get("victim")
                                        .and_then(|v| v.as_str())
                                        == Some(puuid)
                                })?;
                                kill.get("killer")
                                    .and_then(|v| v.as_str())
                                    .map(String::from)
                            }) {
                                // Did a teammate kill the attacker?
                                traded = ps_arr.iter().any(|ps| {
                                    if is_self(ps) {
                                        return false;
                                    }
                                    // Check team: if both self and ps are on the same team
                                    // (we can't easily check team here, so check if ps killed
                                    // the attacker)
                                    let kills = match ps.get("kills").and_then(|k| k.as_array()) {
                                        Some(k) => k,
                                        None => return false,
                                    };
                                    kills.iter().any(|k| {
                                        k.get("victim")
                                            .and_then(|v| v.as_str())
                                            .as_deref()
                                            == Some(attacker.as_str())
                                    })
                                });
                            }
                        }
                    }
                }

                if killed || assisted || survived || traded {
                    kast_rounds += 1;
                }
            }
        }
        let total = rounds.max(1);
        (kast_rounds * 100 / total) as u32
    } else {
        0
    };

    let mut scoreboard = Vec::new();
    if let Some(arr) = players {
        for p in arr {
            let subject = p.get("subject").and_then(|v| v.as_str()).unwrap_or("");
            let team = p.get("teamId").and_then(|v| v.as_str()).unwrap_or("");
            let agent = p.get("characterId").and_then(|v| v.as_str()).unwrap_or("");
            let g = |k: &str| {
                p.get("stats")
                    .and_then(|s| s.get(k))
                    .and_then(|v| v.as_u64())
                    .unwrap_or(0) as u32
            };
            let rp = g("roundsPlayed").max(1);
            let game_name = p.get("gameName").and_then(|v| v.as_str()).unwrap_or("");
            let tag = p.get("tagLine").and_then(|v| v.as_str()).unwrap_or("");
            scoreboard.push(ScoreEntry {
                name: if game_name.is_empty() {
                    String::new()
                } else {
                    format!("{game_name}#{tag}")
                },
                agent_icon: sd.agent_icon(agent),
                kills: g("kills"),
                deaths: g("deaths"),
                assists: g("assists"),
                acs: if rounds_based { g("score") / rp } else { 0 },
                hs: if rounds_based { headshot_pct(detail, subject) } else { 0 },
                ally: team == team_id,
                is_self: subject == puuid,
            });
        }
        scoreboard.sort_by(|a, b| b.ally.cmp(&a.ally).then(b.acs.cmp(&a.acs)));
    }

    MatchStats {
        kills: stat("kills"),
        deaths: stat("deaths"),
        assists: stat("assists"),
        acs,
        adr,
        kast,
        hs,
        self_rounds,
        enemy_rounds,
        won,
        map: sd.map_name(map_path),
        map_image: sd.map_image(map_path),
        agent_icon: sd.agent_icon(character_id),
        agent_name: sd.agent_name(character_id),
        scoreboard,
    }
}

pub async fn build_self(
    ctx: &AuthContext,
    region: &Region,
    version: &str,
    current_act: &str,
    sd: &StaticData,
    party_map: &HashMap<String, String>,
) -> Option<PlayerRow> {
    let mmr = fetch_mmr(ctx, region, version, &ctx.puuid, current_act).await?;
    let puuids = [ctx.puuid.clone()];
    let names = fetch_names(ctx, region, version, &puuids).await;
    let level = fetch_account_level(ctx, region, version, &ctx.puuid).await;
    let card_id = fetch_loadout_card(ctx, region, version, &ctx.puuid).await;
    Some(PlayerRow {
        puuid: ctx.puuid.clone(),
        name: names.get(&ctx.puuid).cloned().unwrap_or_default(),
        player_card: sd.card_art(&card_id),
        agent: String::new(),
        agent_icon: String::new(),
        team: String::new(),
        party_id: party_map.get(&ctx.puuid).cloned().unwrap_or_default(),
        hidden_name: false,
        rank_tier: mmr.tier,
        rank_name: sd.rank_name(mmr.tier),
        rank_icon: sd.rank_icon(mmr.tier),
        rr: mmr.rr,
        peak_rank_name: sd.rank_name(mmr.peak),
        peak_rank_tier: mmr.peak,
        peak_rank_icon: sd.rank_icon(mmr.peak),
        peak_act: sd.season_label(&mmr.peak_season),
        win_rate: win_rate(&mmr),
        wins: mmr.wins,
        games: mmr.games,
        leaderboard: mmr.leaderboard,
        account_level: level,
        streak: 0,
        rr_trend: 0,
        recent_wins: 0,
        recent_losses: 0,
        smurf_score: 0,
        party_size: 0,
        locked: false,
        ..Default::default()
    })
}

pub async fn build_rows(
    ctx: &AuthContext,
    region: &Region,
    version: &str,
    current_act: &str,
    players: &[RawPlayer],
    sd: &StaticData,
    last_rows: &[PlayerRow],
    party_map: &HashMap<String, String>,
) -> Vec<PlayerRow> {
    let puuids: Vec<String> = players.iter().map(|p| p.puuid.clone()).collect();
    let names = fetch_names(ctx, region, version, &puuids).await;
    let self_level = fetch_account_level(ctx, region, version, &ctx.puuid).await;
    let self_team = players
        .iter()
        .find(|p| p.puuid == ctx.puuid)
        .map(|p| p.team.clone());

    const MMR_CONCURRENCY: usize = 4;
    let mut mmr_results = Vec::with_capacity(players.len());
    for chunk in players.chunks(MMR_CONCURRENCY) {
        let part = futures::future::join_all(chunk.iter().map(|p| {
            let puuid = p.puuid.clone();
            async move { fetch_mmr(&ctx, region, &version, &puuid, current_act).await }
        }))
        .await;
        mmr_results.extend(part);
    }

    let mut rows = Vec::with_capacity(players.len());
    for (p, mmr_opt) in players.iter().zip(mmr_results) {
        let rank_failed = mmr_opt.is_none();
        let mmr = mmr_opt.unwrap_or_default();
        let team = match (&self_team, p.team.is_empty()) {
            (_, true) => String::new(),
            (Some(mine), _) if &p.team == mine => "Ally".to_string(),
            (Some(_), _) => "Enemy".to_string(),
            (None, _) => p.team.clone(),
        };
        let is_self = p.puuid == ctx.puuid;
        let hidden_name = p.incognito && !is_self;
        let name = if hidden_name {
            String::new()
        } else {
            names.get(&p.puuid).cloned().unwrap_or_default()
        };
        let account_level = if is_self && self_level > 0 {
            self_level
        } else {
            p.account_level
        };
        let party_id = party_map.get(&p.puuid).cloned().unwrap_or_default();
        let party_size = if party_id.is_empty() {
            1
        } else {
            players
                .iter()
                .filter(|q| party_map.get(&q.puuid).map(|s| s.as_str()) == Some(party_id.as_str()))
                .count() as u32
        };
        let mut row = PlayerRow {
            puuid: p.puuid.clone(),
            name,
            player_card: sd.card_art(&p.player_card_id),
            agent: sd.agent_name(&p.character_id),
            agent_icon: sd.agent_icon(&p.character_id),
            team,
            party_id,
            hidden_name,
            rank_tier: mmr.tier,
            rank_name: sd.rank_name(mmr.tier),
            rank_icon: sd.rank_icon(mmr.tier),
            rr: mmr.rr,
            peak_rank_name: sd.rank_name(mmr.peak),
            peak_rank_tier: mmr.peak,
            peak_rank_icon: sd.rank_icon(mmr.peak),
            peak_act: sd.season_label(&mmr.peak_season),
            win_rate: win_rate(&mmr),
            wins: mmr.wins,
            games: mmr.games,
            leaderboard: mmr.leaderboard,
            account_level,
            locked: p.locked,
            party_size,
            ..Default::default()
        };
        if rank_failed {
            if let Some(prev) = last_rows.iter().find(|r| r.puuid == p.puuid) {
                row.rank_tier = prev.rank_tier;
                row.rank_name = prev.rank_name.clone();
                row.rank_icon = prev.rank_icon.clone();
                row.rr = prev.rr;
                row.peak_rank_name = prev.peak_rank_name.clone();
                row.peak_rank_tier = prev.peak_rank_tier;
                row.peak_act = prev.peak_act.clone();
                row.win_rate = prev.win_rate;
                row.wins = prev.wins;
                row.games = prev.games;
                row.leaderboard = prev.leaderboard;
            }
        }
        rows.push(row);
    }
    rows
}

pub fn refresh_rows(
    last: &[PlayerRow],
    raw: &[RawPlayer],
    sd: &StaticData,
) -> Vec<PlayerRow> {
    raw.iter()
        .map(|p| {
            if let Some(prev) = last.iter().find(|r| r.puuid == p.puuid) {
                let mut row = prev.clone();
                row.agent = sd.agent_name(&p.character_id);
                row.agent_icon = sd.agent_icon(&p.character_id);
                row.locked = p.locked;
                row
            } else {
                PlayerRow {
                    puuid: p.puuid.clone(),
                    agent: sd.agent_name(&p.character_id),
                    agent_icon: sd.agent_icon(&p.character_id),
                    locked: p.locked,
                    ..Default::default()
                }
            }
        })
        .collect()
}

pub async fn fetch_history(
    ctx: &AuthContext,
    region: &Region,
    version: &str,
    sd: &StaticData,
) -> Vec<HistoryEntry> {
    let url = format!(
        "{}/mmr/v1/players/{}/competitiveupdates?startIndex=0&endIndex=15&queue=competitive",
        region.pd_base(),
        ctx.puuid
    );
    let json = match get_json_retry(&url, ctx, version).await {
        Some(j) => j,
        None => return Vec::new(),
    };
    let mut entries = parse_history(&json, sd);
    let ids: Vec<String> = json
        .get("Matches")
        .and_then(|m| m.as_array())
        .map(|arr| {
            arr.iter()
                .map(|m| m.get("MatchID").and_then(|v| v.as_str()).unwrap_or("").to_string())
                .collect()
        })
        .unwrap_or_default();
    for (entry, id) in entries.iter_mut().zip(ids) {
        entry.match_id = id.clone();
        if id.is_empty() {
            continue;
        }
        if let Some(detail) = fetch_match_detail(ctx, region, version, &id).await {
            let stats = parse_match_stats(&detail, &ctx.puuid, sd);
            entry.agent_icon = stats.agent_icon;
            entry.agent_name = stats.agent_name;
            entry.kills = stats.kills;
            entry.deaths = stats.deaths;
            entry.assists = stats.assists;
            entry.acs = stats.acs;
            entry.adr = stats.adr;
            entry.kast = stats.kast;
            entry.hs = stats.hs;
            entry.self_rounds = stats.self_rounds;
            entry.enemy_rounds = stats.enemy_rounds;
            entry.won = stats.won;
            if !stats.map.is_empty() {
                entry.map = stats.map;
                entry.map_image = stats.map_image;
            }
            entry.scoreboard = stats.scoreboard;
            entry.has_stats = true;
        }
    }
    entries
}

pub fn compute_agent_stats(history: &[HistoryEntry], _sd: &StaticData) -> Vec<crate::model::AgentStats> {
    use std::collections::HashMap;
    let mut map: HashMap<String, crate::model::AgentStats> = HashMap::new();

    for h in history {
        if !h.has_stats || h.agent_name.is_empty() {
            continue;
        }
        let entry = map.entry(h.agent_name.clone()).or_insert_with(|| crate::model::AgentStats {
            agent_name: h.agent_name.clone(),
            agent_icon: h.agent_icon.clone(),
            ..Default::default()
        });
        entry.games += 1;
        if h.won {
            entry.wins += 1;
        }
        entry.kills += h.kills;
        entry.deaths += h.deaths;
        entry.assists += h.assists;
        entry.hs += h.hs;
        entry.acs += h.acs;
        entry.adr += h.adr;
        entry.kast += h.kast;
    }

    let mut stats: Vec<crate::model::AgentStats> = map.into_values().collect();
    for s in &mut stats {
        if s.games > 0 {
            s.win_rate = s.wins * 100 / s.games;
            s.hs /= s.games;
            s.acs /= s.games;
            s.adr /= s.games;
            s.kast /= s.games;
        }
    }
    stats.sort_by(|a, b| b.games.cmp(&a.games));
    stats
}

pub fn compute_map_stats(history: &[HistoryEntry], _sd: &StaticData) -> Vec<crate::model::MapStats> {
    use std::collections::HashMap;
    let mut map: HashMap<String, crate::model::MapStats> = HashMap::new();

    for h in history {
        if !h.has_stats || h.map.is_empty() {
            continue;
        }
        let entry = map.entry(h.map.clone()).or_insert_with(|| crate::model::MapStats {
            map_name: h.map.clone(),
            ..Default::default()
        });
        entry.games += 1;
        if h.won {
            entry.wins += 1;
        }
        entry.kills += h.kills;
        entry.deaths += h.deaths;
        entry.assists += h.assists;
    }

    let mut stats: Vec<crate::model::MapStats> = map.into_values().collect();
    for s in &mut stats {
        if s.games > 0 {
            s.win_rate = s.wins * 100 / s.games;
        }
    }
    stats.sort_by(|a, b| b.games.cmp(&a.games));
    stats
}
