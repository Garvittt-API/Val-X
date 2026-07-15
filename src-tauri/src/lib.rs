mod auth;
mod client_version;
mod encounter;
mod fetcher;
mod http;
mod lockfile;
mod match_state;
mod model;
mod orchestrator;
mod presence;
mod static_cache;
mod val_api;
mod websocket;

use client_version::detect_region_from_log;
use model::{MatchView, PlayerProfile};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tokio::sync::Notify;

static COMBAT_ENABLED: AtomicBool = AtomicBool::new(false);

#[tauri::command]
async fn get_match_view(app: tauri::AppHandle) -> Result<MatchView, String> {
    let _ = app;
    Err("Use event listener instead".into())
}

#[tauri::command]
async fn toggle_combat_stats() -> bool {
    let current = COMBAT_ENABLED.load(Ordering::Relaxed);
    COMBAT_ENABLED.store(!current, Ordering::Relaxed);
    !current
}

#[tauri::command]
async fn search_player(query: String) -> Result<PlayerProfile, String> {
    let lf = lockfile::read_lockfile().map_err(|e| format!("Lockfile error: {e:?}"))?;
    let ctx = auth::fetch_auth(&lf)
        .await
        .map_err(|e| format!("Auth error: {e:?}"))?;

    let region = detect_region_from_log().unwrap_or_else(|| client_version::Region {
        region: "na".to_string(),
        shard: "na".to_string(),
    });

    let version = client_version::fetch_client_version()
        .await
        .unwrap_or_else(|_| "release-08.11-shipping-22-671922".to_string());

    // Parse Riot ID (name#tag)
    let parts: Vec<&str> = query.split('#').collect();
    if parts.len() != 2 {
        return Err("Invalid format. Use Name#Tag".into());
    }
    let game_name = parts[0].trim();
    let tag_line = parts[1].trim();

    if game_name.is_empty() || tag_line.is_empty() {
        return Err("Name and tag cannot be empty".into());
    }

    // Search the current match roster for this player
    let presence = presence::fetch_self_presence(&lf, &ctx.puuid).await;
    let loop_state = presence.as_ref().map(|p| p.loop_state.as_str()).unwrap_or("");

    if loop_state == "PREGAME" || loop_state == "INGAME" {
        let state = match_state::current_state(&ctx, &region, &version, loop_state).await;
        let puuids: Vec<String> = state.players.iter().map(|p| p.puuid.clone()).collect();
        let names = fetcher::fetch_names(&ctx, &region, &version, &puuids).await;

        // Find player by name#tag
        for raw in &state.players {
            if let Some(name) = names.get(&raw.puuid) {
                if name.eq_ignore_ascii_case(&format!("{game_name}#{tag_line}")) {
                    // Found in match - fetch full profile
                    let mmr = fetcher::fetch_mmr(&ctx, &region, &version, &raw.puuid, "")
                        .await
                        .unwrap_or_default();
                    let level = fetcher::fetch_account_level(&ctx, &region, &version, &raw.puuid).await;
                    let sd = static_cache::StaticData::load_or_fetch(
                        &std::path::PathBuf::from(".").join("static"),
                    );
                    let history = fetcher::fetch_history(&ctx, &region, &version, &sd).await;

                    return Ok(PlayerProfile {
                        puuid: raw.puuid.clone(),
                        name: name.clone(),
                        level,
                        rank_tier: mmr.tier,
                        rank_name: sd.rank_name(mmr.tier),
                        rank_icon: sd.rank_icon(mmr.tier),
                        peak_rank_name: sd.rank_name(mmr.peak),
                        peak_rank_tier: mmr.peak,
                        peak_rank_icon: sd.rank_icon(mmr.peak),
                        win_rate: fetcher::win_rate(&mmr),
                        wins: mmr.wins,
                        games: mmr.games,
                        history,
                    });
                }
            }
        }
    }

    // Player not found in current match - return partial profile with name
    Ok(PlayerProfile {
        name: query,
        ..Default::default()
    })
}

#[tauri::command]
async fn get_overlay_position() -> Result<(i32, i32, u32, u32), String> {
    Ok((100, 10, 800, 400))
}

#[tauri::command]
async fn get_loadout() -> Result<serde_json::Value, String> {
    let lf = lockfile::read_lockfile().map_err(|e| format!("Lockfile error: {e:?}"))?;
    let ctx = auth::fetch_auth(&lf)
        .await
        .map_err(|e| format!("Auth error: {e:?}"))?;

    let region = detect_region_from_log().unwrap_or_else(|| client_version::Region {
        region: "na".to_string(),
        shard: "na".to_string(),
    });

    let version = client_version::fetch_client_version()
        .await
        .unwrap_or_else(|_| "release-08.11-shipping-22-671922".to_string());

    let url = format!(
        "{}/personalization/v2/players/{}/playerloadout",
        region.pd_base(),
        ctx.puuid
    );

    crate::http::get_json_retry(&url, auth::pvp_headers(&ctx, &version))
        .await
        .ok_or_else(|| "Failed to fetch loadout".to_string())
}

