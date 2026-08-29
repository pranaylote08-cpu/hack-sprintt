import { useMemo, useState } from 'react';
import { ArrowUpDownIcon, TruckIcon } from 'lucide-react';
import { Delta } from './Delta';
import { Sparkline } from './Sparkline';
import { MandiQuote } from '../utils/market';
import { buildHistory, changePct, inr, transportCost } from '../utils/format';

type SortKey = 'net' | 'modal' | 'distance' | 'arrivals';

interface MandiTableProps {
  quotes: MandiQuote[];
  includeTransport: boolean;
  onIncludeTransportChange: (next: boolean) => void;
  bestMandiId?: string;
  cropName: string;
}

const columns: {key: SortKey;label: string;help: string;}[] = [
{ key: 'modal', label: 'Rate today', help: 'Modal price with the day’s low–high band' },
{ key: 'net', label: 'At your gate', help: 'Rate minus estimated freight and handling' },
{ key: 'arrivals', label: 'Arrivals', help: 'Tonnes reported in the yard today' },
{ key: 'distance', label: 'Distance', help: 'From Annigeri, Dharwad' }];


export function MandiTable({
  quotes,
  includeTransport,
  onIncludeTransportChange,
  bestMandiId,
  cropName
}: MandiTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('net');

  const domain = useMemo(() => {
    const lows = quotes.map((q) => q.min);
    const highs = quotes.map((q) => q.max);
    return { low: Math.min(...lows), high: Math.max(...highs) };
  }, [quotes]);

  const sorted = useMemo(() => {
    const list = [...quotes];
    switch (sortKey) {
      case 'modal':
        return list.sort((a, b) => b.modal - a.modal);
      case 'distance':
        return list.sort((a, b) => a.mandi.distanceKm - b.mandi.distanceKm);
      case 'arrivals':
        return list.sort((a, b) => b.arrivalsTonnes - a.arrivalsTonnes);
      default:
        return list.sort((a, b) => b.net - a.net);
    }
  }, [quotes, sortKey]);

  const span = domain.high - domain.low || 1;

  return (
    <section className="rounded-2xl border border-line bg-surface shadow-card" aria-labelledby="compare-heading">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line px-6 py-5">
        <div>
          <h2 id="compare-heading" className="font-display text-lg font-semibold tracking-tight">
            Compare every mandi for {cropName}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {quotes.length} yards reporting. Sorted by {sortKey === 'net' ? 'what you actually take home' : sortKey}.
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-canvas px-3 py-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={includeTransport}
            onChange={(event) => onIncludeTransportChange(event.target.checked)}
            className="h-4 w-4 accent-leaf-600" />
          
          <TruckIcon className="h-4 w-4 text-ink-muted" aria-hidden="true" />
          Subtract freight from the rate
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <caption className="sr-only">Mandi rates for {cropName}, rupees per quintal</caption>
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
              <th scope="col" className="py-3 pl-6 pr-4 font-semibold">
                Mandi
              </th>
              {columns.map((column) =>
              <th key={column.key} scope="col" className="px-4 py-3 font-semibold">
                  <button
                  type="button"
                  onClick={() => setSortKey(column.key)}
                  title={column.help}
                  className={`inline-flex items-center gap-1 rounded transition-colors duration-150 ease-swift hover:text-ink ${
                  sortKey === column.key ? 'text-leaf-700' : ''}`
                  }>
                  
                    {column.label}
                    <ArrowUpDownIcon className="h-3 w-3" aria-hidden="true" />
                  </button>
                </th>
              )}
              <th scope="col" className="px-4 py-3 font-semibold">
                7-day trend
              </th>
              <th scope="col" className="px-4 py-3 pr-6 font-semibold">
                vs yesterday
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((quote, index) => {
              const change = changePct(quote.modal, quote.prevModal);
              const history = buildHistory(quote.modal, quote.prevModal, quote.mandi.distanceKm + index * 13);
              const isBest = quote.mandi.id === bestMandiId;
              const leftPct = (quote.min - domain.low) / span * 100;
              const widthPct = (quote.max - quote.min) / span * 100;
              const modalPct = (quote.modal - domain.low) / span * 100;

              return (
                <tr
                  key={quote.mandi.id}
                  className={`border-b border-line/70 last:border-0 ${isBest ? 'bg-leaf-50/70' : ''}`}>
                  
                  <th scope="row" className="py-4 pl-6 pr-4 align-top font-normal">
                    <span className="flex items-center gap-2">
                      <span className="font-display text-[15px] font-semibold">{quote.mandi.name}</span>
                      {isBest &&
                      <span className="rounded-md bg-leaf-700 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Best
                        </span>
                      }
                      {!quote.mandi.openToday &&
                      <span className="rounded-md border border-line-strong px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
                          Closed
                        </span>
                      }
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-muted">
                      {quote.mandi.district}, {quote.mandi.state}
                    </span>
                  </th>

                  <td className="px-4 py-4 align-top">
                    <span className="tnum block text-[15px] font-semibold">{inr(quote.modal)}</span>
                    <span className="mt-2 block h-1.5 w-32 rounded-full bg-canvas" aria-hidden="true">
                      <span className="relative block h-1.5" style={{ marginLeft: `${leftPct}%`, width: `${widthPct}%` }}>
                        <span className="absolute inset-0 rounded-full bg-line-strong" />
                      </span>
                    </span>
                    <span className="tnum mt-1 block text-[11px] text-ink-faint">
                      {inr(quote.min)} – {inr(quote.max)} band
                      <span className="sr-only">, modal at {modalPct.toFixed(0)} percent of the band</span>
                    </span>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <span className={`tnum block text-[15px] font-semibold ${isBest ? 'text-leaf-700' : ''}`}>
                      {inr(includeTransport ? quote.net : quote.modal)}
                    </span>
                    <span className="tnum mt-1 block text-[11px] text-ink-faint">
                      {includeTransport ? `less ${inr(transportCost(quote.mandi.distanceKm))} freight` : 'freight not applied'}
                    </span>
                  </td>

                  <td className="tnum px-4 py-4 align-top text-sm text-ink-muted">{quote.arrivalsTonnes} t</td>
                  <td className="tnum px-4 py-4 align-top text-sm text-ink-muted">{quote.mandi.distanceKm} km</td>

                  <td className="px-4 py-4 align-top">
                    <Sparkline
                      values={history}
                      rising={change >= 0}
                      label={`Seven day trend for ${quote.mandi.name}, ${change >= 0 ? 'rising' : 'falling'}`} />
                    
                  </td>

                  <td className="px-4 py-4 pr-6 align-top">
                    <Delta value={change} />
                  </td>
                </tr>);

            })}
          </tbody>
        </table>
      </div>
    </section>);

}