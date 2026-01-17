import { UnifiedData, AnalysisResults } from './types';
import { mean, tTest, pearsonCorrelation, correlationPValue, percentageChange } from './stats';

export function analyzeData(data: UnifiedData[]): AnalysisResults {
  // Split into media vs no-media games
  // Handle Has_Media as boolean, number (1/0), or string
  const mediaGames = data.filter(d => d.Has_Media === true || d.Has_Media === 1 || d.Has_Media === '1' || d.Has_Media === 'True');
  const noMediaGames = data.filter(d => !d.Has_Media || d.Has_Media === 0 || d.Has_Media === '0' || d.Has_Media === 'False');

  // Extract metrics
  const mediaRatings = mediaGames.map(d => d.P2RTG);
  const noMediaRatings = noMediaGames.map(d => d.P2RTG);
  const mediaViewership = mediaGames.map(d => d.P2IMP);
  const noMediaViewership = noMediaGames.map(d => d.P2IMP);

  // T-tests for lift
  const ratingTest = tTest(mediaRatings, noMediaRatings);
  const viewershipTest = tTest(mediaViewership, noMediaViewership);

  // Calculate percentage lifts
  const avgMediaRating = mean(mediaRatings);
  const avgNoMediaRating = mean(noMediaRatings);
  const avgMediaViewership = mean(mediaViewership);
  const avgNoMediaViewership = mean(noMediaViewership);

  const ratingLift = percentageChange(avgNoMediaRating, avgMediaRating);
  const viewershipLift = percentageChange(avgNoMediaViewership, avgMediaViewership);

  // Correlation analysis (only for media games)
  const mediaCosts = mediaGames.map(d => d.Cost);
  const mediaImpressions = mediaGames.map(d => d.Impressions);
  const mediaClicks = mediaGames.map(d => d.Clicks || 0);
  const mediaReach = mediaGames.map(d => d.Reach || 0);
  const mediaFrequency = mediaGames.map(d => (d.Reach && d.Reach > 0) ? d.Impressions / d.Reach : 0);

  const costRatingCorr = pearsonCorrelation(mediaCosts, mediaRatings);
  const costRatingPValue = correlationPValue(costRatingCorr, mediaCosts.length);

  const impRatingCorr = pearsonCorrelation(mediaImpressions, mediaRatings);
  const impRatingPValue = correlationPValue(impRatingCorr, mediaImpressions.length);

  const clicksRatingCorr = pearsonCorrelation(mediaClicks, mediaRatings);
  const clicksRatingPValue = correlationPValue(clicksRatingCorr, mediaClicks.length);

  const reachRatingCorr = pearsonCorrelation(mediaReach, mediaRatings);
  const reachRatingPValue = correlationPValue(reachRatingCorr, mediaReach.length);

  const frequencyRatingCorr = pearsonCorrelation(mediaFrequency, mediaRatings);
  const frequencyRatingPValue = correlationPValue(frequencyRatingCorr, mediaFrequency.length);

  // Summary metrics
  const totalSpend = mediaGames.reduce((sum, d) => sum + d.Cost, 0);
  const totalImpressions = mediaGames.reduce((sum, d) => sum + d.Impressions, 0);
  const avgCPM = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0;

  return {
    ratingLift,
    viewershipLift,
    ratingLiftPValue: ratingTest.pValue,
    viewershipLiftPValue: viewershipTest.pValue,
    costCorrelation: costRatingCorr,
    costCorrelationPValue: costRatingPValue,
    impressionsCorrelation: impRatingCorr,
    impressionsCorrelationPValue: impRatingPValue,
    clicksCorrelation: clicksRatingCorr,
    clicksCorrelationPValue: clicksRatingPValue,
    reachCorrelation: reachRatingCorr,
    reachCorrelationPValue: reachRatingPValue,
    frequencyCorrelation: frequencyRatingCorr,
    frequencyCorrelationPValue: frequencyRatingPValue,
    totalSpend,
    totalImpressions,
    avgCPM,
    mediaGames: mediaGames.length,
    noMediaGames: noMediaGames.length,
    avgMediaRating,
    avgNoMediaRating,
    avgMediaViewership,
    avgNoMediaViewership,
  };
}

export function aggregateByDMA(data: UnifiedData[]): Record<string, {
  games: number;
  avgRating: number;
  avgViewership: number;
  totalSpend: number;
  totalImpressions: number;
  mediaGames: number;
}> {
  const dmaMap: Record<string, UnifiedData[]> = {};

  data.forEach(row => {
    if (!dmaMap[row.DMA]) {
      dmaMap[row.DMA] = [];
    }
    dmaMap[row.DMA].push(row);
  });

  const result: Record<string, any> = {};

  Object.entries(dmaMap).forEach(([dma, rows]) => {
    const mediaRows = rows.filter(r => r.Has_Media === true || r.Has_Media === 1 || r.Has_Media === '1' || r.Has_Media === 'True');
    result[dma] = {
      games: rows.length,
      avgRating: mean(rows.map(r => r.P2RTG)),
      avgViewership: mean(rows.map(r => r.P2IMP)),
      totalSpend: rows.reduce((sum, r) => sum + r.Cost, 0),
      totalImpressions: rows.reduce((sum, r) => sum + r.Impressions, 0),
      mediaGames: mediaRows.length,
    };
  });

  return result;
}

export function aggregateByDate(data: UnifiedData[]): Record<string, {
  games: number;
  avgRating: number;
  totalViewership: number;
  totalSpend: number;
  totalImpressions: number;
}> {
  const dateMap: Record<string, UnifiedData[]> = {};

  data.forEach(row => {
    if (!dateMap[row['Game Date']]) {
      dateMap[row['Game Date']] = [];
    }
    dateMap[row['Game Date']].push(row);
  });

  const result: Record<string, any> = {};

  Object.entries(dateMap).forEach(([date, rows]) => {
    result[date] = {
      games: rows.length,
      avgRating: mean(rows.map(r => r.P2RTG)),
      totalViewership: rows.reduce((sum, r) => sum + r.P2IMP, 0),
      totalSpend: rows.reduce((sum, r) => sum + r.Cost, 0),
      totalImpressions: rows.reduce((sum, r) => sum + r.Impressions, 0),
    };
  });

  return result;
}
