use crate::auth::{pvp_headers, AuthContext};
use crate::client_version::Region;
use crate::model::MatchState;
use serde_json::Value;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RawPlayer {
    pub puuid: String,
    pub team: String,
    pub character_id: String,
    pub account_level: u32,
    pub incognito: bool,
    pub player_card_id: String,
    pub locked: bool,
}

pub fn parse_match_players(json: &Value) -> Vec<RawPlayer> {
    let arr = match json.get("Players").and_then(|p| p.as_array()) {
        Some(a) => a,
        None => return Vec::new(),
    };
    arr.iter()
        .map(|p| {
            let s = |k: &str| p.get(k).and_then(|v| v.as_str()).unwrap_or("").to_string();
            let identity = p.get("PlayerIdentity");
            let id_u64 = |k: &str| {
                identity
                    .and_then(|id| id.get(k))
                    .and_then(|v| v.as_u64())
                    .unwrap_or(0)
            };
            let id_bool = |k: &str| {
                identity
                    .and_then(|id| id.get(k))
                    .and_then(|v| v.as_bool())
                    .unwrap_or(false)
            };
            let id_str = |k: &str| {
                identity
                    .and_then(|id| id.get(k))
                    .and_then(|v| v.as_str())
                    .unwrap_or("")
                    .to_string()
            };
            RawPlayer {
                puuid: s("Subject"),
                team: s("TeamID"),
                character_id: s("CharacterID"),
                account_level: id_u64("AccountLevel") as u32,
                incognito: id_bool("Incognito"),
                player_card_id: id_str("PlayerCardID"),
                locked: s("CharacterSelectionState") == "locked",
            }
        })
        .collect()
}

async fn match_id(url: &str, headers: &reqwest::header::HeaderMap) -> Option<String> {
    crate::http::get_json_retry(url, headers.clone())
        .await
        .and_then(|v| v.get("MatchID").and_then(|m| m.as_str()).map(String::from))
}

async fn fetch_doc(url: &str, headers: &reqwest::header::HeaderMap) -> Option<Value> {
    crate::http::get_json_retry(url, headers.clone()).await
}

pub struct CurrentState {
    pub state: MatchState,
    pub match_id: Option<String>,
    pub players: Vec<RawPlayer>,
    pub phase_time: u32,
}

async fn try_coregame(
    ctx: &AuthContext,
    region: &Region,
    headers: &reqwest::header::HeaderMap,
) -> Option<CurrentState> {
    let player = format!("{}/core-game/v1/players/{}", region.glz_base(), ctx.puuid);
    let mid = match_id(&player, headers).await?;
    let murl = format!("{}/core-game/v1/matches/{}", region.glz_base(), mid);
    let players = fetch_doc(&murl, headers)
        .await
        .map(|v| parse_match_players(&v))
        .unwrap_or_default();
    Some(CurrentState {
        state: MatchState::CoreGame,
        match_id: Some(mid),
        players,
        phase_time: 0,
    })
}

async fn try_pregame(
    ctx: &AuthContext,
    region: &Region,
    headers: &reqwest::header::HeaderMap,
) -> Option<CurrentState> {
    let player = format!("{}/pregame/v1/players/{}", region.glz_base(), ctx.puuid);
    let mid = match_id(&player, headers).await?;
    let murl = format!("{}/pregame/v1/matches/{}", region.glz_base(), mid);
    let doc = fetch_doc(&murl, headers).await;
    let players = doc
        .as_ref()
        .and_then(|v| v.get("AllyTeam"))
        .map(parse_match_players)
        .unwrap_or_default();
    let phase_time = doc
        .as_ref()
        .and_then(|v| v.get("PhaseTimeRemainingNS"))
        .and_then(|v| v.as_u64())
        .map(|ns| (ns / 1_000_000_000) as u32)
        .unwrap_or(0);
    Some(CurrentState {
        state: MatchState::PreGame,
        match_id: Some(mid),
        players,
        phase_time,
    })
}

pub async fn current_state(
    ctx: &AuthContext,
    region: &Region,
    version: &str,
    loop_state: &str,
) -> CurrentState {
    let headers = pvp_headers(ctx, version);
    let pregame_first = loop_state == "PREGAME";
    let found = if pregame_first {
        match try_pregame(ctx, region, &headers).await {
            Some(s) => Some(s),
            None => try_coregame(ctx, region, &headers).await,
        }
    } else {
        match try_coregame(ctx, region, &headers).await {
            Some(s) => Some(s),
            None => try_pregame(ctx, region, &headers).await,
        }
    };
    found.unwrap_or(CurrentState {
        state: MatchState::Menu,
        match_id: None,
        players: Vec::new(),
        phase_time: 0,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_coregame_players() {
        let v: Value = serde_json::from_str(
            r#"{"Players":[
                {"Subject":"p1","TeamID":"Blue","CharacterID":"add6443a-41bd-e414-f6ad-e58d267f4e95","PlayerIdentity":{"AccountLevel":120}},
                {"Subject":"p2","TeamID":"Red","CharacterID":""}
            ]}"#,
        )
        .unwrap();
        let players = parse_match_players(&v);
        assert_eq!(players.len(), 2);
        assert_eq!(players[0].puuid, "p1");
        assert_eq!(players[0].team, "Blue");
        assert_eq!(players[0].account_level, 120);
    }

    #[test]
    fn reads_pregame_lock_state() {
        let v: Value = serde_json::from_str(
            r#"{"Players":[
                {"Subject":"p1","CharacterID":"x","CharacterSelectionState":"locked"},
                {"Subject":"p2","CharacterID":"","CharacterSelectionState":"selected"}
            ]}"#,
        )
        .unwrap();
        let players = parse_match_players(&v);
        assert!(players[0].locked);
        assert!(!players[1].locked);
    }
}
