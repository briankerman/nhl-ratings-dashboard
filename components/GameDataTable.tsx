'use client';

import { UnifiedData } from '@/lib/types';
import { useState } from 'react';

interface GameDataTableProps {
  unified: UnifiedData[];
  avgNoMediaRating: number;
  avgNoMediaViewership: number;
}

export default function GameDataTable({ unified, avgNoMediaRating, avgNoMediaViewership }: GameDataTableProps) {
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortDesc, setSortDesc] = useState(true);
  const [filterMedia, setFilterMedia] = useState(true);

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

  // Aggregate by game date
  const gamesByDate: Record<string, {
    date: string;
    spend: number;
    impressions: number;
    clicks: number;
    reach: number;
    frequency: number;
    avgRating: number;
    avgViewership: number;
    ratingLift: number;
    viewershipLift: number;
    network: string;
  }> = {};

  unified
    .filter(d => !filterMedia || d.Has_Media === true || d.Has_Media === 1 || d.Has_Media === '1' || d.Has_Media === 'True')
    .forEach(d => {
      const date = d['Game Date'];
      if (!gamesByDate[date]) {
        gamesByDate[date] = {
          date,
          spend: 0,
          impressions: 0,
          clicks: 0,
          reach: 0,
          frequency: 0,
          avgRating: 0,
          avgViewership: 0,
          ratingLift: 0,
          viewershipLift: 0,
          network: d.Network || '',
        };
      }
      gamesByDate[date].spend += d.Cost;
      gamesByDate[date].impressions += d.Impressions;
      gamesByDate[date].clicks += d.Clicks || 0;
      gamesByDate[date].reach += d.Reach || 0;
      gamesByDate[date].avgRating += d.P2RTG;
      gamesByDate[date].avgViewership += d.P2IMP;
    });

  // Calculate averages and lifts
  const tableData = Object.values(gamesByDate).map(game => {
    const count = unified.filter(d => d['Game Date'] === game.date).length;
    game.avgRating = game.avgRating / count;
    game.avgViewership = game.avgViewership / count;
    // Apply 75% deduplication factor to account for cross-DMA overlap
    game.reach = game.reach * 0.75;
    game.frequency = game.reach > 0 ? game.impressions / game.reach : 0;
    game.ratingLift = avgNoMediaRating > 0 ? ((game.avgRating - avgNoMediaRating) / avgNoMediaRating) * 100 : 0;
    game.viewershipLift = avgNoMediaViewership > 0 ? ((game.avgViewership - avgNoMediaViewership) / avgNoMediaViewership) * 100 : 0;
    return game;
  });

  // Sort data
  const sortedData = [...tableData].sort((a, b) => {
    let aVal: any, bVal: any;

    switch (sortBy) {
      case 'date':
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
        break;
      case 'spend':
        aVal = a.spend;
        bVal = b.spend;
        break;
      case 'impressions':
        aVal = a.impressions;
        bVal = b.impressions;
        break;
      case 'clicks':
        aVal = a.clicks;
        bVal = b.clicks;
        break;
      case 'reach':
        aVal = a.reach;
        bVal = b.reach;
        break;
      case 'frequency':
        aVal = a.frequency;
        bVal = b.frequency;
        break;
      case 'rating':
        aVal = a.avgRating;
        bVal = b.avgRating;
        break;
      case 'ratingLift':
        aVal = a.ratingLift;
        bVal = b.ratingLift;
        break;
      case 'viewership':
        aVal = a.avgViewership;
        bVal = b.avgViewership;
        break;
      case 'viewershipLift':
        aVal = a.viewershipLift;
        bVal = b.viewershipLift;
        break;
      case 'network':
        aVal = a.network;
        bVal = b.network;
        break;
      default:
        return 0;
    }

    if (typeof aVal === 'string') {
      return sortDesc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    }
    return sortDesc ? bVal - aVal : aVal - bVal;
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(column);
      setSortDesc(true);
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return <span className="text-gray-600">⇅</span>;
    return sortDesc ? <span>↓</span> : <span>↑</span>;
  };

  return (
    <div id="game-data" className="bg-gray-900 rounded-lg p-6 border border-gray-800 scroll-mt-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Per-Game Performance Data</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filterMedia}
            onChange={(e) => setFilterMedia(e.target.checked)}
            className="rounded"
          />
          <span>Media games only</span>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-2 cursor-pointer hover:bg-gray-800" onClick={() => handleSort('date')}>
                Game Date <SortIcon column="date" />
              </th>
              <th className="text-left py-3 px-2 cursor-pointer hover:bg-gray-800" onClick={() => handleSort('network')}>
                Network <SortIcon column="network" />
              </th>
              <th className="text-right py-3 px-2 cursor-pointer hover:bg-gray-800" onClick={() => handleSort('spend')}>
                Spend <SortIcon column="spend" />
              </th>
              <th className="text-right py-3 px-2 cursor-pointer hover:bg-gray-800" onClick={() => handleSort('impressions')}>
                Impressions <SortIcon column="impressions" />
              </th>
              <th className="text-right py-3 px-2 cursor-pointer hover:bg-gray-800" onClick={() => handleSort('clicks')}>
                Clicks <SortIcon column="clicks" />
              </th>
              <th className="text-right py-3 px-2 cursor-pointer hover:bg-gray-800" onClick={() => handleSort('reach')}>
                Reach <SortIcon column="reach" />
              </th>
              <th className="text-right py-3 px-2 cursor-pointer hover:bg-gray-800" onClick={() => handleSort('frequency')}>
                Frequency <SortIcon column="frequency" />
              </th>
              <th className="text-right py-3 px-2 cursor-pointer hover:bg-gray-800" onClick={() => handleSort('rating')}>
                Avg Rating <SortIcon column="rating" />
              </th>
              <th className="text-right py-3 px-2 cursor-pointer hover:bg-gray-800" onClick={() => handleSort('ratingLift')}>
                Rating Lift <SortIcon column="ratingLift" />
              </th>
              <th className="text-right py-3 px-2 cursor-pointer hover:bg-gray-800" onClick={() => handleSort('viewership')}>
                Avg Viewership <SortIcon column="viewership" />
              </th>
              <th className="text-right py-3 px-2 cursor-pointer hover:bg-gray-800" onClick={() => handleSort('viewershipLift')}>
                Viewership Lift <SortIcon column="viewershipLift" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-2 px-2">{row.date}</td>
                <td className="py-2 px-2 text-gray-300">{row.network || '-'}</td>
                <td className="py-2 px-2 text-right">{formatCurrency(row.spend)}</td>
                <td className="py-2 px-2 text-right">{formatNumber(row.impressions)}</td>
                <td className="py-2 px-2 text-right">{formatNumber(row.clicks)}</td>
                <td className="py-2 px-2 text-right">{formatNumber(row.reach)}</td>
                <td className="py-2 px-2 text-right">{row.frequency > 0 ? row.frequency.toFixed(2) : '-'}</td>
                <td className="py-2 px-2 text-right">{row.avgRating.toFixed(2)}</td>
                <td className={`py-2 px-2 text-right ${row.ratingLift >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercent(row.ratingLift)}
                </td>
                <td className="py-2 px-2 text-right">{formatNumber(row.avgViewership)}</td>
                <td className={`py-2 px-2 text-right ${row.viewershipLift >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercent(row.viewershipLift)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Showing {sortedData.length} game dates
      </div>
    </div>
  );
}
