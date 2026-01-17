'use client';

import { AnalysisResults } from '@/lib/types';

interface MetricsGridProps {
  analysis: AnalysisResults;
}

export default function MetricsGrid({ analysis }: MetricsGridProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getImpactDescription = (ratingLift: number, viewershipLift: number) => {
    if (ratingLift > 0 && viewershipLift > 0) {
      return "Media campaigns are driving positive results, with games supported by media showing higher ratings and viewership compared to unsupported games.";
    } else if (ratingLift > 0) {
      return "Media campaigns are improving ratings but viewership impact is unclear.";
    } else if (viewershipLift > 0) {
      return "Media campaigns are improving viewership but ratings impact is unclear.";
    }
    return "Media campaigns are not showing clear positive impact on ratings or viewership.";
  };

  const getDriversDescription = (impressions: number, clicks: number, reach: number, frequency: number) => {
    const metrics = [
      { name: 'impressions', value: Math.abs(impressions) },
      { name: 'clicks', value: Math.abs(clicks) },
      { name: 'reach', value: Math.abs(reach) },
      { name: 'frequency', value: Math.abs(frequency) }
    ].sort((a, b) => b.value - a.value);

    const top = metrics[0];
    if (top.value < 0.1) {
      return "No strong correlation found between media metrics and ratings performance.";
    }
    return `${top.name.charAt(0).toUpperCase() + top.name.slice(1)} shows the strongest correlation with ratings performance, suggesting it may be a key driver of viewership success.`;
  };

  const getInvestmentDescription = (totalSpend: number, avgCPM: number) => {
    return `The campaign invested ${formatCurrency(totalSpend)} across supported games at an average CPM of ${formatCurrency(avgCPM)}.`;
  };

  return (
    <div className="space-y-8">
      {/* Key Impact Metrics */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-300">Media Impact on Performance</h2>
        <p className="text-sm text-gray-400 mb-6">
          {getImpactDescription(analysis.ratingLift, analysis.viewershipLift)}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rating Lift */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Rating Lift</div>
            <div className="text-4xl font-bold mb-2 text-white">
              {formatPercent(analysis.ratingLift)}
            </div>
            <div className="text-xs text-gray-500">
              vs. games without media support
            </div>
          </div>

          {/* Viewership Lift */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Viewership Lift</div>
            <div className="text-4xl font-bold mb-2 text-white">
              {formatPercent(analysis.viewershipLift)}
            </div>
            <div className="text-xs text-gray-500">
              vs. games without media support
            </div>
          </div>
        </div>
      </div>

      {/* What Drives Performance */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-300">What Drives Ratings?</h2>
        <p className="text-sm text-gray-400 mb-6">
          {getDriversDescription(analysis.impressionsCorrelation, analysis.clicksCorrelation, analysis.reachCorrelation, analysis.frequencyCorrelation)}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Impressions Correlation */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Impressions</div>
            <div className="text-3xl font-bold mb-2">
              r = {analysis.impressionsCorrelation.toFixed(3)}
            </div>
            <div className="text-xs text-gray-500">
              correlation with ratings
            </div>
          </div>

          {/* Clicks Correlation */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Clicks</div>
            <div className="text-3xl font-bold mb-2">
              r = {analysis.clicksCorrelation.toFixed(3)}
            </div>
            <div className="text-xs text-gray-500">
              correlation with ratings
            </div>
          </div>

          {/* Reach Correlation */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Reach</div>
            <div className="text-3xl font-bold mb-2">
              r = {analysis.reachCorrelation.toFixed(3)}
            </div>
            <div className="text-xs text-gray-500">
              correlation with ratings
            </div>
          </div>

          {/* Frequency Correlation */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Frequency</div>
            <div className="text-3xl font-bold mb-2">
              r = {analysis.frequencyCorrelation.toFixed(3)}
            </div>
            <div className="text-xs text-gray-500">
              correlation with ratings
            </div>
          </div>
        </div>
      </div>

      {/* Investment Summary */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-300">Investment Summary</h2>
        <p className="text-sm text-gray-400 mb-6">
          {getInvestmentDescription(analysis.totalSpend, analysis.avgCPM)}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Spend */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Total Spend</div>
            <div className="text-3xl font-bold mb-2">
              {formatCurrency(analysis.totalSpend)}
            </div>
            <div className="text-xs text-gray-500">
              {formatNumber(analysis.totalImpressions)} impressions
            </div>
          </div>

          {/* Average CPM */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Average CPM</div>
            <div className="text-3xl font-bold mb-2">
              {formatCurrency(analysis.avgCPM)}
            </div>
            <div className="text-xs text-gray-500">cost per thousand</div>
          </div>

          {/* Efficiency */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Cost per Rating Point</div>
            <div className="text-3xl font-bold mb-2">
              {formatCurrency(analysis.totalSpend / (analysis.avgMediaRating * analysis.mediaGames))}
            </div>
            <div className="text-xs text-gray-500">spend efficiency</div>
          </div>
        </div>
      </div>
    </div>
  );
}
