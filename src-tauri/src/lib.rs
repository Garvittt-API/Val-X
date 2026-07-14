mod auth;
mod client_version;
mod fetcher;
mod http;
mod lockfile;
mod match_state;
mod model;
mod orchestrator;
mod presence;
mod static_cache;
mod websocket;

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
    let _lf = lockfile::read_lockfile().map_err(|e| format!("Lockfile error: {e:?}"))?;

    // Parse Riot ID (name#tag)
    let parts: Vec<&str> = query.split('#').collect();
    if parts.len() != 2 {
        return Err("Invalid format. Use Name#Tag".into());
    }

    // For now, return a basic profile
    Ok(PlayerProfile {
        name: query,
        ..Default::default()
    })
}

#[tauri::command]
async fn get_overlay_position() -> Result<(i32, i32, u32, u32), String> {
    // Default position: top center of screen
    Ok((100, 10, 800, 400))
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
        ])
        .setup(move |app| {
            let handle = app.handle().clone();
            let wake_clone = wake.clone();
            let combat_clone = combat.clone();
            tauri::async_runtime::spawn(async move {
                orchestrator::run_loop(handle, combat_clone, wake_clone).await;
            });

            // System tray
            let _tray = app.tray_by_id("main");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
