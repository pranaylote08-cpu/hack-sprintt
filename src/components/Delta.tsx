import { ArrowDownRightIcon, ArrowUpRightIcon, MinusIcon } from 'lucide-react';
import { pct } from '../utils/format';

export function Delta({ value, size = 'sm' }: {value: number;size?: 'sm' | 'lg';}) {
  const flat = Math.abs(value) < 0.05;
  const rising = value > 0;
  const Icon = flat ? MinusIcon : rising ? ArrowUpRightIcon : ArrowDownRightIcon;
  const tone = flat ? 'text-ink-muted' : rising ? 'text-rise' : 'text-fall';
  const box = size === 'lg' ? 'text-sm px-2 py-1' : 'text-xs px-1.5 py-0.5';

  return (
    <span
      className={`tnum inline-flex items-center gap-1 rounded-md bg-canvas font-semibold ${tone} ${box}`}
      title="Change against yesterday's modal price">
      
      <Icon className={size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'} aria-hidden="true" />
      {pct(value)}
    </span>);

}