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

  // Filter and calculate lifts
  const tableData = unified
    .filter(d => !filterMedia || d.Has_Media === true || d.Has_Media === 1 || d.Has_Media === '1' || d.Has_Media === 'True')
    .map(d => {
      const ratingLift = avgNoMediaRating > 0 ? ((d.P2RTG - avgNoMediaRating) / avgNoMediaRating) * 100 : 0;
      const viewershipLift = avgNoMediaViewership > 0 ? ((d.P2IMP - avgNoMediaViewership) / avgNoMediaViewership) * 100 : 0;
      const frequency = (d.Reach && d.Reach > 0) ? (d.Impressions / d.Reach) : 0;

      return {
        ...d,
        ratingLift,
        viewershipLift,
        frequency,
      };
    });

  // Sort data
  const sortedData = [...tableData].sort((a, b) => {
    let aVal: any, bVal: any;

    switch (sortBy) {
      case 'date':
        aVal = new Date(a['Game Date']).getTime();
        bVal = new Date(b['Game Date']).getTime();
        break;
      case 'dma':
        aVal = a.DMA;
        bVal = b.DMA;
        break;
      case 'spend':
        aVal = a.Cost;
        bVal = b.Cost;
        break;
      case 'impressions':
        aVal = a.Impressions;
        bVal = b.Impressions;
        break;
      case 'clicks':
        aVal = a.Clicks || 0;
        bVal = b.Clicks || 0;
        break;
      case 'reach':
        aVal = a.Reach || 0;
        bVal = b.Reach || 0;
        break;
      case 'frequency':
        aVal = a.frequency;
        bVal = b.frequency;
        break;
      case 'rating':
        aVal = a.P2RTG;
        bVal = b.P2RTG;
        break;
      case 'ratingLift':
        aVal = a.ratingLift;
        bVal = b.ratingLift;
        break;
      case 'viewership':
        aVal = a.P2IMP;
        bVal = b.P2IMP;
        break;
      case 'viewershipLift':
        aVal = a.viewershipLift;
        bVal = b.viewershipLift;
        break;
      case 'network':
        aVal = a.Network || '';
        bVal = b.Network || '';
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
                Date <SortIcon column="date" />
              </th>
              <th className="text-left py-3 px-2 cursor-pointer hover:bg-gray-800" onClick={() => handleSort('dma')}>
                DMA <SortIcon column="dma" />
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
                Rating <SortIcon column="rating" />
              </th>
              <th className="text-right py-3 px-2 cursor-pointer hover:bg-gray-800" onClick={() => handleSort('ratingLift')}>
                Rating Lift <SortIcon column="ratingLift" />
              </th>
              <th className="text-right py-3 px-2 cursor-pointer hover:bg-gray-800" onClick={() => handleSort('viewership')}>
                Viewership <SortIcon column="viewership" />
              </th>
              <th className="text-right py-3 px-2 cursor-pointer hover:bg-gray-800" onClick={() => handleSort('viewershipLift')}>
                Viewership Lift <SortIcon column="viewershipLift" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-2 px-2">{row['Game Date']}</td>
                <td className="py-2 px-2 text-gray-300">{row.DMA}</td>
                <td className="py-2 px-2 text-gray-300">{row.Network || '-'}</td>
                <td className="py-2 px-2 text-right">{formatCurrency(row.Cost)}</td>
                <td className="py-2 px-2 text-right">{formatNumber(row.Impressions)}</td>
                <td className="py-2 px-2 text-right">{formatNumber(row.Clicks || 0)}</td>
                <td className="py-2 px-2 text-right">{formatNumber(row.Reach || 0)}</td>
                <td className="py-2 px-2 text-right">{row.frequency > 0 ? row.frequency.toFixed(2) : '-'}</td>
                <td className="py-2 px-2 text-right">{row.P2RTG.toFixed(2)}</td>
                <td className={`py-2 px-2 text-right ${row.ratingLift >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercent(row.ratingLift)}
                </td>
                <td className="py-2 px-2 text-right">{formatNumber(row.P2IMP)}</td>
                <td className={`py-2 px-2 text-right ${row.viewershipLift >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercent(row.viewershipLift)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Showing {sortedData.length} games
      </div>
    </div>
  );
}
