interface SparklineProps {
  values: number[];
  rising: boolean;
  width?: number;
  height?: number;
  label: string;
}

export function Sparkline({ values, rising, width = 92, height = 26, label }: SparklineProps) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);
  const points = values.
  map((value, index) => {
    const x = index * step;
    const y = height - 2 - (value - min) / span * (height - 4);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).
  join(' ');
  const stroke = rising ? '#1F7345' : '#B3261E';
  const last = points.split(' ').slice(-1)[0].split(',');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={stroke} />
    </svg>);

}