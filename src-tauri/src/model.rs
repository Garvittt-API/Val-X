use serde::Serialize;

#[derive(Serialize, Clone, Copy, Debug, PartialEq, Eq)]
pub enum MatchState {
    NoGame,
    Menu,
    PreGame,
    CoreGame,
}

#[derive(Serialize, Clone, Debug, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct PlayerRow {
    pub puuid: String,
    pub name: String,
    pub player_card: String,
    pub agent: String,
    pub agent_icon: String,
    pub team: String,
    pub party_id: String,
    pub hidden_name: bool,
    pub rank_tier: u32,
    pub rank_name: String,
    pub rank_icon: String,
    pub rr: u32,
    pub peak_rank_name: String,
    pub peak_rank_tier: u32,
    pub peak_rank_icon: String,
    pub peak_act: String,
    pub win_rate: u32,
    pub wins: u32,
    pub games: u32,
    pub leaderboard: u32,
    pub account_level: u32,
    pub last_kills: u32,
    pub last_deaths: u32,
    pub last_hs: u32,
    pub last_acs: u32,
    pub last_adr: u32,
    pub last_kast: u32,
    pub last_assists: u32,
    pub has_combat: bool,
    pub streak: i32,
    pub rr_trend: i32,
    pub recent_wins: u32,
    pub recent_losses: u32,
    pub smurf_score: u32,
    pub party_size: u32,
    pub encounters: u32,
    pub encounter_wins: u32,
    pub encounter_losses: u32,
    pub locked: bool,
    pub premium_skins: bool,
    pub vandal_skin: String,
    pub vandal_image: String,
    pub vandal_tier_color: String,
}

#[derive(Serialize, Clone, Debug, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct ScoreEntry {
    pub name: String,
    pub agent_icon: String,
    pub kills: u32,
    pub deaths: u32,
    pub assists: u32,
    pub acs: u32,
    pub hs: u32,
    pub ally: bool,
    pub is_self: bool,
}

#[derive(Serialize, Clone, Debug, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct HistoryEntry {
    pub match_id: String,
    pub map: String,
    pub rr_change: i32,
    pub tier: u32,
    pub rank_name: String,
    pub agent_icon: String,
    pub agent_name: String,
    pub map_image: String,
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
    pub ranked: bool,
    pub has_stats: bool,
    pub scoreboard: Vec<ScoreEntry>,
    pub round_timeline: Vec<RoundResult>,
    pub aces: u32,
    pub clutches: u32,
    pub first_bloods: u32,
    pub first_deaths: u32,
    pub plants: u32,
    pub defuses: u32,
    pub attack_rounds: u32,
    pub defense_rounds: u32,
    pub attack_won: u32,
    pub defense_won: u32,
    pub total_damage: u32,
}

#[derive(Serialize, Clone, Debug, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct RoundResult {
    pub round_num: u32,
    pub winning_team: String,
    pub is_pistol: bool,
    pub self_team: String,
}

#[derive(Serialize, Clone, Debug, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct MatchView {
    pub state: MatchState,
    pub mode: String,
    pub activity: String,
    pub players: Vec<PlayerRow>,
    pub me: Option<PlayerRow>,
    pub history: Vec<HistoryEntry>,
    pub stale: bool,
    pub phase_time: u32,
    pub map: String,
    pub map_image: String,
    pub ally_score: u32,
    pub enemy_score: u32,
    pub combat_loading: bool,
    pub history_queue: u8,
}

#[derive(Serialize, Clone, Debug, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct PlayerProfile {
    pub puuid: String,
    pub name: String,
    pub level: u32,
    pub rank_tier: u32,
    pub rank_name: String,
    pub rank_icon: String,
    pub peak_rank_name: String,
    pub peak_rank_tier: u32,
    pub peak_rank_icon: String,
    pub win_rate: u32,
    pub wins: u32,
    pub games: u32,
    pub history: Vec<HistoryEntry>,
}

#[derive(Serialize, Clone, Debug, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct AgentStats {
    pub agent_name: String,
    pub agent_icon: String,
    pub games: u32,
    pub wins: u32,
    pub win_rate: u32,
    pub kills: u32,
    pub deaths: u32,
    pub assists: u32,
    pub hs: u32,
    pub acs: u32,
    pub adr: u32,
    pub kast: u32,
}

#[derive(Serialize, Clone, Debug, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
pub struct MapStats {
    pub map_name: String,
    pub games: u32,
    pub wins: u32,
    pub win_rate: u32,
    pub kills: u32,
    pub deaths: u32,
    pub assists: u32,
    pub top_agent: String,
}

#[derive(Serialize, Clone, Debug, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase")]
#[allow(dead_code)]
pub struct WeaponStats {
    pub weapon_name: String,
    pub kills: u32,
    pub headshots: u32,
    pub hs_percent: u32,
    pub damage: u32,
    pub kpr: u32,
}