static OVERLAY_OPEN: AtomicBool = AtomicBool::new(false);

#[tauri::command]
async fn toggle_overlay(app: tauri::AppHandle) -> Result<bool, String> {
    use tauri::Manager;

    if OVERLAY_OPEN.load(Ordering::Relaxed) {
        // Close overlay window
        if let Some(overlay) = app.get_webview_window("overlay") {
            overlay.close().map_err(|e| e.to_string())?;
        }
        OVERLAY_OPEN.store(false, Ordering::Relaxed);
        Ok(false)
    } else {
        // Create overlay window
        let _overlay = tauri::WebviewWindowBuilder::new(
            &app,
            "overlay",
            tauri::WebviewUrl::App("overlay.html".into()),
        )
        .title("ValX Overlay")
        .inner_size(600.0, 300.0)
        .resizable(true)
        .decorations(false)
        .transparent(true)
        .always_on_top(true)
        .skip_taskbar(true)
        .position(100.0, 10.0)
        .build()
        .map_err(|e| e.to_string())?;

        OVERLAY_OPEN.store(true, Ordering::Relaxed);
        Ok(true)
    }
}

#[tauri::command]
async fn get_matchlist(puuid: String, api_key: String) -> Result<serde_json::Value, String> {
    let region = detect_region_from_log().unwrap_or_else(|| client_version::Region {
        region: "na".to_string(),
        shard: "na".to_string(),
    });
    val_api::fetch_matchlist(&region, &puuid, &api_key)
        .await
        .ok_or_else(|| "Failed to fetch matchlist".to_string())
        .map(|v| serde_json::to_value(v).unwrap_or_default())
}

#[tauri::command]
async fn get_recent_matches(queue: String, api_key: String) -> Result<serde_json::Value, String> {
    let region = detect_region_from_log().unwrap_or_else(|| client_version::Region {
        region: "na".to_string(),
        shard: "na".to_string(),
    });
    val_api::fetch_recent_matches(&region, &queue, &api_key)
        .await
        .ok_or_else(|| "Failed to fetch recent matches".to_string())
}

#[tauri::command]
async fn get_leaderboard(act_id: String, api_key: String) -> Result<serde_json::Value, String> {
    let region = detect_region_from_log().unwrap_or_else(|| client_version::Region {
        region: "na".to_string(),
        shard: "na".to_string(),
    });
    val_api::fetch_leaderboard(&region, &act_id, &api_key)
        .await
        .ok_or_else(|| "Failed to fetch leaderboard".to_string())
        .map(|v| serde_json::to_value(v).unwrap_or_default())
}

#[tauri::command]
async fn get_server_status(api_key: String) -> Result<serde_json::Value, String> {
    val_api::fetch_platform_status(&api_key)
        .await
        .ok_or_else(|| "Failed to fetch server status".to_string())
        .map(|v| serde_json::to_value(v).unwrap_or_default())
}

#[tauri::command]
async fn window_minimize(app: tauri::AppHandle) -> Result<(), String> {
    use tauri::Manager;
    if let Some(win) = app.get_webview_window("main") {
        win.minimize().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn window_toggle_maximize(app: tauri::AppHandle) -> Result<(), String> {
    use tauri::Manager;
    if let Some(win) = app.get_webview_window("main") {
        if win.is_maximized().map_err(|e| e.to_string())? {
            win.unmaximize().map_err(|e| e.to_string())?;
        } else {
            win.maximize().map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}

#[tauri::command]
async fn window_close(app: tauri::AppHandle) -> Result<(), String> {
    use tauri::Manager;
    if let Some(win) = app.get_webview_window("main") {
        win.close().map_err(|e| e.to_string())?;
    }
    Ok(())
}

pub fn run() {
    let wake = Arc::new(Notify::new());
    let combat = Arc::new(AtomicBool::new(false));

    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _, _| {
            let _ = app;
        }))
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_match_view,
            toggle_combat_stats,
            search_player,
            get_overlay_position,
            get_loadout,
            toggle_overlay,
            get_matchlist,
            get_recent_matches,
            get_leaderboard,
            get_server_status,
            window_minimize,
            window_toggle_maximize,
            window_close,
        ])
        .setup(move |app| {
            let handle = app.handle().clone();
            let wake_clone = wake.clone();
            let combat_clone = combat.clone();
            tauri::async_runtime::spawn(async move {
                orchestrator::run_loop(handle, combat_clone, wake_clone).await;
            });

            let _tray = app.tray_by_id("main");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
