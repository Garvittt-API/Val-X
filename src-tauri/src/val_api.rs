use crate::client_version::Region;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValMatchReference {
    #[serde(default)]
    pub match_id: String,
    #[serde(default)]
    pub game_start_timestamp: i64,
    #[serde(default)]
    pub map_id: String,
    #[serde(default)]
    pub mode_id: String,
    #[serde(default)]
    pub queue_id: String,
    #[serde(default)]
    pub season_id: String,
    #[serde(default)]
    pub character_id: String,
    #[serde(default)]
    pub team_id: String,
    #[serde(default)]
    pub account_level: u32,
    #[serde(default)]
    pub eligibility: bool,
    #[serde(default)]
    pub anticheat_activated: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MatchListResponse {
    #[serde(default)]
    pub puuid: String,
    #[serde(default, rename = "History")]
    pub history: Vec<ValMatchReference>,
    #[serde(default, rename = "StartTime")]
    pub start_time: i64,
    #[serde(default, rename = "EndTime")]
    pub end_time: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LeaderboardEntry {
    #[serde(default)]
    pub player_uuid: String,
    #[serde(default)]
    pub game_name: String,
    #[serde(default)]
    pub tag_line: String,
    #[serde(default)]
    pub leaderboard_rank: u32,
    #[serde(default)]
    pub ranked_rating: u32,
    #[serde(default)]
    pub competitive_tier: u32,
    #[serde(default)]
    pub ranked_rating_earned: i32,
    #[serde(default)]
    pub number_of_wins: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LeaderboardResponse {
    #[serde(default)]
    pub version: u64,
    #[serde(default)]
    pub season_id: String,
    #[serde(default)]
    pub act_id: String,
    #[serde(default)]
    pub total_players: u64,
    #[serde(default)]
    pub players: Vec<LeaderboardEntry>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlatformStatus {
    #[serde(default)]
    pub id: String,
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub current_game_version: String,
    #[serde(default)]
    pub current_client_version: String,
    #[serde(default)]
    pub asset_processing_timestamp: i64,
    #[serde(default)]
    pub status: String,
}

async fn get_public(url: &str, api_key: &str) -> Option<serde_json::Value> {
    let client = reqwest::Client::new();
    let resp = client
        .get(url)
        .header("X-Riot-Token", api_key)
        .send()
        .await
        .ok()?;
    if resp.status().is_success() {
        resp.json().await.ok()
    } else {
        None
    }
}

pub async fn fetch_matchlist(
    region: &Region,
    puuid: &str,
    api_key: &str,
) -> Option<MatchListResponse> {
    let url = format!(
        "{}/val/match/v1/matchlists/by-puuid/{}",
        region_to_base(region),
        puuid
    );
    get_public(&url, api_key).await.and_then(|v| serde_json::from_value(v).ok())
}

pub async fn fetch_recent_matches(
    region: &Region,
    queue: &str,
    api_key: &str,
) -> Option<serde_json::Value> {
    let url = format!(
        "{}/val/match/v1/recent-matches/by-queue/{}",
        region_to_base(region),
        queue
    );
    get_public(&url, api_key).await
}

pub async fn fetch_leaderboard(
    region: &Region,
    act_id: &str,
    api_key: &str,
) -> Option<LeaderboardResponse> {
    let url = format!(
        "{}/val/ranked/v1/leaderboards/by-act/{}?size=50&startIndex=0",
        region_to_base(region),
        act_id
    );
    get_public(&url, api_key).await.and_then(|v| serde_json::from_value(v).ok())
}

pub async fn fetch_platform_status(api_key: &str) -> Option<PlatformStatus> {
    let url = "https://na.api.riotgames.com/val/status/v1/platform-data";
    get_public(url, api_key).await.and_then(|v| serde_json::from_value(v).ok())
}

fn region_to_base(region: &Region) -> &str {
    match region.region.as_str() {
        "na" | "br" | "latam" | "kr" | "ap" => "https://americas.api.riotgames.com",
        "eu" => "https://eu.api.riotgames.com",
        "asia" => "https://asia.api.riotgames.com",
        _ => "https://americas.api.riotgames.com",
    }
}
