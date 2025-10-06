export interface Episode {
  slug: string;
  title: string;
  published: Date;
  day1: number;
  day7: number;
  day14: number;
  day30: number;
  day90: number;
  spotify: number;
  allTime: number;
}

export interface MetricStats {
  totalEpisodes: number;
  totalListens: number;
  avgDay1: number;
  avgDay7: number;
  avgDay30: number;
  avgAllTime: number;
  topEpisode: Episode | null;
  recentAvg: number;
  oldAvg: number;
  growthRate: number;
}

export interface TopicData {
  topic: string;
  count: number;
  totalListens: number;
  avgListens: number;
  episodes: Episode[];
}

export interface EpisodeParseResult {
  episodes: Episode[];
  skippedCount: number;
  warnings: string[];
}

export interface EpisodesState {
  episodes: Episode[];
  skippedCount: number;
  warnings: string[];
  sourceLabel: string;
  lastImportTimestamp?: number;
}
