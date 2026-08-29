/** Rupees, Indian digit grouping. */
export function inr(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export function pct(value: number): string {
  return `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toFixed(1)}%`;
}

export function changePct(current: number, previous: number): number {
  if (!previous) return 0;
  return (current - previous) / previous * 100;
}

/** Rough freight + mandi handling, in rupees per quintal, for a one-way trip. */
export function transportCost(distanceKm: number): number {
  return Math.round(40 + distanceKm * 2.4);
}

export function netRealisation(modal: number, distanceKm: number): number {
  return modal - transportCost(distanceKm);
}

/**
 * Deterministic seven-day price series ending at today's modal price.
 * Used only for the trend sparkline, so the shape stays stable across renders.
 */
export function buildHistory(modal: number, prevModal: number, seed: number): number[] {
  let s = seed % 2333 + 7;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const series: number[] = [];
  for (let i = 5; i >= 1; i--) {
    const drift = (rand() - 0.5) * 0.07;
    series.push(Math.round(prevModal * (1 - 0.025 * i / 5 + drift)));
  }
  series.push(prevModal, modal);
  return series;
}