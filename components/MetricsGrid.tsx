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

  const formatPValue = (value: number) => {
    if (value < 0.0001) return 'p < 0.0001';
    return `p = ${value.toFixed(4)}`;
  };

  return (
    <div className="space-y-8">
      {/* Key Impact Metrics */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-300">Media Impact on Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rating Lift */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Rating Lift</div>
            <div className="text-4xl font-bold mb-2 text-white">
              {formatPercent(analysis.ratingLift)}
            </div>
            <div className="text-xs text-gray-500">
              {formatPValue(analysis.ratingLiftPValue)}
            </div>
          </div>

          {/* Viewership Lift */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Viewership Lift</div>
            <div className="text-4xl font-bold mb-2 text-white">
              {formatPercent(analysis.viewershipLift)}
            </div>
            <div className="text-xs text-gray-500">
              {formatPValue(analysis.viewershipLiftPValue)}
            </div>
          </div>
        </div>
      </div>

      {/* What Drives Performance */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-300">What Drives Ratings?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Spend Correlation */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Spend Impact</div>
            <div className="text-3xl font-bold mb-2">
              r = {analysis.costCorrelation.toFixed(3)}
            </div>
            <div className="text-xs text-gray-500">
              {formatPValue(analysis.costCorrelationPValue)}
            </div>
          </div>

          {/* Impressions Correlation */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Impressions Impact</div>
            <div className="text-3xl font-bold mb-2">
              r = {analysis.impressionsCorrelation.toFixed(3)}
            </div>
            <div className="text-xs text-gray-500">
              {formatPValue(analysis.impressionsCorrelationPValue)}
            </div>
          </div>

          {/* Clicks Correlation */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Clicks Impact</div>
            <div className="text-3xl font-bold mb-2">
              r = {analysis.clicksCorrelation.toFixed(3)}
            </div>
            <div className="text-xs text-gray-500">
              {formatPValue(analysis.clicksCorrelationPValue)}
            </div>
          </div>

          {/* Reach Correlation */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-2">Reach Impact</div>
            <div className="text-3xl font-bold mb-2">
              r = {analysis.reachCorrelation.toFixed(3)}
            </div>
            <div className="text-xs text-gray-500">
              {formatPValue(analysis.reachCorrelationPValue)}
            </div>
          </div>
        </div>
      </div>

      {/* Investment Summary */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-300">Investment Summary</h2>
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
