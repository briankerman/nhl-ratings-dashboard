'use client';

import { UnifiedData } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

interface ChartSectionProps {
  unified: UnifiedData[];
  byDMA: Record<string, any>;
  byDate: Record<string, any>;
}

export default function ChartSection({ unified, byDMA, byDate }: ChartSectionProps) {
  // Prepare data for charts
  const dmaChartData = Object.entries(byDMA).map(([dma, data]) => ({
    dma,
    rating: data.avgRating,
    spend: data.totalSpend,
    impressions: data.totalImpressions,
  })).sort((a, b) => b.spend - a.spend).slice(0, 10);

  const dateChartData = Object.entries(byDate).map(([date, data]) => ({
    date,
    rating: data.avgRating,
    viewership: data.totalViewership,
    spend: data.totalSpend,
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const scatterData = unified.filter(d => d.Has_Media).map(d => ({
    cost: d.Cost,
    rating: d.P2RTG,
    viewership: d.P2IMP,
  }));

  return (
    <div className="space-y-12">
      {/* Top DMAs by Spend */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6">Top DMAs by Spend</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dmaChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="dma" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#F3F4F6' }}
            />
            <Legend />
            <Bar dataKey="spend" fill="#C0C0C0" name="Total Spend ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance by Date */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6">Performance Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dateChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#F3F4F6' }}
            />
            <Legend />
            <Bar dataKey="rating" fill="#FFFFFF" name="Avg Rating (%)" />
            <Bar dataKey="spend" fill="#C0C0C0" name="Total Spend ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cost vs Rating Scatter */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6">Cost vs Rating Correlation</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="cost" name="Cost" stroke="#9CA3AF" />
            <YAxis dataKey="rating" name="Rating" stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#F3F4F6' }}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Scatter name="Games" data={scatterData} fill="#C0C0C0" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
