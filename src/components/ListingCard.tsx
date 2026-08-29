import { BadgeCheckIcon, LeafIcon, MapPinIcon, StarIcon } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Listing } from '../types';
import { inr } from '../utils/format';
import { getCrop, topModalForCrop } from '../utils/market';

interface ListingCardProps {
  listing: Listing;
  onOpen: (listing: Listing) => void;
}

export function ListingCard({ listing, onOpen }: ListingCardProps) {
  const crop = getCrop(listing.cropId);
  const reference = topModalForCrop(listing.cropId);
  const gap = listing.pricePerQuintal - reference;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="relative h-40 w-full overflow-hidden bg-canvas">
        <img
          src={listing.image}
          alt={`${crop.name} lot from ${listing.farmer.village}`}
          className="h-full w-full object-cover"
          loading="lazy" />
        
        <span className="absolute left-3 top-3">
          <StatusBadge status={listing.status} />
        </span>
        {listing.organic &&
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-leaf-700 px-2 py-0.5 text-xs font-semibold text-white">
            <LeafIcon className="h-3 w-3" aria-hidden="true" />
            Organic
          </span>
        }
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[17px] font-semibold leading-tight tracking-tight">
            {crop.name} <span className="text-ink-faint">{crop.nameHi}</span>
          </h3>
          <span className="rounded-md border border-line bg-canvas px-1.5 py-0.5 text-xs font-semibold text-ink-muted">
            Grade {listing.grade}
          </span>
        </div>

        <p className="tnum mt-3 text-2xl font-semibold tracking-tight">
          {inr(listing.pricePerQuintal)}
          <span className="ml-1 text-sm font-medium text-ink-muted">/qtl</span>
        </p>
        <p className="tnum mt-1 text-xs text-ink-muted">
          {gap === 0 ?
          'level with the top mandi rate' :
          `${inr(Math.abs(gap))}/qtl ${gap < 0 ? 'below' : 'above'} the top mandi rate`}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-y-2 border-t border-line pt-4 text-xs">
          <dt className="text-ink-muted">Quantity</dt>
          <dd className="tnum text-right font-semibold">{listing.quantityQuintal} qtl</dd>
          <dt className="text-ink-muted">Harvested</dt>
          <dd className="text-right font-semibold">{listing.harvestedOn}</dd>
          <dt className="text-ink-muted">Lot value</dt>
          <dd className="tnum text-right font-semibold">{inr(listing.quantityQuintal * listing.pricePerQuintal)}</dd>
        </dl>

        <div className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-clay-100 text-[11px] font-semibold text-clay-700">
            {listing.farmer.name.
            split(' ').
            map((part) => part[0]).
            join('')}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="flex items-center gap-1 font-semibold text-ink">
              <span className="truncate">{listing.farmer.name}</span>
              {listing.farmer.verified && <BadgeCheckIcon className="h-3.5 w-3.5 shrink-0 text-leaf-600" aria-label="Verified farmer" />}
            </span>
            <span className="flex items-center gap-2">
              <span className="tnum inline-flex items-center gap-0.5">
                <StarIcon className="h-3 w-3 fill-clay-500 text-clay-500" aria-hidden="true" />
                {listing.farmer.rating}
              </span>
              <span className="tnum inline-flex items-center gap-0.5">
                <MapPinIcon className="h-3 w-3" aria-hidden="true" />
                {listing.farmer.village}
              </span>
            </span>
          </span>
        </div>

        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={() => onOpen(listing)}
            className="w-full rounded-xl bg-leaf-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 ease-swift hover:bg-leaf-600">
            
            View lot &amp; contact
          </button>
        </div>
      </div>
    </article>);

}