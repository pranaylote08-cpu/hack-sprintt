import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheckIcon, PhoneIcon, StarIcon, TruckIcon, XIcon } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Listing } from '../types';
import { inr } from '../utils/format';
import { getCrop, topModalForCrop } from '../utils/market';

interface ListingDetailPanelProps {
  listing: Listing | null;
  canTransact: boolean;
  onClose: () => void;
  onBuy: (listing: Listing, quantityQuintal: number) => void;
  onOffer: (listing: Listing, price: number, quantity: number, message: string) => void;
}

export function ListingDetailPanel({ listing, canTransact, onClose, onBuy, onOffer }: ListingDetailPanelProps) {
  const [quantity, setQuantity] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0);
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'buy' | 'offer'>('buy');

  useEffect(() => {
    if (listing) {
      setQuantity(listing.quantityQuintal);
      setOfferPrice(listing.pricePerQuintal);
      setMessage('');
      setMode('buy');
    }
  }, [listing]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const crop = listing ? getCrop(listing.cropId) : null;
  const reference = listing ? topModalForCrop(listing.cropId) : 0;

  return (
    <AnimatePresence>
      {listing && crop &&
      <motion.div
        className="fixed inset-0 z-50 flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}>
        
          <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
          <motion.aside
          role="dialog"
          aria-modal="true"
          aria-label={`${crop.name} lot ${listing.id}`}
          className="relative h-full w-full max-w-[520px] overflow-y-auto bg-surface shadow-panel"
          initial={{ x: 32, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 32, opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}>
          
            <img src={listing.image} alt={`${crop.name} from ${listing.farmer.village}`} className="h-52 w-full object-cover" />
            <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink transition-colors duration-150 ease-swift hover:bg-canvas">
            
              <XIcon className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>

            <div className="p-6">
              <div className="flex items-center gap-3">
                <StatusBadge status={listing.status} />
                <span className="text-xs text-ink-faint">Lot {listing.id}</span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight">
                {crop.name} <span className="text-ink-faint">{crop.nameHi}</span> · Grade {listing.grade}
              </h2>
              <p className="mt-2 text-sm text-ink-muted">{listing.description}</p>

              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl bg-canvas p-4 text-sm">
                <div>
                  <dt className="text-xs text-ink-muted">Asking rate</dt>
                  <dd className="tnum mt-0.5 text-lg font-semibold">{inr(listing.pricePerQuintal)}/qtl</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-muted">Top mandi rate today</dt>
                  <dd className="tnum mt-0.5 text-lg font-semibold text-ink-muted">{inr(reference)}/qtl</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-muted">Available</dt>
                  <dd className="tnum mt-0.5 font-semibold">{listing.quantityQuintal} quintal</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-muted">Harvested</dt>
                  <dd className="mt-0.5 font-semibold">{listing.harvestedOn}</dd>
                </div>
              </dl>

              <div className="mt-5 rounded-xl border border-line p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-clay-100 text-sm font-semibold text-clay-700">
                    {listing.farmer.name.
                  split(' ').
                  map((part) => part[0]).
                  join('')}
                  </span>
                  <span className="leading-tight">
                    <span className="flex items-center gap-1 text-sm font-semibold">
                      {listing.farmer.name}
                      {listing.farmer.verified &&
                    <BadgeCheckIcon className="h-4 w-4 text-leaf-600" aria-label="Verified farmer" />
                    }
                    </span>
                    <span className="text-xs text-ink-muted">
                      {listing.farmer.village}, {listing.farmer.district} · {listing.farmer.state}
                    </span>
                  </span>
                  <span className="tnum ml-auto text-right text-xs text-ink-muted">
                    <span className="flex items-center justify-end gap-1 text-sm font-semibold text-ink">
                      <StarIcon className="h-3.5 w-3.5 fill-clay-500 text-clay-500" aria-hidden="true" />
                      {listing.farmer.rating}
                    </span>
                    {listing.farmer.deals} deals
                  </span>
                </div>
                <p className="tnum mt-3 flex items-center gap-2 border-t border-line pt-3 text-xs text-ink-muted">
                  <TruckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {listing.farmer.distanceKm} km from you · farm-gate pickup available
                  <span className="ml-auto inline-flex items-center gap-1 font-semibold text-ink">
                    <PhoneIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {listing.farmer.phone}
                  </span>
                </p>
              </div>

              {canTransact && listing.status !== 'sold' ?
            <div className="mt-6">
                  <div className="flex gap-1 rounded-xl bg-canvas p-1" role="tablist" aria-label="Purchase mode">
                    {(['buy', 'offer'] as const).map((option) =>
                <button
                  key={option}
                  role="tab"
                  aria-selected={mode === option}
                  type="button"
                  onClick={() => setMode(option)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-150 ease-swift ${
                  mode === option ? 'bg-surface text-ink shadow-card' : 'text-ink-muted hover:text-ink'}`
                  }>
                  
                        {option === 'buy' ? 'Buy at asking rate' : 'Send an offer'}
                      </button>
                )}
                  </div>

                  <div className="mt-4 space-y-4">
                    <label className="block">
                      <span className="text-xs font-semibold text-ink-muted">Quantity (quintal)</span>
                      <input
                    type="number"
                    min={1}
                    max={listing.quantityQuintal}
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    className="tnum mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm" />
                  
                    </label>

                    {mode === 'offer' &&
                <>
                        <label className="block">
                          <span className="text-xs font-semibold text-ink-muted">Your rate (₹ per quintal)</span>
                          <input
                      type="number"
                      min={1}
                      value={offerPrice}
                      onChange={(event) => setOfferPrice(Number(event.target.value))}
                      className="tnum mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm" />
                    
                        </label>
                        <label className="block">
                          <span className="text-xs font-semibold text-ink-muted">Message to the farmer</span>
                          <textarea
                      rows={3}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Pickup timing, payment terms, grading expectations…"
                      className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm" />
                    
                        </label>
                      </>
                }

                    <p className="tnum flex items-baseline justify-between rounded-xl bg-canvas px-4 py-3 text-sm">
                      <span className="text-ink-muted">Deal value</span>
                      <span className="text-lg font-semibold">
                        {inr((mode === 'buy' ? listing.pricePerQuintal : offerPrice) * (quantity || 0))}
                      </span>
                    </p>

                    <button
                  type="button"
                  disabled={!quantity || quantity < 1 || quantity > listing.quantityQuintal}
                  onClick={() =>
                  mode === 'buy' ?
                  onBuy(listing, quantity) :
                  onOffer(listing, offerPrice, quantity, message)
                  }
                  className="w-full rounded-xl bg-leaf-700 px-4 py-3 text-sm font-semibold text-white transition-colors duration-150 ease-swift hover:bg-leaf-600 disabled:cursor-not-allowed disabled:bg-line-strong">
                  
                      {mode === 'buy' ? 'Confirm purchase' : 'Send offer to farmer'}
                    </button>
                  </div>
                </div> :

            <p className="mt-6 rounded-xl bg-canvas px-4 py-3 text-sm text-ink-muted">
                  {listing.status === 'sold' ?
              'This lot has been sold. Similar lots are listed by nearby farmers.' :
              'This is how buyers see your lot. Offers arrive under My produce.'}
                </p>
            }
            </div>
          </motion.aside>
        </motion.div>
      }
    </AnimatePresence>);

}