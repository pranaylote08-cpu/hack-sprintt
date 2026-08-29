import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { SearchIcon, SlidersHorizontalIcon } from 'lucide-react';
import { ListingCard } from '../components/ListingCard';
import { ListingDetailPanel } from '../components/ListingDetailPanel';
import { crops } from '../data/crops';
import { Listing } from '../types';
import { useMarket } from '../contexts/MarketContext';
import { inr } from '../utils/format';

type SortKey = 'rate-low' | 'rate-high' | 'distance' | 'fresh';

export function Marketplace() {
  const { role, listings, placeOrder, sendOffer } = useMarket();
  const [cropId, setCropId] = useState('all');
  const [state, setState] = useState('all');
  const [grade, setGrade] = useState('all');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [hideSold, setHideSold] = useState(true);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('rate-low');
  const [active, setActive] = useState<Listing | null>(null);

  const states = useMemo(() => Array.from(new Set(listings.map((l) => l.farmer.state))), [listings]);

  const visible = useMemo(() => {
    const filtered = listings.filter((listing) => {
      if (cropId !== 'all' && listing.cropId !== cropId) return false;
      if (state !== 'all' && listing.farmer.state !== state) return false;
      if (grade !== 'all' && listing.grade !== grade) return false;
      if (organicOnly && !listing.organic) return false;
      if (hideSold && listing.status === 'sold') return false;
      if (query.trim()) {
        const haystack = `${listing.farmer.name} ${listing.farmer.village} ${listing.farmer.district} ${listing.id}`.toLowerCase();
        if (!haystack.includes(query.trim().toLowerCase())) return false;
      }
      return true;
    });

    switch (sort) {
      case 'rate-high':
        return filtered.sort((a, b) => b.pricePerQuintal - a.pricePerQuintal);
      case 'distance':
        return filtered.sort((a, b) => a.farmer.distanceKm - b.farmer.distanceKm);
      case 'fresh':
        return filtered.sort((a, b) => Date.parse(b.harvestedOn) - Date.parse(a.harvestedOn));
      default:
        return filtered.sort((a, b) => a.pricePerQuintal - b.pricePerQuintal);
    }
  }, [listings, cropId, state, grade, organicOnly, hideSold, query, sort]);

  const totalQuintals = visible.reduce((sum, listing) => sum + listing.quantityQuintal, 0);

  const handleBuy = (listing: Listing, quantity: number) => {
    placeOrder(listing, quantity);
    setActive(null);
    toast.success(`Purchase confirmed — ${quantity} qtl from ${listing.farmer.name}`, {
      description: `${inr(quantity * listing.pricePerQuintal)} · pickup details sent to both parties.`
    });
  };

  const handleOffer = (listing: Listing, price: number, quantity: number, message: string) => {
    sendOffer(listing, price, quantity, message);
    setActive(null);
    toast.success(`Offer sent to ${listing.farmer.name}`, {
      description: `${quantity} qtl at ${inr(price)}/qtl. You will be notified when they respond.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {role === 'buyer' ? 'Buy directly from farmers' : 'How buyers see the board'}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {visible.length} lots · {totalQuintals.toLocaleString('en-IN')} quintal available, priced against today's
            mandi rates.
          </p>
        </div>
        <label className="relative w-full max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          <span className="sr-only">Search farmers, villages or lot numbers</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search farmer, village or lot"
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-9 pr-3 text-sm" />
          
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-line bg-surface p-5 shadow-card lg:sticky lg:top-24">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontalIcon className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            Filters
          </h2>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-ink-muted">Crop</span>
              <select
                value={cropId}
                onChange={(event) => setCropId(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm">
                
                <option value="all">All crops</option>
                {crops.map((crop) =>
                <option key={crop.id} value={crop.id}>
                    {crop.name}
                  </option>
                )}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-muted">State</span>
              <select
                value={state}
                onChange={(event) => setState(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm">
                
                <option value="all">All states</option>
                {states.map((option) =>
                <option key={option} value={option}>
                    {option}
                  </option>
                )}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-muted">Grade</span>
              <select
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm">
                
                <option value="all">Any grade</option>
                <option value="A">A — premium</option>
                <option value="B">B — standard</option>
                <option value="C">C — processing</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-ink-muted">Sort by</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm">
                
                <option value="rate-low">Lowest rate first</option>
                <option value="rate-high">Highest rate first</option>
                <option value="distance">Nearest farmer</option>
                <option value="fresh">Freshest harvest</option>
              </select>
            </label>

            <div className="space-y-2 border-t border-line pt-4 text-sm">
              <label className="flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(event) => setOrganicOnly(event.target.checked)}
                  className="h-4 w-4 accent-leaf-600" />
                
                Organic only
              </label>
              <label className="flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  checked={hideSold}
                  onChange={(event) => setHideSold(event.target.checked)}
                  className="h-4 w-4 accent-leaf-600" />
                
                Hide sold lots
              </label>
            </div>
          </div>
        </aside>

        {visible.length ?
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((listing) =>
          <ListingCard key={listing.id} listing={listing} onOpen={setActive} />
          )}
          </div> :

        <p className="rounded-2xl border border-line bg-surface p-10 text-center text-sm text-ink-muted">
            No lots match these filters yet. Widen the crop or state filter to see more farmers.
          </p>
        }
      </div>

      <ListingDetailPanel
        listing={active}
        canTransact={role === 'buyer'}
        onClose={() => setActive(null)}
        onBuy={handleBuy}
        onOffer={handleOffer} />
      
    </div>);

}