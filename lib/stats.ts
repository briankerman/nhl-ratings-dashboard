/**
 * Statistical analysis utilities
 */

export function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function std(arr: number[]): number {
  const avg = mean(arr);
  const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}

export function tTest(group1: number[], group2: number[]): { tStat: number; pValue: number } {
  const mean1 = mean(group1);
  const mean2 = mean(group2);
  const n1 = group1.length;
  const n2 = group2.length;

  const variance1 = Math.pow(std(group1), 2);
  const variance2 = Math.pow(std(group2), 2);

  const pooledStd = Math.sqrt(((n1 - 1) * variance1 + (n2 - 1) * variance2) / (n1 + n2 - 2));
  const tStat = (mean1 - mean2) / (pooledStd * Math.sqrt(1/n1 + 1/n2));

  // Degrees of freedom
  const df = n1 + n2 - 2;

  // Approximate p-value using normal distribution for large samples
  // For small samples, this is approximate
  const pValue = 2 * (1 - normalCDF(Math.abs(tStat)));

  return { tStat, pValue };
}

export function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const meanX = mean(x);
  const meanY = mean(y);

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    denomX += diffX * diffX;
    denomY += diffY * diffY;
  }

  return numerator / Math.sqrt(denomX * denomY);
}

export function correlationPValue(r: number, n: number): number {
  // Fisher transformation
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  const pValue = 2 * (1 - normalCDF(Math.abs(t)));
  return pValue;
}

// Normal CDF approximation
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

export function percentageChange(baseline: number, comparison: number): number {
  if (baseline === 0) return 0;
  return ((comparison - baseline) / baseline) * 100;
}
