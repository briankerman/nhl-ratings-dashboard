export interface RatingsData {
  DMA: string;
  'Game Date': string;
  'Home Team': string;
  'Away Team': string;
  P2RTG: number;
  P2IMP: number;
  HH: number;
}

export interface MediaData {
  Campaign: string;
  DMA: string;
  Cost: number;
  Impressions: number;
  Platform: 'Google' | 'TTD' | 'Amazon';
}

export interface CampaignMapping {
  Campaign: string;
  'Game Date': string;
  'Home Team': string;
  'Away Team': string;
}

export interface DMAMapping {
  'Ratings DMA': string;
  'Google DMA': string | null;
  'The Trade Desk DMA': string | null;
}

export interface UnifiedData {
  DMA: string;
  'Game Date': string;
  'Home Team'?: string;
  'Away Team'?: string;
  P2RTG: number;
  P2IMP: number;
  Cost: number;
  Impressions: number;
  Has_Media: boolean | number | string;
  CPM: number;
  Reach?: number;
  Frequency?: number;
}

export interface AnalysisResults {
  ratingLift: number;
  viewershipLift: number;
  ratingLiftPValue: number;
  viewershipLiftPValue: number;
  costCorrelation: number;
  costCorrelationPValue: number;
  impressionsCorrelation: number;
  impressionsCorrelationPValue: number;
  totalSpend: number;
  totalImpressions: number;
  avgCPM: number;
  mediaGames: number;
  noMediaGames: number;
}
