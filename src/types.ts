export type MatchState = "NoGame" | "Menu" | "PreGame" | "CoreGame";

export interface PlayerRow {
  puuid: string;
  name: string;
  playerCard: string;
  agent: string;
  agentIcon: string;
  team: string;
  partyId: string;
  hiddenName: boolean;
  rankTier: number;
  rankName: string;
  rankIcon: string;
  rr: number;
  peakRankName: string;
  peakRankTier: number;
  peakRankIcon: string;
  peakAct: string;
  winRate: number;
  wins: number;
  games: number;
  leaderboard: number;
  accountLevel: number;
  lastKills: number;
  lastDeaths: number;
  lastHs: number;
  lastAcs: number;
  lastAdr: number;
  lastKast: number;
  lastAssists: number;
  hasCombat: boolean;
  streak: number;
  rrTrend: number;
  recentWins: number;
  recentLosses: number;
  smurfScore: number;
  partySize: number;
  encounters: number;
  encounterWins: number;
  encounterLosses: number;
  locked: boolean;
  premiumSkins: boolean;
  vandalSkin: string;
  vandalImage: string;
  vandalTierColor: string;
}

export interface ScoreEntry {
  name: string;
  agentIcon: string;
  kills: number;
  deaths: number;
  assists: number;
  acs: number;
  hs: number;
  ally: boolean;
  isSelf: boolean;
}

export interface HistoryEntry {
  matchId: string;
  map: string;
  rrChange: number;
  tier: number;
  rankName: string;
  agentIcon: string;
  agentName: string;
  mapImage: string;
  kills: number;
  deaths: number;
  assists: number;
  acs: number;
  adr: number;
  kast: number;
  hs: number;
  selfRounds: number;
  enemyRounds: number;
  won: boolean;
  ranked: boolean;
  hasStats: boolean;
  scoreboard: ScoreEntry[];
  roundTimeline: RoundResult[];
  aces: number;
  clutches: number;
  firstBloods: number;
  firstDeaths: number;
  plants: number;
  defuses: number;
  attackRounds: number;
  defenseRounds: number;
  attackWon: number;
  defenseWon: number;
  totalDamage: number;
}

export interface RoundResult {
  roundNum: number;
  winningTeam: string;
  isPistol: boolean;
  selfTeam: string;
}

export interface MatchView {
  state: MatchState;
  mode: string;
  activity: string;
  players: PlayerRow[];
  me: PlayerRow | null;
  history: HistoryEntry[];
  stale: boolean;
  phaseTime: number;
  map: string;
  mapImage: string;
  allyScore: number;
  enemyScore: number;
  combatLoading: boolean;
  historyQueue: number;
}

export interface PlayerProfile {
  puuid: string;
  name: string;
  level: number;
  rankTier: number;
  rankName: string;
  rankIcon: string;
  peakRankName: string;
  peakRankTier: number;
  peakRankIcon: string;
  winRate: number;
  wins: number;
  games: number;
  history: HistoryEntry[];
}

export type NavView = "dashboard" | "match" | "overlay" | "search" | "history" | "loadout" | "chat" | "themes" | "agent_stats" | "map_stats" | "trends" | "weapon_stats" | "leaderboard" | "crosshairs";

export interface AgentStats {
  agentName: string;
  agentIcon: string;
  games: number;
  wins: number;
  winRate: number;
  kills: number;
  deaths: number;
  assists: number;
  hs: number;
  acs: number;
  adr: number;
  kast: number;
}

export interface MapStats {
  mapName: string;
  games: number;
  wins: number;
  winRate: number;
  kills: number;
  deaths: number;
  assists: number;
  topAgent: string;
}
