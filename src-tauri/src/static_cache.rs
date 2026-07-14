#![allow(dead_code)]

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::Path;

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct StaticData {
    agents: HashMap<String, AgentInfo>,
    maps: HashMap<String, MapInfo>,
    ranks: HashMap<u32, RankInfo>,
    player_cards: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AgentInfo {
    #[serde(default)]
    name: String,
    #[serde(default)]
    display_name: String,
    #[serde(default)]
    display_icon: String,
    #[serde(default)]
    role: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MapInfo {
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub display_icon: String,
    #[serde(default, rename = "listViewIcon")]
    pub list_view_icon: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct RankInfo {
    #[serde(default)]
    name: String,
    #[serde(default)]
    icon: String,
    #[serde(default)]
    tier: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SkinInfo {
    #[serde(default)]
    name: String,
    #[serde(default)]
    content_tier_uuid: String,
    #[serde(default)]
    display_icon: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContentWrapper<T> {
    #[serde(default)]
    data: Vec<T>,
}

impl StaticData {
    pub fn load_or_fetch(cache_dir: &Path) -> Self {
        // Try to load from cache first
        if let Ok(data) = std::fs::read_to_string(cache_dir.join("static_data.json")) {
            if let Ok(parsed) = serde_json::from_str::<StaticData>(&data) {
                return parsed;
            }
        }

        // Build with hardcoded data as fallback
        let mut data = StaticData::default();
        data.init_hardcoded();
        data
    }

    fn init_hardcoded(&mut self) {
        // Agent data (hardcoded for reliability)
        let agents = vec![
            ("add6443a-41bd-e414-f6ad-e58d267f4e95", "Breach", "Duelist"),
            ("5fbfb8f3-4052-4953-a718-df8f4f44dcea", "Raze", "Duelist"),
            ("f93c45c4-4c28-4c5b-b39c-bcaf464dd662", "Chamber", "Sentinel"),
            ("ec24cf88-cce5-40cb-92fd-c9717839548c", "KAY/O", "Initiator"),
            ("1e58de9d-4912-4217-b1f0-3b014e5ab1aa", "Skye", "Initiator"),
            ("32014e88-4c85-3047-abd0-26632567de2a", "Yoru", "Duelist"),
            ("117ed1e1-4e13-4615-8115-556e13b15a26", "Sage", "Sentinel"),
            ("a3bfb853-43b2-7238-a4f5-adec0dc67e99", "Reyna", "Duelist"),
            ("bbf41388-4cf5-4111-9c4b-97563abed4bd", "Killjoy", "Sentinel"),
            ("5f7d04f1-4db6-46da-8680-1c6b9cf35c2c", "Brimstone", "Controller"),
            ("fe8a4204-47be-4060-3958-cc082dd5efa4", "Phoenix", "Duelist"),
            ("eb93388a-4ef1-40c7-a6e3-6713f99050cc", "Omen", "Controller"),
            ("ade39e7f-46fd-4539-be27-381ab48610b0", "Sova", "Initiator"),
            ("10540afa-4f9e-4e3c-81c9-3a85eab53b73", "Viper", "Controller"),
            ("36fb895f-4f5a-46b3-8239-2c8bfba4d9a5", "Cypher", "Sentinel"),
            ("c4de6704-41d2-46dd-989d-c82fb23ef536", "Jett", "Duelist"),
            ("a2463570-4ef9-49c0-bd63-37e9812f4ea3", "Neon", "Duelist"),
            ("d8665ce8-468c-403a-b1bf-031264e6f30e", "Harbor", "Controller"),
            ("601dbbe7-43ce-be57-4a7c-a10dcefc4627", "Fade", "Initiator"),
            ("e574740f-48b6-42b0-a2e0-7c2c022f14c8", "Gekko", "Initiator"),
            ("95b78670-42a4-4478-98f3-7df561fa0fbd", "Chamber", "Sentinel"),
            ("8ccf7815-45b5-47eb-8784-ab5a18cbd953", "Deadlock", "Sentinel"),
            ("b183d5b3-473a-4c04-a302-5947fda7e34b", "Clove", "Controller"),
            ("4e7ddc0c-4ff6-4746-8ff9-440349653b9d", "Waylay", "Initiator"),
            ("ff93d940-4796-4d43-a203-ae4c7e566ad7", "Vyse", "Sentinel"),
            ("22690a55-4bfa-4027-9200-f50a58376f29", "Iso", "Duelist"),
        ];

        for (id, name, role) in agents {
            self.agents.insert(
                id.to_string(),
                AgentInfo {
                    name: name.to_string(),
                    display_name: name.to_string(),
                    display_icon: String::new(),
                    role: role.to_string(),
                },
            );
        }

        // Rank data
        let ranks = vec![
            (0, "Unranked", ""),
            (3, "Iron 1", ""),
            (4, "Iron 2", ""),
            (5, "Iron 3", ""),
            (6, "Bronze 1", ""),
            (7, "Bronze 2", ""),
            (8, "Bronze 3", ""),
            (9, "Silver 1", ""),
            (10, "Silver 2", ""),
            (11, "Silver 3", ""),
            (12, "Gold 1", ""),
            (13, "Gold 2", ""),
            (14, "Gold 3", ""),
            (15, "Platinum 1", ""),
            (16, "Platinum 2", ""),
            (17, "Platinum 3", ""),
            (18, "Diamond 1", ""),
            (19, "Diamond 2", ""),
            (20, "Diamond 3", ""),
            (21, "Ascendant 1", ""),
            (22, "Ascendant 2", ""),
            (23, "Ascendant 3", ""),
            (24, "Immortal 1", ""),
            (25, "Immortal 2", ""),
            (26, "Immortal 3", ""),
            (27, "Radiant", ""),
        ];

        for (tier, name, icon) in ranks {
            self.ranks.insert(
                tier,
                RankInfo {
                    name: name.to_string(),
                    icon: icon.to_string(),
                    tier,
                },
            );
        }

        // Map data
        let maps = vec![
            ("0de97f44-49f6-4062-a2cc-6d72072b58b6", "Bind"),
            ("b52335db-45f8-40b8-9886-5f1aa9ac4480", "Haven"),
            ("d960549e-445b-42d3-bddb-4281529f3f09", "Split"),
            ("2c9d57ec-44cf-4e47-a185-1437f3f8807c", "Ascent"),
            ("eb93388a-4ef1-40c7-a6e3-6713f99050cc", "Icebox"),
            ("92584dfd-4d60-346e-e838-a3e7048be8b3", "Breeze"),
            ("2fb9a4fd-47b8-4e5d-908f-1fb63588c629", "Fracture"),
            ("fd267378-4110-4088-a3f2-d0207fb464d8", "Pearl"),
            ("92584dfd-4d60-346e-e838-a3e7048be8b3", "Lotus"),
            ("2fb9a4fd-47b8-4e5d-908f-1fb63588c629", "Sunset"),
        ];

        for (id, name) in maps {
            self.maps.insert(
                id.to_string(),
                MapInfo {
                    name: name.to_string(),
                    display_icon: String::new(),
                    list_view_icon: String::new(),
                },
            );
        }
    }

    pub fn agent_name(&self, id: &str) -> String {
        self.agents
            .get(id)
            .map(|a| a.name.clone())
            .unwrap_or_else(|| "Unknown".to_string())
    }

    pub fn agent_icon(&self, id: &str) -> String {
        self.agents
            .get(id)
            .map(|a| a.display_icon.clone())
            .unwrap_or_default()
    }

    pub fn agent_role(&self, id: &str) -> String {
        self.agents
            .get(id)
            .map(|a| a.role.clone())
            .unwrap_or_default()
    }

    pub fn map_name(&self, id: &str) -> String {
        self.maps
            .get(id)
            .map(|m| m.name.clone())
            .unwrap_or_else(|| "Unknown".to_string())
    }

    pub fn map_image(&self, id: &str) -> String {
        self.maps
            .get(id)
            .and_then(|m| {
                if !m.list_view_icon.is_empty() {
                    Some(m.list_view_icon.clone())
                } else {
                    Some(m.display_icon.clone())
                }
            })
            .unwrap_or_default()
    }

    pub fn rank_name(&self, tier: u32) -> String {
        self.ranks
            .get(&tier)
            .map(|r| r.name.clone())
            .unwrap_or_else(|| "Unknown".to_string())
    }

    pub fn rank_icon(&self, tier: u32) -> String {
        self.ranks
            .get(&tier)
            .map(|r| r.icon.clone())
            .unwrap_or_default()
    }

    pub fn season_label(&self, _season_id: &str) -> String {
        // Simplified - in production would map season IDs to labels
        "Current".to_string()
    }

    pub fn card_art(&self, _card_id: &str) -> String {
        // Would resolve from player cards cache
        String::new()
    }

    pub fn skin_info(&self, _skin_id: &str) -> Option<SkinInfo> {
        None
    }

    pub fn tier_color(&self, _tier_uuid: &str) -> String {
        String::new()
    }
}
