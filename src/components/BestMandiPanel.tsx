import { ClockIcon, RouteIcon, ScaleIcon, WarehouseIcon } from 'lucide-react';
import { Delta } from './Delta';
import { MandiQuote } from '../utils/market';
import { changePct, inr, transportCost } from '../utils/format';

interface BestMandiPanelProps {
  quote: MandiQuote;
  nearest: MandiQuote;
  cropName: string;
  cropNameHi: string;
  includeTransport: boolean;
  loadQuintal: number;
}

export function BestMandiPanel({
  quote,
  nearest,
  cropName,
  cropNameHi,
  includeTransport,
  loadQuintal
}: BestMandiPanelProps) {
  const headline = includeTransport ? quote.net : quote.modal;
  const nearestValue = includeTransport ? nearest.net : nearest.modal;
  const gap = headline - nearestValue;
  const change = changePct(quote.modal, quote.prevModal);
  const sameYard = quote.mandi.id === nearest.mandi.id;

  return (
    <section
      className="flex flex-col rounded-2xl border border-leaf-200 bg-surface p-6 shadow-card lg:col-span-2"
      aria-labelledby="best-mandi-heading">
      
      <p className="text-sm font-medium text-leaf-600">
        Best yard for {cropName} <span className="text-ink-faint">{cropNameHi}</span> today
      </p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h2 id="best-mandi-heading" className="font-display text-3xl font-semibold tracking-tight">
          {quote.mandi.name}
        </h2>
        <span className="text-sm text-ink-muted">
          {quote.mandi.district}, {quote.mandi.state}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-3">
        <p className="tnum font-display text-[56px] font-semibold leading-none tracking-tight text-leaf-700">
          {inr(headline)}
        </p>
        <p className="pb-2 text-sm text-ink-muted">
          per quintal
          <span className="block text-xs text-ink-faint">
            {includeTransport ? 'after freight, at your gate' : 'yard rate, freight not applied'}
          </span>
        </p>
        <span className="pb-3">
          <Delta value={change} size="lg" />
        </span>
      </div>

      {!sameYard && gap > 0 ?
      <p className="mt-5 rounded-xl bg-leaf-50 px-4 py-3 text-sm text-leaf-900">
          <span className="tnum font-semibold">{inr(gap)}/qtl more</span> than {nearest.mandi.name}, your nearest yard —
          about <span className="tnum font-semibold">{inr(gap * loadQuintal)}</span> extra on a {loadQuintal} quintal
          load.
        </p> :

      <p className="mt-5 rounded-xl bg-canvas px-4 py-3 text-sm text-ink-muted">
          Your nearest yard is also paying the most today. No extra travel needed.
        </p>
      }

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-5 sm:grid-cols-4">
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-ink-muted">
            <RouteIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Distance
          </dt>
          <dd className="tnum mt-1 text-sm font-semibold">{quote.mandi.distanceKm} km</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-ink-muted">
            <ScaleIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Freight estimate
          </dt>
          <dd className="tnum mt-1 text-sm font-semibold">{inr(transportCost(quote.mandi.distanceKm))}/qtl</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-ink-muted">
            <WarehouseIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Arrivals today
          </dt>
          <dd className="tnum mt-1 text-sm font-semibold">{quote.arrivalsTonnes} tonnes</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-ink-muted">
            <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Day band
          </dt>
          <dd className="tnum mt-1 text-sm font-semibold">
            {inr(quote.min)} – {inr(quote.max)}
          </dd>
        </div>
      </dl>
    </section>);

}