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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {/* Rating Lift */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="text-gray-400 text-sm mb-2">Rating Lift</div>
        <div className="text-3xl font-bold mb-1">
          {formatPercent(analysis.ratingLift)}
        </div>
        <div className="text-xs text-gray-500">
          {formatPValue(analysis.ratingLiftPValue)}
        </div>
      </div>

      {/* Viewership Lift */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="text-gray-400 text-sm mb-2">Viewership Lift</div>
        <div className="text-3xl font-bold mb-1">
          {formatPercent(analysis.viewershipLift)}
        </div>
        <div className="text-xs text-gray-500">
          {formatPValue(analysis.viewershipLiftPValue)}
        </div>
      </div>

      {/* Total Spend */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="text-gray-400 text-sm mb-2">Total Spend</div>
        <div className="text-3xl font-bold mb-1">
          {formatCurrency(analysis.totalSpend)}
        </div>
        <div className="text-xs text-gray-500">
          {formatNumber(analysis.totalImpressions)} impressions
        </div>
      </div>

      {/* Average CPM */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="text-gray-400 text-sm mb-2">Average CPM</div>
        <div className="text-3xl font-bold mb-1">
          {formatCurrency(analysis.avgCPM)}
        </div>
        <div className="text-xs text-gray-500">
          {analysis.mediaGames} media games
        </div>
      </div>

      {/* Cost Correlation */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="text-gray-400 text-sm mb-2">Cost vs Rating</div>
        <div className="text-3xl font-bold mb-1">
          r = {analysis.costCorrelation.toFixed(3)}
        </div>
        <div className="text-xs text-gray-500">
          {formatPValue(analysis.costCorrelationPValue)}
        </div>
      </div>

      {/* Impressions Correlation */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="text-gray-400 text-sm mb-2">Impressions vs Rating</div>
        <div className="text-3xl font-bold mb-1">
          r = {analysis.impressionsCorrelation.toFixed(3)}
        </div>
        <div className="text-xs text-gray-500">
          {formatPValue(analysis.impressionsCorrelationPValue)}
        </div>
      </div>

      {/* Media Games */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="text-gray-400 text-sm mb-2">Games with Media</div>
        <div className="text-3xl font-bold mb-1">
          {analysis.mediaGames}
        </div>
        <div className="text-xs text-gray-500">
          {analysis.noMediaGames} without media
        </div>
      </div>

      {/* Total Games */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="text-gray-400 text-sm mb-2">Total Games</div>
        <div className="text-3xl font-bold mb-1">
          {analysis.mediaGames + analysis.noMediaGames}
        </div>
        <div className="text-xs text-gray-500">
          {((analysis.mediaGames / (analysis.mediaGames + analysis.noMediaGames)) * 100).toFixed(0)}% with media
        </div>
      </div>
    </div>
  );
}
