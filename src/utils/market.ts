import { crops } from '../data/crops';
import { mandis } from '../data/mandis';
import { priceRecords } from '../data/prices';
import { Crop, Mandi, PriceRecord } from '../types';
import { netRealisation } from './format';

export interface MandiQuote extends PriceRecord {
  mandi: Mandi;
  net: number;
}

export function getCrop(cropId: string): Crop {
  return crops.find((c) => c.id === cropId) ?? crops[0];
}

export function getMandi(mandiId: string): Mandi {
  return mandis.find((m) => m.id === mandiId) ?? mandis[0];
}

export function quotesForCrop(cropId: string): MandiQuote[] {
  return priceRecords.
  filter((record) => record.cropId === cropId).
  map((record) => {
    const mandi = getMandi(record.mandiId);
    return { ...record, mandi, net: netRealisation(record.modal, mandi.distanceKm) };
  });
}

/** Highest modal price available for a crop today — the marketplace reference rate. */
export function topModalForCrop(cropId: string): number {
  const quotes = quotesForCrop(cropId);
  if (!quotes.length) return 0;
  return Math.max(...quotes.map((q) => q.modal));
}

/** Nearest mandi's modal price — what a farmer would get without comparing. */
export function nearestQuoteForCrop(cropId: string): MandiQuote | undefined {
  return [...quotesForCrop(cropId)].sort((a, b) => a.mandi.distanceKm - b.mandi.distanceKm)[0];
}

export function bestQuoteForCrop(cropId: string, byNet: boolean): MandiQuote | undefined {
  const open = quotesForCrop(cropId).filter((q) => q.mandi.openToday);
  if (!open.length) return undefined;
  return [...open].sort((a, b) => byNet ? b.net - a.net : b.modal - a.modal)[0];
}