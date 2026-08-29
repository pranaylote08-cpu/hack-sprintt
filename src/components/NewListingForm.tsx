import { useMemo, useState } from 'react';
import { SparklesIcon } from 'lucide-react';
import { crops } from '../data/crops';
import { Grade } from '../types';
import { NewListingInput } from '../contexts/MarketContext';
import { inr } from '../utils/format';
import { bestQuoteForCrop, topModalForCrop } from '../utils/market';

interface NewListingFormProps {
  onCreate: (input: NewListingInput) => void;
  onCancel: () => void;
}

export function NewListingForm({ onCreate, onCancel }: NewListingFormProps) {
  const [cropId, setCropId] = useState(crops[0].id);
  const [quantity, setQuantity] = useState('50');
  const [price, setPrice] = useState(String(topModalForCrop(crops[0].id)));
  const [grade, setGrade] = useState<Grade>('A');
  const [organic, setOrganic] = useState(false);
  const [description, setDescription] = useState('');

  const suggestion = useMemo(() => {
    const best = bestQuoteForCrop(cropId, true);
    return best ? Math.round(best.net + 60) : topModalForCrop(cropId);
  }, [cropId]);

  const handleCropChange = (nextCropId: string) => {
    setCropId(nextCropId);
    const best = bestQuoteForCrop(nextCropId, true);
    setPrice(String(best ? Math.round(best.net + 60) : topModalForCrop(nextCropId)));
  };

  const numericQuantity = Number(quantity) || 0;
  const numericPrice = Number(price) || 0;
  const valid = numericQuantity > 0 && numericPrice > 0;

  return (
    <form
      className="rounded-2xl border border-line bg-surface p-6 shadow-card"
      onSubmit={(event) => {
        event.preventDefault();
        if (!valid) return;
        onCreate({
          cropId,
          quantityQuintal: numericQuantity,
          pricePerQuintal: numericPrice,
          grade,
          organic,
          description
        });
      }}>
      
      <h2 className="font-display text-lg font-semibold tracking-tight">List a lot for buyers</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Buyers see your rate against today's mandi prices, so a fair ask moves faster.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold text-ink-muted">Crop</span>
          <select
            value={cropId}
            onChange={(event) => handleCropChange(event.target.value)}
            className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm">
            
            {crops.map((crop) =>
            <option key={crop.id} value={crop.id}>
                {crop.name} — {crop.nameHi}
              </option>
            )}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-ink-muted">Quantity (quintal)</span>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className="tnum mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm" />
          
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-ink-muted">Your rate (₹ per quintal)</span>
          <input
            type="number"
            min={1}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="tnum mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm" />
          
          <button
            type="button"
            onClick={() => setPrice(String(suggestion))}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-leaf-50 px-2 py-1 text-xs font-semibold text-leaf-700 transition-colors duration-150 ease-swift hover:bg-leaf-100">
            
            <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Use {inr(suggestion)} — beats mandi take-home
          </button>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs font-semibold text-ink-muted">Grade</span>
            <select
              value={grade}
              onChange={(event) => setGrade(event.target.value as Grade)}
              className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm">
              
              <option value="A">A — premium</option>
              <option value="B">B — standard</option>
              <option value="C">C — processing</option>
            </select>
          </label>
          <label className="flex items-end gap-2 pb-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={organic}
              onChange={(event) => setOrganic(event.target.checked)}
              className="h-4 w-4 accent-leaf-600" />
            
            Organic
          </label>
        </div>

        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold text-ink-muted">Lot details</span>
          <textarea
            rows={2}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Variety, packing, moisture, pickup window…"
            className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm" />
          
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <p className="tnum text-sm text-ink-muted">
          Lot value <span className="text-lg font-semibold text-ink">{inr(numericQuantity * numericPrice)}</span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink-muted transition-colors duration-150 ease-swift hover:text-ink">
            
            Cancel
          </button>
          <button
            type="submit"
            disabled={!valid}
            className="rounded-xl bg-leaf-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 ease-swift hover:bg-leaf-600 disabled:cursor-not-allowed disabled:bg-line-strong">
            
            Publish lot
          </button>
        </div>
      </div>
    </form>);

}