'use client';

import { UnifiedData } from '@/lib/types';

interface PlatformAnalysisProps {
  unified: UnifiedData[];
  avgNoMediaRating: number;
  avgNoMediaViewership: number;
}

export default function PlatformAnalysis({ unified, avgNoMediaRating, avgNoMediaViewership }: PlatformAnalysisProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Analyze by platform
  const platformData = unified
    .filter(d => d.Has_Media === true || d.Has_Media === 1 || d.Has_Media === '1' || d.Has_Media === 'True')
    .reduce((acc: any, d: any) => {
      // Google
      if (d.Cost_Google > 0) {
        if (!acc.Google) {
          acc.Google = { spend: 0, impressions: 0, clicks: 0, ratings: [], viewerships: [], games: 0 };
        }
        acc.Google.spend += d.Cost_Google;
        acc.Google.impressions += d.Impressions_Google;
        acc.Google.clicks += d.Clicks_Google || 0;
        acc.Google.ratings.push(d.P2RTG);
        acc.Google.viewerships.push(d.P2IMP);
        acc.Google.games++;
      }

      // TTD
      if (d.Cost_TTD > 0) {
        if (!acc.TTD) {
          acc.TTD = { spend: 0, impressions: 0, clicks: 0, ratings: [], viewerships: [], games: 0 };
        }
        acc.TTD.spend += d.Cost_TTD;
        acc.TTD.impressions += d.Impressions_TTD;
        acc.TTD.clicks += d.Clicks_TTD || 0;
        acc.TTD.ratings.push(d.P2RTG);
        acc.TTD.viewerships.push(d.P2IMP);
        acc.TTD.games++;
      }

      return acc;
    }, {});

  // Calculate metrics for each platform
  const platforms = Object.entries(platformData).map(([name, data]: [string, any]) => {
    const avgRating = data.ratings.reduce((a: number, b: number) => a + b, 0) / data.ratings.length;
    const avgViewership = data.viewerships.reduce((a: number, b: number) => a + b, 0) / data.viewerships.length;
    const ratingLift = avgNoMediaRating > 0 ? ((avgRating - avgNoMediaRating) / avgNoMediaRating) * 100 : 0;
    const viewershipLift = avgNoMediaViewership > 0 ? ((avgViewership - avgNoMediaViewership) / avgNoMediaViewership) * 100 : 0;
    const cpm = data.impressions > 0 ? (data.spend / data.impressions) * 1000 : 0;
    const ctr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;

    return {
      name,
      spend: data.spend,
      impressions: data.impressions,
      clicks: data.clicks,
      avgRating,
      avgViewership,
      ratingLift,
      viewershipLift,
      cpm,
      ctr,
      games: data.games,
    };
  }).sort((a, b) => b.spend - a.spend);

  if (platforms.length === 0) {
    return null;
  }

  // Find top performer
  const topByRatingLift = [...platforms].sort((a, b) => b.ratingLift - a.ratingLift)[0];
  const topByEfficiency = [...platforms].sort((a, b) => a.cpm - b.cpm)[0];

  return (
    <div id="platform-analysis" className="bg-gray-900 rounded-lg p-6 border border-gray-800 scroll-mt-24">
      <h2 className="text-2xl font-bold mb-4">Platform Performance Comparison</h2>
      <p className="text-sm text-gray-400 mb-6">
        {topByRatingLift.name} delivered the strongest rating lift at {formatPercent(topByRatingLift.ratingLift)},
        while {topByEfficiency.name} had the most efficient CPM at {formatCurrency(topByEfficiency.cpm)}.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map(platform => (
          <div key={platform.name} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-white">{platform.name}</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                <span className="text-sm text-gray-400">Rating Lift</span>
                <span className={`text-lg font-bold ${platform.ratingLift >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercent(platform.ratingLift)}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                <span className="text-sm text-gray-400">Viewership Lift</span>
                <span className={`text-lg font-bold ${platform.viewershipLift >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercent(platform.viewershipLift)}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                <span className="text-sm text-gray-400">Total Spend</span>
                <span className="text-sm font-semibold">{formatCurrency(platform.spend)}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                <span className="text-sm text-gray-400">CPM</span>
                <span className="text-sm font-semibold">{formatCurrency(platform.cpm)}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                <span className="text-sm text-gray-400">CTR</span>
                <span className="text-sm font-semibold">{platform.ctr.toFixed(2)}%</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                <span className="text-sm text-gray-400">Impressions</span>
                <span className="text-sm font-semibold">{formatNumber(platform.impressions)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Games</span>
                <span className="text-sm font-semibold">{platform.games}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
