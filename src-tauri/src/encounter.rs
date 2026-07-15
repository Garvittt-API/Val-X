use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::Path;

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct EncounterStore {
    encounters: HashMap<String, EncounterEntry>,
    match_history: Vec<MatchRecord>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EncounterEntry {
    pub puuid: String,
    pub name: String,
    pub times_seen: u32,
    pub wins: u32,
    pub losses: u32,
    pub last_seen: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MatchRecord {
    pub match_id: String,
    pub timestamp: i64,
    pub players: Vec<PlayerRecord>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlayerRecord {
    pub puuid: String,
    pub name: String,
    pub rank_tier: u32,
}

impl EncounterStore {
    pub fn load(path: &Path) -> Self {
        std::fs::read_to_string(path)
            .ok()
            .and_then(|data| serde_json::from_str(&data).ok())
            .unwrap_or_default()
    }

    pub fn save(&self, path: &Path) {
        if let Ok(data) = serde_json::to_string_pretty(self) {
            let _ = std::fs::write(path, data);
        }
    }

    pub fn prior(&self, puuid: &str) -> (u32, u32, u32) {
        if let Some(entry) = self.encounters.get(puuid) {
            (entry.times_seen, entry.wins, entry.losses)
        } else {
            (0, 0, 0)
        }
    }

    pub fn record_seen(&mut self, match_id: &str, roster: &[(String, String, u32)], now: i64) {
        for (puuid, name, _rank_tier) in roster {
            let entry = self.encounters.entry(puuid.clone()).or_insert_with(|| EncounterEntry {
                puuid: puuid.clone(),
                name: name.clone(),
                times_seen: 0,
                wins: 0,
                losses: 0,
                last_seen: 0,
            });
            entry.times_seen += 1;
            entry.last_seen = now;
        }

        self.match_history.push(MatchRecord {
            match_id: match_id.to_string(),
            timestamp: now,
            players: roster
                .iter()
                .map(|(puuid, name, rank_tier)| PlayerRecord {
                    puuid: puuid.clone(),
                    name: name.clone(),
                    rank_tier: *rank_tier,
                })
                .collect(),
        });

        // Keep only last 100 matches
        if self.match_history.len() > 100 {
            self.match_history.drain(0..self.match_history.len() - 100);
        }
    }

    #[allow(dead_code)]
    pub fn pending_ids(&self) -> Vec<String> {
        self.match_history
            .iter()
            .map(|m| m.match_id.clone())
            .collect()
    }

    pub fn apply_outcome(&mut self, match_id: &str, won: bool) {
        if let Some(record) = self.match_history.iter().find(|m| m.match_id == match_id) {
            let players: Vec<String> = record.players.iter().map(|p| p.puuid.clone()).collect();
            for puuid in &players {
                if let Some(entry) = self.encounters.get_mut(puuid) {
                    if won {
                        entry.wins += 1;
                    } else {
                        entry.losses += 1;
                    }
                }
            }
        }
        self.match_history.retain(|m| m.match_id != match_id);
    }
}
