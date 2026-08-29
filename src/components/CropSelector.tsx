import { crops } from '../data/crops';
import { inr } from '../utils/format';
import { topModalForCrop } from '../utils/market';

interface CropSelectorProps {
  selectedCropId: string;
  onSelect: (cropId: string) => void;
}

export function CropSelector({ selectedCropId, onSelect }: CropSelectorProps) {
  return (
    <div role="tablist" aria-label="Choose a crop" className="flex flex-wrap gap-2">
      {crops.map((crop) => {
        const active = crop.id === selectedCropId;
        return (
          <button
            key={crop.id}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onSelect(crop.id)}
            className={`group rounded-xl border px-3.5 py-2.5 text-left transition-colors duration-150 ease-swift ${
            active ?
            'border-leaf-600 bg-leaf-700 text-white' :
            'border-line bg-surface text-ink hover:border-line-strong'}`
            }>
            
            <span className="block text-sm font-semibold leading-tight">
              {crop.name} <span className={active ? 'text-leaf-100' : 'text-ink-faint'}>{crop.nameHi}</span>
            </span>
            <span className={`tnum mt-0.5 block text-xs ${active ? 'text-leaf-100' : 'text-ink-muted'}`}>
              up to {inr(topModalForCrop(crop.id))}/qtl
            </span>
          </button>);

      })}
    </div>);

}