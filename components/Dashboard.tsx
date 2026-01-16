'use client';

import { useEffect, useState } from 'react';
import { AnalysisResults } from '@/lib/types';
import MetricsGrid from './MetricsGrid';
import ChartSection from './ChartSection';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
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
        {data && (
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
            <p className="text-gray-400 mb-6">
              Upload your data files to Vercel Blob Storage to get started.
            </p>
            <a
              href="https://vercel.com/docs/storage/vercel-blob"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Learn About Vercel Blob
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
