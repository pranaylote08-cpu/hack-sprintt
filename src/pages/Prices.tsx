import { useMemo, useState } from 'react';
import { BestMandiPanel } from '../components/BestMandiPanel';
import { CropSelector } from '../components/CropSelector';
import { DirectSaleCard } from '../components/DirectSaleCard';
import { MandiTable } from '../components/MandiTable';
import { activeBuyersByCrop } from '../data/buyers';
import { priceUpdatedAt } from '../data/prices';
import { useMarket } from '../contexts/MarketContext';
import { bestQuoteForCrop, getCrop, nearestQuoteForCrop, quotesForCrop } from '../utils/market';

export function Prices() {
  const { role, listings, myListings } = useMarket();
  const [cropId, setCropId] = useState('tomato');
  const [includeTransport, setIncludeTransport] = useState(true);

  const crop = getCrop(cropId);
  const quotes = useMemo(() => quotesForCrop(cropId), [cropId]);
  const best = bestQuoteForCrop(cropId, includeTransport);
  const nearest = nearestQuoteForCrop(cropId);

  const loadQuintal = myListings.find((listing) => listing.cropId === cropId)?.quantityQuintal ?? 50;

  const buyerAsk = useMemo(() => {
    const open = listings.filter((listing) => listing.cropId === cropId && listing.status !== 'sold');
    if (!open.length) return null;
    return Math.round(open.reduce((sum, listing) => sum + listing.pricePerQuintal, 0) / open.length);
  }, [listings, cropId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Live mandi rates</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Pick your crop, then see which yard actually pays the most once travel is counted.
          </p>
        </div>
        <p className="text-xs text-ink-faint">Updated {priceUpdatedAt} · rupees per quintal</p>
      </div>

      <CropSelector selectedCropId={cropId} onSelect={setCropId} />

      {best && nearest ?
      <>
          <div className="grid gap-5 lg:grid-cols-3">
            <BestMandiPanel
            quote={best}
            nearest={nearest}
            cropName={crop.name}
            cropNameHi={crop.nameHi}
            includeTransport={includeTransport}
            loadQuintal={loadQuintal} />
          
            <DirectSaleCard
            cropName={crop.name}
            bestNet={includeTransport ? best.net : best.modal}
            buyerAsk={buyerAsk}
            activeBuyers={activeBuyersByCrop[cropId] ?? 12}
            role={role} />
          
          </div>

          <MandiTable
          quotes={quotes}
          includeTransport={includeTransport}
          onIncludeTransportChange={setIncludeTransport}
          bestMandiId={best.mandi.id}
          cropName={crop.name} />
        
        </> :

      <p className="rounded-2xl border border-line bg-surface p-8 text-center text-sm text-ink-muted">
          No yards have reported {crop.name} rates today. Rates usually arrive by 11 AM.
        </p>
      }
    </div>);

}