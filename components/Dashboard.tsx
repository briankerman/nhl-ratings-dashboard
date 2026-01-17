'use client';

import { useEffect, useState } from 'react';
import { analyzeData, aggregateByDMA, aggregateByDate } from '@/lib/dataProcessor';
import MetricsGrid from './MetricsGrid';
import ChartSection from './ChartSection';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load data directly from public folder
    fetch('/data.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(jsonData => {
        const unified = jsonData.unified;

        // Process data client-side
        const analysis = analyzeData(unified);
        const byDMA = aggregateByDMA(unified);
        const byDate = aggregateByDate(unified);

        setData({ unified, analysis, byDMA, byDate });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold">NHL Paid Media Impact Analysis</h1>
          <p className="text-gray-400 mt-2">Local TV Ratings & Viewership Performance</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {data && data.analysis && (
          <>
            <MetricsGrid analysis={data.analysis} />
            <ChartSection
              unified={data.unified}
              byDMA={data.byDMA}
              byDate={data.byDate}
            />
          </>
        )}

        {!data && (
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">No Data Available</h2>
            <p className="text-gray-400">Failed to load data</p>
          </div>
        )}
      </main>
    </div>
  );
}
