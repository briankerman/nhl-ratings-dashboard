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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-6">
              <div className="bg-white rounded-full p-2 flex items-center justify-center">
                <img src="/nhl-logo.png" alt="NHL" className="h-16 w-auto" />
              </div>
              <div className="border-l-2 border-gray-600 pl-6 h-16 flex flex-col justify-center">
                <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.02em' }}>
                  MEDIA RATINGS <span className="font-normal text-gray-500">ANALYZER</span>
                </h1>
                <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mt-1.5" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  OFFICIAL LEAGUE TOOL
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex gap-8">
              <button
                onClick={() => scrollToSection('metrics')}
                className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-medium"
              >
                Overview
              </button>
              <button
                onClick={() => scrollToSection('dma-analysis')}
                className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-medium"
              >
                DMA Analysis
              </button>
              <button
                onClick={() => scrollToSection('trends')}
                className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-medium"
              >
                Trends
              </button>
              <button
                onClick={() => scrollToSection('correlation')}
                className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-medium"
              >
                Correlation
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {data && data.analysis && (
          <>
            <div id="metrics">
              <MetricsGrid analysis={data.analysis} />
            </div>
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
