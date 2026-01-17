import { NextResponse } from 'next/server';
import { analyzeData, aggregateByDMA, aggregateByDate } from '@/lib/dataProcessor';

export async function GET() {
  try {
    // Load data from public folder via fetch (works on Edge runtime)
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/data.json`);
    const { unified } = await response.json();

    // Run analysis
    const analysis = analyzeData(unified);
    const byDMA = aggregateByDMA(unified);
    const byDate = aggregateByDate(unified);

    return NextResponse.json({
      unified,
      analysis,
      byDMA,
      byDate,
    });
  } catch (error) {
    console.error('Error loading data:', error);
    return NextResponse.json(
      { error: 'Failed to load data' },
      { status: 500 }
    );
  }
}
