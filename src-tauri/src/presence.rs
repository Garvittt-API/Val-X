use crate::lockfile::Lockfile;
use base64::{engine::general_purpose::STANDARD, Engine};
use serde_json::Value;
use std::collections::HashMap;

#[derive(Default)]
pub struct Presence {
    pub loop_state: String,
    pub queue_id: String,
    pub party_state: String,
    pub provisioning_flow: String,
    pub is_idle: bool,
    pub party_owner_match_map: String,
    pub ally_score: u32,
    pub enemy_score: u32,
}

pub fn parse_private(decoded: &Value) -> Presence {
    let lookup = |key: &str| {
        decoded
            .get("matchPresenceData")
            .and_then(|d| d.get(key))
            .or_else(|| decoded.get("partyPresenceData").and_then(|d| d.get(key)))
            .or_else(|| decoded.get(key))
    };
    let read = |key: &str| {
        lookup(key)
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string()
    };
    let read_u32 = |key: &str| lookup(key).and_then(|v| v.as_u64()).unwrap_or(0) as u32;
    Presence {
        loop_state: read("sessionLoopState"),
        queue_id: read("queueId"),
        party_state: read("partyState"),
        provisioning_flow: read("provisioningFlow"),
        is_idle: lookup("isIdle").and_then(|v| v.as_bool()).unwrap_or(false),
        party_owner_match_map: read("partyOwnerMatchMap"),
        ally_score: read_u32("partyOwnerMatchScoreAllyTeam"),
        enemy_score: read_u32("partyOwnerMatchScoreEnemyTeam"),
    }
}

pub fn parse_party_id(decoded: &Value) -> Option<String> {
    let id = decoded
        .get("partyPresenceData")
        .and_then(|d| d.get("partyId"))
        .or_else(|| decoded.get("partyId"))
        .and_then(|v| v.as_str())
        .unwrap_or("");
    if id.is_empty() {
        None
    } else {
        Some(id.to_string())
    }
}

pub fn mode_name(queue_id: &str) -> String {
    match queue_id {
        "competitive" => "Competitive",
        "unrated" => "Unrated",
        "swiftplay" => "Swiftplay",
        "spikerush" => "Spike Rush",
        "deathmatch" => "Deathmatch",
        "ggteam" => "Escalation",
        "onefa" => "Replication",
        "hurm" => "Team Deathmatch",
        "snowball" => "Snowball Fight",
        "newmap" => "New Map",
        "custom" | "" => "Custom",
        other => other,
    }
    .to_string()
}

pub fn is_ffa(queue_id: &str) -> bool {
    queue_id == "deathmatch"
}

pub fn has_rounds(queue_id: &str) -> bool {
    !matches!(queue_id, "deathmatch" | "ggteam" | "snowball" | "hurm")
}

pub fn describe_activity(p: &Presence, mode: &str) -> String {
    match p.loop_state.as_str() {
        "INGAME" => format!("Playing {mode}"),
        "PREGAME" => format!("Agent Select - {mode}"),
        "MENUS" => {
            if p.provisioning_flow.eq_ignore_ascii_case("CustomGame")
                || p.party_state == "CUSTOM_GAME_SETUP"
            {
                "In a custom lobby".to_string()
            } else if p.party_state == "MATCHMAKING" {
                format!("In queue - {mode}")
            } else if p.is_idle {
                "Away".to_string()
            } else {
                "In the lobby".to_string()
            }
        }
        _ => "Idle".to_string(),
    }
}

async fn fetch_presences_raw(lf: &Lockfile) -> Option<Vec<Value>> {
    let url = format!("https://127.0.0.1:{}/chat/v4/presences", lf.port);
    let body: Value = crate::http::local_client()
        .get(url)
        .header("Authorization", crate::auth::basic_auth_header(&lf.password))
        .send()
        .await
        .ok()?
        .json()
        .await
        .ok()?;
    body.get("presences")?.as_array().cloned()
}

fn decode_private(entry: &Value) -> Option<Value> {
    let private_b64 = entry.get("private").and_then(|v| v.as_str())?;
    let decoded_bytes = STANDARD.decode(private_b64).ok()?;
    serde_json::from_slice(&decoded_bytes).ok()
}

pub async fn fetch_self_presence(lf: &Lockfile, puuid: &str) -> Option<Presence> {
    let presences = fetch_presences_raw(lf).await?;
    let me = presences
        .iter()
        .find(|p| p.get("puuid").and_then(|v| v.as_str()) == Some(puuid))?;
    let decoded = decode_private(me)?;
    Some(parse_private(&decoded))
}

pub async fn fetch_party_map(lf: &Lockfile) -> HashMap<String, String> {
    let mut map = HashMap::new();
    let presences = match fetch_presences_raw(lf).await {
        Some(p) => p,
        None => return map,
    };
    for entry in &presences {
        let puuid = match entry.get("puuid").and_then(|v| v.as_str()) {
            Some(p) => p,
            None => continue,
        };
        if let Some(party) = decode_private(entry).as_ref().and_then(parse_party_id) {
            map.insert(puuid.to_string(), party);
        }
    }
    map
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_flat_private() {
        let v: Value = serde_json::from_str(
            r#"{"sessionLoopState":"MENUS","queueId":"competitive","partyState":"MATCHMAKING"}"#,
        )
        .unwrap();
        let p = parse_private(&v);
        assert_eq!(p.loop_state, "MENUS");
        assert_eq!(p.queue_id, "competitive");
        assert_eq!(p.party_state, "MATCHMAKING");
    }

    #[test]
    fn parses_nested_private() {
        let v: Value = serde_json::from_str(
            r#"{"matchPresenceData":{"sessionLoopState":"PREGAME","queueId":"deathmatch"},"partyPresenceData":{"partyState":"DEFAULT"}}"#,
        )
        .unwrap();
        let p = parse_private(&v);
        assert_eq!(p.loop_state, "PREGAME");
        assert_eq!(p.queue_id, "deathmatch");
    }

    #[test]
    fn mode_name_maps() {
        assert_eq!(mode_name("hurm"), "Team Deathmatch");
        assert_eq!(mode_name("competitive"), "Competitive");
        assert_eq!(mode_name(""), "Custom");
    }
}
