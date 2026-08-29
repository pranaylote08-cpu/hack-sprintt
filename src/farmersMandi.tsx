import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import {
  ArrowDownRightIcon,
  ArrowRightIcon,
  ArrowUpDownIcon,
  ArrowUpRightIcon,
  BadgeCheckIcon,
  ClockIcon,
  HandshakeIcon,
  LeafIcon,
  MapPinIcon,
  MinusIcon,
  PhoneIcon,
  PlusIcon,
  RadioIcon,
  RouteIcon,
  ScaleIcon,
  SearchIcon,
  SparklesIcon,
  SproutIcon,
  StarIcon,
  Trash2Icon,
  TruckIcon,
  UsersIcon,
  WarehouseIcon,
  XIcon
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';

// ==========================================
// 1. TYPES
// ==========================================

export type Grade = 'A' | 'B' | 'C';
export type ListingStatus = 'available' | 'reserved' | 'sold';
export type Role = 'farmer' | 'buyer';

export interface Crop {
  id: string;
  name: string;
  nameHi: string;
  unitLabel: string;
}

export interface Mandi {
  id: string;
  name: string;
  district: string;
  state: string;
  distanceKm: number;
  openToday: boolean;
}

export interface PriceRecord {
  cropId: string;
  mandiId: string;
  modal: number;
  min: number;
  max: number;
  prevModal: number;
  arrivalsTonnes: number;
}

export interface Farmer {
  name: string;
  village: string;
  district: string;
  state: string;
  distanceKm: number;
  rating: number;
  deals: number;
  verified: boolean;
  phone: string;
}

export interface Listing {
  id: string;
  cropId: string;
  farmer: Farmer;
  quantityQuintal: number;
  pricePerQuintal: number;
  grade: Grade;
  organic: boolean;
  harvestedOn: string;
  image: string;
  description: string;
  status: ListingStatus;
}

export interface Offer {
  id: string;
  listingId: string;
  buyerName: string;
  company: string;
  pricePerQuintal: number;
  quantityQuintal: number;
  message: string;
  placedAgo: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Order {
  id: string;
  listingId: string;
  cropId: string;
  farmerName: string;
  quantityQuintal: number;
  pricePerQuintal: number;
  placedAgo: string;
  status: 'placed' | 'in-transit' | 'delivered';
}

export interface MandiQuote extends PriceRecord {
  mandi: Mandi;
  net: number;
}

export interface NewListingInput {
  cropId: string;
  quantityQuintal: number;
  pricePerQuintal: number;
  grade: Grade;
  organic: boolean;
  description: string;
}

// ==========================================
// 2. DATA & CONSTANTS
// ==========================================

export const crops: Crop[] = [
  { id: 'tomato', name: 'Tomato', nameHi: 'टमाटर', unitLabel: 'quintal' },
  { id: 'onion', name: 'Onion', nameHi: 'प्याज़', unitLabel: 'quintal' },
  { id: 'potato', name: 'Potato', nameHi: 'आलू', unitLabel: 'quintal' },
  { id: 'green-chilli', name: 'Green Chilli', nameHi: 'हरी मिर्च', unitLabel: 'quintal' },
  { id: 'wheat', name: 'Wheat', nameHi: 'गेहूँ', unitLabel: 'quintal' },
  { id: 'soybean', name: 'Soybean', nameHi: 'सोयाबीन', unitLabel: 'quintal' },
  { id: 'maize', name: 'Maize', nameHi: 'मक्का', unitLabel: 'quintal' },
  { id: 'cotton', name: 'Cotton', nameHi: 'कपास', unitLabel: 'quintal' }
];

export const mandis: Mandi[] = [
  { id: 'hubballi', name: 'Hubballi APMC', district: 'Dharwad', state: 'Karnataka', distanceKm: 34, openToday: true },
  { id: 'davanagere', name: 'Davanagere APMC', district: 'Davanagere', state: 'Karnataka', distanceKm: 58, openToday: true },
  { id: 'belagavi', name: 'Belagavi APMC', district: 'Belagavi', state: 'Karnataka', distanceKm: 78, openToday: true },
  { id: 'kolar', name: 'Kolar APMC', district: 'Kolar', state: 'Karnataka', distanceKm: 96, openToday: true },
  { id: 'solapur', name: 'Solapur Market Yard', district: 'Solapur', state: 'Maharashtra', distanceKm: 188, openToday: true },
  { id: 'yeshwanthpur', name: 'Yeshwanthpur Market', district: 'Bengaluru', state: 'Karnataka', distanceKm: 142, openToday: true },
  { id: 'pune', name: 'Pune Gultekdi', district: 'Pune', state: 'Maharashtra', distanceKm: 246, openToday: false },
  { id: 'lasalgaon', name: 'Lasalgaon Yard', district: 'Nashik', state: 'Maharashtra', distanceKm: 312, openToday: true }
];

export const priceRecords: PriceRecord[] = [
  // Tomato
  { cropId: 'tomato', mandiId: 'hubballi', modal: 2180, min: 1600, max: 2600, prevModal: 2050, arrivalsTonnes: 142 },
  { cropId: 'tomato', mandiId: 'davanagere', modal: 2340, min: 1800, max: 2750, prevModal: 2410, arrivalsTonnes: 96 },
  { cropId: 'tomato', mandiId: 'belagavi', modal: 2050, min: 1500, max: 2400, prevModal: 1980, arrivalsTonnes: 118 },
  { cropId: 'tomato', mandiId: 'kolar', modal: 2620, min: 2100, max: 3100, prevModal: 2380, arrivalsTonnes: 384 },
  { cropId: 'tomato', mandiId: 'yeshwanthpur', modal: 2480, min: 1900, max: 2900, prevModal: 2520, arrivalsTonnes: 265 },
  { cropId: 'tomato', mandiId: 'solapur', modal: 2260, min: 1700, max: 2650, prevModal: 2140, arrivalsTonnes: 74 },
  { cropId: 'tomato', mandiId: 'pune', modal: 2710, min: 2200, max: 3200, prevModal: 2600, arrivalsTonnes: 210 },
  { cropId: 'tomato', mandiId: 'lasalgaon', modal: 2390, min: 1850, max: 2800, prevModal: 2430, arrivalsTonnes: 158 },
  // Onion
  { cropId: 'onion', mandiId: 'hubballi', modal: 1720, min: 1200, max: 2100, prevModal: 1640, arrivalsTonnes: 310 },
  { cropId: 'onion', mandiId: 'davanagere', modal: 1660, min: 1150, max: 2000, prevModal: 1700, arrivalsTonnes: 188 },
  { cropId: 'onion', mandiId: 'belagavi', modal: 1810, min: 1350, max: 2200, prevModal: 1690, arrivalsTonnes: 224 },
  { cropId: 'onion', mandiId: 'solapur', modal: 2140, min: 1600, max: 2600, prevModal: 1980, arrivalsTonnes: 640 },
  { cropId: 'onion', mandiId: 'lasalgaon', modal: 2280, min: 1750, max: 2750, prevModal: 2210, arrivalsTonnes: 890 },
  { cropId: 'onion', mandiId: 'yeshwanthpur', modal: 1940, min: 1450, max: 2350, prevModal: 1960, arrivalsTonnes: 275 },
  { cropId: 'onion', mandiId: 'pune', modal: 2190, min: 1700, max: 2600, prevModal: 2080, arrivalsTonnes: 430 },
  // Potato
  { cropId: 'potato', mandiId: 'hubballi', modal: 1280, min: 950, max: 1550, prevModal: 1240, arrivalsTonnes: 165 },
  { cropId: 'potato', mandiId: 'davanagere', modal: 1210, min: 900, max: 1480, prevModal: 1270, arrivalsTonnes: 132 },
  { cropId: 'potato', mandiId: 'belagavi', modal: 1340, min: 1050, max: 1600, prevModal: 1290, arrivalsTonnes: 148 },
  { cropId: 'potato', mandiId: 'yeshwanthpur', modal: 1470, min: 1150, max: 1750, prevModal: 1430, arrivalsTonnes: 296 },
  { cropId: 'potato', mandiId: 'solapur', modal: 1390, min: 1100, max: 1650, prevModal: 1360, arrivalsTonnes: 84 },
  { cropId: 'potato', mandiId: 'pune', modal: 1520, min: 1200, max: 1800, prevModal: 1550, arrivalsTonnes: 240 },
  // Green Chilli
  { cropId: 'green-chilli', mandiId: 'hubballi', modal: 4250, min: 3400, max: 5100, prevModal: 3980, arrivalsTonnes: 38 },
  { cropId: 'green-chilli', mandiId: 'davanagere', modal: 4480, min: 3600, max: 5400, prevModal: 4520, arrivalsTonnes: 26 },
  { cropId: 'green-chilli', mandiId: 'kolar', modal: 5120, min: 4200, max: 6100, prevModal: 4740, arrivalsTonnes: 64 },
  { cropId: 'green-chilli', mandiId: 'yeshwanthpur', modal: 4890, min: 3900, max: 5800, prevModal: 4950, arrivalsTonnes: 52 },
  { cropId: 'green-chilli', mandiId: 'belagavi', modal: 4110, min: 3300, max: 4900, prevModal: 4060, arrivalsTonnes: 31 },
  { cropId: 'green-chilli', mandiId: 'pune', modal: 5340, min: 4400, max: 6300, prevModal: 5180, arrivalsTonnes: 45 },
  // Wheat
  { cropId: 'wheat', mandiId: 'hubballi', modal: 2440, min: 2280, max: 2620, prevModal: 2410, arrivalsTonnes: 210 },
  { cropId: 'wheat', mandiId: 'davanagere', modal: 2385, min: 2240, max: 2540, prevModal: 2400, arrivalsTonnes: 175 },
  { cropId: 'wheat', mandiId: 'belagavi', modal: 2470, min: 2300, max: 2650, prevModal: 2450, arrivalsTonnes: 190 },
  { cropId: 'wheat', mandiId: 'solapur', modal: 2560, min: 2380, max: 2740, prevModal: 2490, arrivalsTonnes: 265 },
  { cropId: 'wheat', mandiId: 'pune', modal: 2610, min: 2420, max: 2800, prevModal: 2580, arrivalsTonnes: 320 },
  // Soybean
  { cropId: 'soybean', mandiId: 'hubballi', modal: 4620, min: 4200, max: 4950, prevModal: 4540, arrivalsTonnes: 96 },
  { cropId: 'soybean', mandiId: 'davanagere', modal: 4480, min: 4100, max: 4800, prevModal: 4560, arrivalsTonnes: 78 },
  { cropId: 'soybean', mandiId: 'belagavi', modal: 4710, min: 4300, max: 5050, prevModal: 4620, arrivalsTonnes: 112 },
  { cropId: 'soybean', mandiId: 'solapur', modal: 4890, min: 4450, max: 5200, prevModal: 4760, arrivalsTonnes: 184 },
  { cropId: 'soybean', mandiId: 'lasalgaon', modal: 4820, min: 4400, max: 5150, prevModal: 4870, arrivalsTonnes: 148 },
  // Maize
  { cropId: 'maize', mandiId: 'hubballi', modal: 2090, min: 1900, max: 2280, prevModal: 2040, arrivalsTonnes: 320 },
  { cropId: 'maize', mandiId: 'davanagere', modal: 2180, min: 1980, max: 2350, prevModal: 2120, arrivalsTonnes: 410 },
  { cropId: 'maize', mandiId: 'belagavi', modal: 2040, min: 1850, max: 2220, prevModal: 2080, arrivalsTonnes: 268 },
  { cropId: 'maize', mandiId: 'kolar', modal: 2210, min: 2000, max: 2400, prevModal: 2150, arrivalsTonnes: 196 },
  { cropId: 'maize', mandiId: 'solapur', modal: 2150, min: 1950, max: 2320, prevModal: 2130, arrivalsTonnes: 158 },
  // Cotton
  { cropId: 'cotton', mandiId: 'hubballi', modal: 7180, min: 6600, max: 7650, prevModal: 7040, arrivalsTonnes: 64 },
  { cropId: 'cotton', mandiId: 'davanagere', modal: 7060, min: 6500, max: 7500, prevModal: 7120, arrivalsTonnes: 52 },
  { cropId: 'cotton', mandiId: 'belagavi', modal: 7290, min: 6750, max: 7800, prevModal: 7150, arrivalsTonnes: 88 },
  { cropId: 'cotton', mandiId: 'solapur', modal: 7420, min: 6900, max: 7950, prevModal: 7280, arrivalsTonnes: 124 },
  { cropId: 'cotton', mandiId: 'lasalgaon', modal: 7340, min: 6800, max: 7850, prevModal: 7390, arrivalsTonnes: 96 }
];

export const priceUpdatedAt = '28 Aug, 11:40 AM';

export const listingImages: Record<string, string> = {
  tomato: '/ef32d800-273c-4b1d-85f3-b7a1da90e161.jpg',
  onion: '/27f6a036-5b85-43b2-86ce-42528d77f868.jpg',
  wheat: '/3a600232-f6d2-420d-8d3a-9a45f7c25ca2.jpg',
  'green-chilli': '/af9c2a0f-5ef4-4de3-9609-1ce812bb955c.jpg',
  potato: '/ba78f0b1-65bd-41e7-afd8-0268efe7dcbf.jpg'
};

export const currentFarmer: Farmer = {
  name: 'Ramesh Patil',
  village: 'Annigeri',
  district: 'Dharwad',
  state: 'Karnataka',
  distanceKm: 0,
  rating: 4.8,
  deals: 34,
  verified: true,
  phone: '+91 98861 40217'
};

export const seedListings: Listing[] = [
  {
    id: 'L-1041',
    cropId: 'tomato',
    farmer: currentFarmer,
    quantityQuintal: 62,
    pricePerQuintal: 2420,
    grade: 'A',
    organic: false,
    harvestedOn: '27 Aug 2026',
    image: listingImages.tomato,
    description: 'Hybrid Abhinav tomatoes, hand-graded and packed in 25 kg crates. Loading available from the farm gate up to 6 PM.',
    status: 'available'
  },
  {
    id: 'L-1038',
    cropId: 'onion',
    farmer: currentFarmer,
    quantityQuintal: 140,
    pricePerQuintal: 1890,
    grade: 'B',
    organic: false,
    harvestedOn: '21 Aug 2026',
    image: listingImages.onion,
    description: 'Bellary red onion, 45–60 mm, cured 10 days in shade. Stored in a ventilated shed, low sprouting.',
    status: 'reserved'
  },
  {
    id: 'L-1022',
    cropId: 'wheat',
    farmer: currentFarmer,
    quantityQuintal: 210,
    pricePerQuintal: 2510,
    grade: 'A',
    organic: true,
    harvestedOn: '02 Aug 2026',
    image: listingImages.wheat,
    description: 'Sharbati wheat from a certified organic plot. Moisture 10.4%, cleaned and bagged in 50 kg sacks.',
    status: 'sold'
  },
  {
    id: 'L-2087',
    cropId: 'green-chilli',
    farmer: {
      name: 'Lakshmi Gowda',
      village: 'Chintamani',
      district: 'Chikkaballapur',
      state: 'Karnataka',
      distanceKm: 118,
      rating: 4.9,
      deals: 51,
      verified: true,
      phone: '+91 90084 22190'
    },
    quantityQuintal: 28,
    pricePerQuintal: 4780,
    grade: 'A',
    organic: false,
    harvestedOn: '27 Aug 2026',
    image: listingImages['green-chilli'],
    description: 'Byadagi-belt green chilli, picked this morning. Uniform length, firm, packed in 20 kg mesh bags.',
    status: 'available'
  },
  {
    id: 'L-2064',
    cropId: 'potato',
    farmer: {
      name: 'Sandeep Kulkarni',
      village: 'Kittur',
      district: 'Belagavi',
      state: 'Karnataka',
      distanceKm: 82,
      rating: 4.5,
      deals: 19,
      verified: true,
      phone: '+91 94491 78320'
    },
    quantityQuintal: 175,
    pricePerQuintal: 1310,
    grade: 'B',
    organic: false,
    harvestedOn: '24 Aug 2026',
    image: listingImages.potato,
    description: 'Kufri Jyoti potato, 40–70 g size mix. Field-dried two days, suitable for table and chips grade.',
    status: 'available'
  },
  {
    id: 'L-2051',
    cropId: 'onion',
    farmer: {
      name: 'Anita Deshmukh',
      village: 'Niphad',
      district: 'Nashik',
      state: 'Maharashtra',
      distanceKm: 305,
      rating: 4.7,
      deals: 63,
      verified: true,
      phone: '+91 98230 11458'
    },
    quantityQuintal: 320,
    pricePerQuintal: 2150,
    grade: 'A',
    organic: false,
    harvestedOn: '19 Aug 2026',
    image: listingImages.onion,
    description: 'Lasalgaon-grade red onion, export size. Weighbridge slip and grading report shared on request.',
    status: 'available'
  }
];

export const seedOffers: Offer[] = [
  {
    id: 'O-501',
    listingId: 'L-1041',
    buyerName: 'Nikhil Shetty',
    company: 'FreshCart Retail',
    pricePerQuintal: 2380,
    quantityQuintal: 40,
    message: 'Can lift 40 quintal tomorrow morning with our own vehicle. Payment on loading.',
    placedAgo: '2 hours ago',
    status: 'pending'
  },
  {
    id: 'O-502',
    listingId: 'L-1041',
    buyerName: 'Farida Khan',
    company: 'Anand Foods (pulp unit)',
    pricePerQuintal: 2450,
    quantityQuintal: 62,
    message: 'Full lot, grade A only. Weighment at our unit gate, payment same day by NEFT.',
    placedAgo: '5 hours ago',
    status: 'pending'
  },
  {
    id: 'O-503',
    listingId: 'L-1038',
    buyerName: 'Suresh Bhat',
    company: 'Sahyadri Traders',
    pricePerQuintal: 1840,
    quantityQuintal: 100,
    message: 'Advance of ₹50,000 ready. Need cured stock only, will inspect before loading.',
    placedAgo: '1 day ago',
    status: 'accepted'
  }
];

export const seedOrders: Order[] = [
  {
    id: 'P-3092',
    listingId: 'L-2051',
    cropId: 'onion',
    farmerName: 'Anita Deshmukh',
    quantityQuintal: 120,
    pricePerQuintal: 2150,
    placedAgo: '3 days ago',
    status: 'in-transit'
  },
  {
    id: 'P-3081',
    listingId: 'L-2064',
    cropId: 'potato',
    farmerName: 'Sandeep Kulkarni',
    quantityQuintal: 60,
    pricePerQuintal: 1310,
    placedAgo: '9 days ago',
    status: 'delivered'
  }
];

export const activeBuyersByCrop: Record<string, number> = {
  tomato: 26,
  onion: 41,
  potato: 19,
  'green-chilli': 14,
  wheat: 33,
  soybean: 22,
  maize: 17,
  cotton: 11
};

// ==========================================
// 3. UTILITIES & MARKET CALCS
// ==========================================

export function inr(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export function pct(value: number): string {
  return `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toFixed(1)}%`;
}

export function changePct(current: number, previous: number): number {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

export function transportCost(distanceKm: number): number {
  return Math.round(40 + distanceKm * 2.4);
}

export function netRealisation(modal: number, distanceKm: number): number {
  return modal - transportCost(distanceKm);
}

export function buildHistory(modal: number, prevModal: number, seed: number): number[] {
  let s = (seed % 2333) + 7;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const series: number[] = [];
  for (let i = 5; i >= 1; i--) {
    const drift = (rand() - 0.5) * 0.07;
    series.push(Math.round(prevModal * (1 - (0.025 * i) / 5 + drift)));
  }
  series.push(prevModal, modal);
  return series;
}

export function getCrop(cropId: string): Crop {
  return crops.find((c) => c.id === cropId) ?? crops[0];
}

export function getMandi(mandiId: string): Mandi {
  return mandis.find((m) => m.id === mandiId) ?? mandis[0];
}

export function quotesForCrop(cropId: string): MandiQuote[] {
  return priceRecords
    .filter((record) => record.cropId === cropId)
    .map((record) => {
      const mandi = getMandi(record.mandiId);
      return { ...record, mandi, net: netRealisation(record.modal, mandi.distanceKm) };
    });
}

export function topModalForCrop(cropId: string): number {
  const quotes = quotesForCrop(cropId);
  if (!quotes.length) return 0;
  return Math.max(...quotes.map((q) => q.modal));
}

export function nearestQuoteForCrop(cropId: string): MandiQuote | undefined {
  return [...quotesForCrop(cropId)].sort((a, b) => a.mandi.distanceKm - b.mandi.distanceKm)[0];
}

export function bestQuoteForCrop(cropId: string, byNet: boolean): MandiQuote | undefined {
  const open = quotesForCrop(cropId).filter((q) => q.mandi.openToday);
  if (!open.length) return undefined;
  return [...open].sort((a, b) => (byNet ? b.net - a.net : b.modal - a.modal))[0];
}

// ==========================================
// 4. MARKET CONTEXT & STATE
// ==========================================

interface MarketContextValue {
  role: Role;
  listings: Listing[];
  offers: Offer[];
  orders: Order[];
  myListings: Listing[];
  addListing: (input: NewListingInput) => Listing;
  withdrawListing: (listingId: string) => void;
  respondToOffer: (offerId: string, next: 'accepted' | 'declined') => void;
  placeOrder: (listing: Listing, quantityQuintal: number) => Order;
  sendOffer: (listing: Listing, pricePerQuintal: number, quantityQuintal: number, message: string) => void;
}

const MarketContext = createContext<MarketContextValue | null>(null);

export function MarketProvider({ role, children }: { role: Role; children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(seedListings);
  const [offers, setOffers] = useState<Offer[]>(seedOffers);
  const [orders, setOrders] = useState<Order[]>(seedOrders);

  const addListing = useCallback((input: NewListingInput) => {
    const listing: Listing = {
      id: `L-${Math.floor(3000 + Math.random() * 900)}`,
      cropId: input.cropId,
      farmer: currentFarmer,
      quantityQuintal: input.quantityQuintal,
      pricePerQuintal: input.pricePerQuintal,
      grade: input.grade,
      organic: input.organic,
      harvestedOn: '28 Aug 2026',
      image: listingImages[input.cropId] ?? listingImages.tomato,
      description: input.description || 'Freshly harvested lot, available for pickup from the farm gate.',
      status: 'available'
    };
    setListings((prev) => [listing, ...prev]);
    return listing;
  }, []);

  const withdrawListing = useCallback((listingId: string) => {
    setListings((prev) => prev.filter((l) => l.id !== listingId));
    setOffers((prev) => prev.filter((o) => o.listingId !== listingId));
  }, []);

  const respondToOffer = useCallback((offerId: string, next: 'accepted' | 'declined') => {
    setOffers((prev) => {
      const target = prev.find((o) => o.id === offerId);
      if (target && next === 'accepted') {
        setListings((current) =>
          current.map((listing) =>
            listing.id === target.listingId ? { ...listing, status: 'reserved' } : listing
          )
        );
      }
      return prev.map((o) => (o.id === offerId ? { ...o, status: next } : o));
    });
  }, []);

  const placeOrder = useCallback((listing: Listing, quantityQuintal: number) => {
    const order: Order = {
      id: `P-${Math.floor(3100 + Math.random() * 800)}`,
      listingId: listing.id,
      cropId: listing.cropId,
      farmerName: listing.farmer.name,
      quantityQuintal,
      pricePerQuintal: listing.pricePerQuintal,
      placedAgo: 'just now',
      status: 'placed'
    };
    setOrders((prev) => [order, ...prev]);
    setListings((prev) =>
      prev.map((l) =>
        l.id === listing.id
          ? { ...l, status: quantityQuintal >= l.quantityQuintal ? 'sold' : 'reserved' }
          : l
      )
    );
    return order;
  }, []);

  const sendOffer = useCallback(
    (listing: Listing, pricePerQuintal: number, quantityQuintal: number, message: string) => {
      setOffers((prev) => [
        {
          id: `O-${Math.floor(600 + Math.random() * 300)}`,
          listingId: listing.id,
          buyerName: 'You',
          company: 'Greenline Sourcing',
          pricePerQuintal,
          quantityQuintal,
          message,
          placedAgo: 'just now',
          status: 'pending'
        },
        ...prev
      ]);
    },
    []
  );

  const value = useMemo<MarketContextValue>(
    () => ({
      role,
      listings,
      offers,
      orders,
      myListings: listings.filter((l) => l.farmer.name === currentFarmer.name),
      addListing,
      withdrawListing,
      respondToOffer,
      placeOrder,
      sendOffer
    }),
    [role, listings, offers, orders, addListing, withdrawListing, respondToOffer, placeOrder, sendOffer]
  );

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

export function useMarket(): MarketContextValue {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error('useMarket must be used inside MarketProvider');
  return ctx;
}

// ==========================================
// 5. UI COMPONENTS
// ==========================================

export function Delta({ value, size = 'sm' }: { value: number; size?: 'sm' | 'lg' }) {
  const flat = Math.abs(value) < 0.05;
  const rising = value > 0;
  const Icon = flat ? MinusIcon : rising ? ArrowUpRightIcon : ArrowDownRightIcon;
  const tone = flat ? 'text-ink-muted' : rising ? 'text-rise' : 'text-fall';
  const box = size === 'lg' ? 'text-sm px-2 py-1' : 'text-xs px-1.5 py-0.5';

  return (
    <span
      className={`tnum inline-flex items-center gap-1 rounded-md bg-canvas font-semibold ${tone} ${box}`}
      title="Change against yesterday's modal price"
    >
      <Icon className={size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'} aria-hidden="true" />
      {pct(value)}
    </span>
  );
}

export function Sparkline({
  values,
  rising,
  width = 92,
  height = 26,
  label
}: {
  values: number[];
  rising: boolean;
  width?: number;
  height?: number;
  label: string;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);
  const points = values
    .map((value, index) => {
      const x = index * step;
      const y = height - 2 - ((value - min) / span) * (height - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const stroke = rising ? '#1F7345' : '#B3261E';
  const last = points.split(' ').slice(-1)[0].split(',');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={stroke} />
    </svg>
  );
}

const statusTones: Record<string, string> = {
  available: 'bg-leaf-50 text-leaf-700 border-leaf-200',
  reserved: 'bg-clay-50 text-clay-700 border-clay-100',
  sold: 'bg-canvas text-ink-muted border-line-strong',
  placed: 'bg-clay-50 text-clay-700 border-clay-100',
  'in-transit': 'bg-leaf-50 text-leaf-700 border-leaf-200',
  delivered: 'bg-canvas text-ink-muted border-line-strong',
  pending: 'bg-clay-50 text-clay-700 border-clay-100',
  accepted: 'bg-leaf-50 text-leaf-700 border-leaf-200',
  declined: 'bg-canvas text-ink-muted border-line-strong'
};

const statusLabels: Record<string, string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
  placed: 'Order placed',
  'in-transit': 'In transit',
  delivered: 'Delivered',
  pending: 'Awaiting you',
  accepted: 'Accepted',
  declined: 'Declined'
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${
        statusTones[status] ?? statusTones.sold
      }`}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}

export function CropSelector({
  selectedCropId,
  onSelect
}: {
  selectedCropId: string;
  onSelect: (cropId: string) => void;
}) {
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
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 ease-swift ${
              active
                ? 'bg-leaf-700 text-white shadow-card font-semibold'
                : 'bg-surface text-ink border border-line hover:border-line-strong hover:bg-canvas'
            }`}
          >
            <span>{crop.name}</span>
            <span className={`text-xs ${active ? 'text-leaf-100' : 'text-ink-faint'}`}>
              {inr(topModalForCrop(crop.id))}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function BestMandiPanel({
  quote,
  nearest,
  cropName,
  cropNameHi,
  includeTransport,
  loadQuintal
}: {
  quote: MandiQuote;
  nearest: MandiQuote;
  cropName: string;
  cropNameHi: string;
  includeTransport: boolean;
  loadQuintal: number;
}) {
  const headline = includeTransport ? quote.net : quote.modal;
  const nearestValue = includeTransport ? nearest.net : nearest.modal;
  const gap = headline - nearestValue;
  const change = changePct(quote.modal, quote.prevModal);
  const sameYard = quote.mandi.id === nearest.mandi.id;

  return (
    <section className="flex flex-col rounded-2xl border border-leaf-200 bg-surface p-6 shadow-card lg:col-span-2">
      <p className="text-sm font-medium text-leaf-600">
        Best yard for {cropName} <span className="text-ink-faint">{cropNameHi}</span> today
      </p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h2 className="font-display text-3xl font-semibold tracking-tight">{quote.mandi.name}</h2>
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

      {!sameYard && gap > 0 ? (
        <p className="mt-5 rounded-xl bg-leaf-50 px-4 py-3 text-sm text-leaf-900">
          <span className="tnum font-semibold">{inr(gap)}/qtl more</span> than {nearest.mandi.name}, your nearest yard —
          about <span className="tnum font-semibold">{inr(gap * loadQuintal)}</span> extra on a {loadQuintal} quintal load.
        </p>
      ) : (
        <p className="mt-5 rounded-xl bg-canvas px-4 py-3 text-sm text-ink-muted">
          Your nearest yard is also paying the most today. No extra travel needed.
        </p>
      )}

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
    </section>
  );
}

export function DirectSaleCard({
  cropName,
  bestNet,
  buyerAsk,
  activeBuyers,
  role,
  onNavigate
}: {
  cropName: string;
  bestNet: number;
  buyerAsk: number | null;
  activeBuyers: number;
  role: 'farmer' | 'buyer';
  onNavigate: (tab: 'prices' | 'produce' | 'marketplace' | 'purchases') => void;
}) {
  const premium = buyerAsk ? buyerAsk - bestNet : null;

  return (
    <section className="flex flex-col rounded-2xl border border-line bg-leaf-900 p-6 text-white shadow-card">
      <p className="flex items-center gap-2 text-sm font-medium text-leaf-200">
        <HandshakeIcon className="h-4 w-4" aria-hidden="true" />
        Sell direct instead
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold leading-snug tracking-tight">
        {buyerAsk
          ? `Buyers here are settling ${cropName} at ${inr(buyerAsk)}/qtl`
          : `No direct ${cropName} deals on the board yet`}
      </h2>

      {premium !== null && (
        <p className="mt-3 text-sm text-leaf-100">
          {premium > 0 ? (
            <>
              That is <span className="tnum font-semibold text-white">{inr(premium)}/qtl above</span> the best mandi take-home, with no commission cut and no waiting in the yard.
            </>
          ) : (
            <>
              Mandi take-home is currently <span className="tnum font-semibold text-white">{inr(Math.abs(premium))}/qtl better</span> — worth comparing before committing.
            </>
          )}
        </p>
      )}

      <p className="mt-4 flex items-center gap-2 text-sm text-leaf-100">
        <UsersIcon className="h-4 w-4" aria-hidden="true" />
        <span className="tnum font-semibold text-white">{activeBuyers}</span> verified buyers sourcing this week
      </p>

      <button
        type="button"
        onClick={() => onNavigate(role === 'farmer' ? 'produce' : 'marketplace')}
        className="mt-auto inline-flex items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-leaf-900 transition-colors duration-150 ease-swift hover:bg-leaf-50"
      >
        {role === 'farmer' ? 'List your produce' : 'Browse farmer lots'}
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </section>
  );
}

export function MandiTable({
  quotes,
  includeTransport,
  onIncludeTransportChange,
  bestMandiId,
  cropName
}: {
  quotes: MandiQuote[];
  includeTransport: boolean;
  onIncludeTransportChange: (next: boolean) => void;
  bestMandiId?: string;
  cropName: string;
}) {
  type SortKey = 'net' | 'modal' | 'distance' | 'arrivals';
  const [sortKey, setSortKey] = useState<SortKey>('net');
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    return [...quotes].sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortKey === 'net') {
        valA = a.net;
        valB = b.net;
      } else if (sortKey === 'modal') {
        valA = a.modal;
        valB = b.modal;
      } else if (sortKey === 'distance') {
        valA = a.mandi.distanceKm;
        valB = b.mandi.distanceKm;
      } else if (sortKey === 'arrivals') {
        valA = a.arrivalsTonnes;
        valB = b.arrivalsTonnes;
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [quotes, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <section className="rounded-2xl border border-line bg-surface shadow-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-4">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight">{cropName} rates across yards</h3>
          <p className="text-xs text-ink-muted">All prices in ₹ per quintal (100 kg)</p>
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-ink-muted cursor-pointer">
          <input
            type="checkbox"
            checked={includeTransport}
            onChange={(e) => onIncludeTransportChange(e.target.checked)}
            className="rounded border-line text-leaf-600 focus:ring-leaf-500"
          />
          <TruckIcon className="h-4 w-4" /> Deduct transport cost
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas text-xs font-semibold text-ink-muted">
            <tr>
              <th className="px-6 py-3">Mandi / Market Yard</th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('modal')}>
                <span className="flex items-center gap-1">Modal Rate <ArrowUpDownIcon className="h-3 w-3" /></span>
              </th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('net')}>
                <span className="flex items-center gap-1">Net at Gate <ArrowUpDownIcon className="h-3 w-3" /></span>
              </th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('arrivals')}>
                <span className="flex items-center gap-1">Arrivals <ArrowUpDownIcon className="h-3 w-3" /></span>
              </th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('distance')}>
                <span className="flex items-center gap-1">Distance <ArrowUpDownIcon className="h-3 w-3" /></span>
              </th>
              <th className="px-6 py-3">Trend (7d)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sorted.map((q) => {
              const isBest = q.mandi.id === bestMandiId;
              const history = buildHistory(q.modal, q.prevModal, q.mandi.distanceKm);
              return (
                <tr key={q.mandi.id} className={isBest ? 'bg-leaf-50/50 font-medium' : 'hover:bg-canvas/50'}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-ink flex items-center gap-2">
                      {q.mandi.name}
                      {isBest && <span className="rounded bg-leaf-600 px-1.5 py-0.5 text-[10px] text-white">Top Net</span>}
                    </div>
                    <div className="text-xs text-ink-muted">{q.mandi.district}, {q.mandi.state}</div>
                  </td>
                  <td className="px-6 py-4 tnum font-semibold text-ink">
                    {inr(q.modal)}
                    <div className="text-xs text-ink-faint font-normal">{inr(q.min)} - {inr(q.max)}</div>
                  </td>
                  <td className="px-6 py-4 tnum font-bold text-leaf-700">
                    {inr(q.net)}
                    <div className="text-xs text-ink-faint font-normal">−{inr(transportCost(q.mandi.distanceKm))} freight</div>
                  </td>
                  <td className="px-6 py-4 tnum">{q.arrivalsTonnes} t</td>
                  <td className="px-6 py-4 tnum">{q.mandi.distanceKm} km</td>
                  <td className="px-6 py-4">
                    <Sparkline values={history} rising={q.modal >= q.prevModal} label={`${q.mandi.name} trend`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ListingCard({
  listing,
  onOpen
}: {
  listing: Listing;
  onOpen: (listing: Listing) => void;
}) {
  const crop = getCrop(listing.cropId);
  const reference = topModalForCrop(listing.cropId);
  const gap = listing.pricePerQuintal - reference;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="relative h-40 w-full overflow-hidden bg-canvas">
        <img src={listing.image} alt={`${crop.name} lot`} className="h-full w-full object-cover" loading="lazy" />
        <span className="absolute left-3 top-3">
          <StatusBadge status={listing.status} />
        </span>
        {listing.organic && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-leaf-700 px-2 py-0.5 text-xs font-semibold text-white">
            <LeafIcon className="h-3 w-3" aria-hidden="true" />
            Organic
          </span>
        )}
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
          {gap === 0
            ? 'level with the top mandi rate'
            : `${inr(Math.abs(gap))}/qtl ${gap < 0 ? 'below' : 'above'} top mandi`}
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
            {listing.farmer.name.split(' ').map((p) => p[0]).join('')}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="flex items-center gap-1 font-semibold text-ink">
              <span className="truncate">{listing.farmer.name}</span>
              {listing.farmer.verified && <BadgeCheckIcon className="h-3.5 w-3.5 shrink-0 text-leaf-600" />}
            </span>
            <span className="flex items-center gap-2">
              <span className="tnum inline-flex items-center gap-0.5">
                <StarIcon className="h-3 w-3 fill-clay-500 text-clay-500" />
                {listing.farmer.rating}
              </span>
              <span className="tnum inline-flex items-center gap-0.5">
                <MapPinIcon className="h-3 w-3" />
                {listing.farmer.village}
              </span>
            </span>
          </span>
        </div>

        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={() => onOpen(listing)}
            className="w-full rounded-xl bg-leaf-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 ease-swift hover:bg-leaf-600"
          >
            View lot &amp; contact
          </button>
        </div>
      </div>
    </article>
  );
}

export function NewListingForm({
  onCreate,
  onCancel
}: {
  onCreate: (input: NewListingInput) => void;
  onCancel: () => void;
}) {
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCreate({
          cropId,
          quantityQuintal: Number(quantity),
          pricePerQuintal: Number(price),
          grade,
          organic,
          description
        });
      }}
      className="rounded-2xl border border-leaf-200 bg-surface p-6 shadow-card space-y-5"
    >
      <h3 className="font-display text-xl font-semibold tracking-tight">Create produce listing</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-semibold text-ink-muted">
          Crop
          <select
            value={cropId}
            onChange={(e) => {
              setCropId(e.target.value);
              setPrice(String(topModalForCrop(e.target.value)));
            }}
            className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium"
          >
            {crops.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.nameHi})
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-semibold text-ink-muted">
          Quantity (quintals)
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-xs font-semibold text-ink-muted">
          Asking Price (₹ / quintal)
          <input
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm"
          />
          <span className="mt-1 flex items-center gap-1 text-[11px] text-leaf-700 font-normal">
            <SparklesIcon className="h-3 w-3" /> Suggested rate: {inr(suggestion)}/qtl
          </span>
        </label>

        <label className="block text-xs font-semibold text-ink-muted">
          Grade
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value as Grade)}
            className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium"
          >
            <option value="A">Grade A (Premium / Export quality)</option>
            <option value="B">Grade B (Standard market quality)</option>
            <option value="C">Grade C (Pulp / processing grade)</option>
          </select>
        </label>
      </div>

      <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
        <input
          type="checkbox"
          checked={organic}
          onChange={(e) => setOrganic(e.target.checked)}
          className="rounded border-line text-leaf-600"
        />
        Certified Organic lot
      </label>

      <label className="block text-xs font-semibold text-ink-muted">
        Description
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Variety name, packaging details, gate pickup timing..."
          className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm"
        />
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-xl bg-leaf-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-leaf-600"
        >
          Publish to Marketplace
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-canvas"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function ListingDetailPanel({
  listing,
  canTransact,
  onClose,
  onBuy,
  onOffer
}: {
  listing: Listing | null;
  canTransact: boolean;
  onClose: () => void;
  onBuy: (listing: Listing, quantityQuintal: number) => void;
  onOffer: (listing: Listing, price: number, quantity: number, message: string) => void;
}) {
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

  const crop = listing ? getCrop(listing.cropId) : null;
  const reference = listing ? topModalForCrop(listing.cropId) : 0;

  return (
    <AnimatePresence>
      {listing && crop && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            className="relative h-full w-full max-w-[520px] overflow-y-auto bg-surface shadow-panel"
            initial={{ x: 32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 32, opacity: 0 }}
            transition={{ duration: 0.24 }}
          >
            <img src={listing.image} alt={crop.name} className="h-52 w-full object-cover" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink hover:bg-canvas shadow"
            >
              <XIcon className="h-4 w-4" />
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

              <dl className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-canvas p-4 text-sm">
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
                  <dd className="tnum mt-0.5 font-semibold">{listing.quantityQuintal} quintals</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-muted">Harvested</dt>
                  <dd className="mt-0.5 font-semibold">{listing.harvestedOn}</dd>
                </div>
              </dl>

              <div className="mt-5 rounded-xl border border-line p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-clay-100 text-sm font-semibold text-clay-700">
                    {listing.farmer.name.split(' ').map((p) => p[0]).join('')}
                  </span>
                  <div>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      {listing.farmer.name}
                      {listing.farmer.verified && <BadgeCheckIcon className="h-4 w-4 text-leaf-600" />}
                    </div>
                    <div className="text-xs text-ink-muted">
                      {listing.farmer.village}, {listing.farmer.district}
                    </div>
                  </div>
                </div>
                <p className="tnum mt-3 flex items-center gap-2 border-t border-line pt-3 text-xs text-ink-muted">
                  <TruckIcon className="h-3.5 w-3.5" /> {listing.farmer.distanceKm} km away
                  <span className="ml-auto flex items-center gap-1 font-semibold text-ink">
                    <PhoneIcon className="h-3.5 w-3.5" /> {listing.farmer.phone}
                  </span>
                </p>
              </div>

              {canTransact && listing.status !== 'sold' ? (
                <div className="mt-6 space-y-4">
                  <div className="flex gap-1 rounded-xl bg-canvas p-1">
                    <button
                      type="button"
                      onClick={() => setMode('buy')}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                        mode === 'buy' ? 'bg-surface text-ink shadow-card' : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      Buy at asking rate
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('offer')}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                        mode === 'offer' ? 'bg-surface text-ink shadow-card' : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      Send an offer
                    </button>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-ink-muted">Quantity (quintal)</span>
                    <input
                      type="number"
                      min={1}
                      max={listing.quantityQuintal}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="tnum mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm"
                    />
                  </div>

                  {mode === 'offer' && (
                    <>
                      <div>
                        <span className="text-xs font-semibold text-ink-muted">Your rate (₹/qtl)</span>
                        <input
                          type="number"
                          min={1}
                          value={offerPrice}
                          onChange={(e) => setOfferPrice(Number(e.target.value))}
                          className="tnum mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-ink-muted">Message</span>
                        <textarea
                          rows={2}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Pickup date, logistics terms..."
                          className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm"
                        />
                      </div>
                    </>
                  )}

                  <p className="tnum flex items-baseline justify-between rounded-xl bg-canvas px-4 py-3 text-sm font-semibold">
                    <span>Total value</span>
                    <span className="text-lg">
                      {inr((mode === 'buy' ? listing.pricePerQuintal : offerPrice) * (quantity || 0))}
                    </span>
                  </p>

                  <button
                    type="button"
                    disabled={!quantity || quantity < 1 || quantity > listing.quantityQuintal}
                    onClick={() => {
                      if (mode === 'buy') onBuy(listing, quantity);
                      else onOffer(listing, offerPrice, quantity, message);
                    }}
                    className="w-full rounded-xl bg-leaf-700 px-4 py-3 text-sm font-semibold text-white hover:bg-leaf-600 disabled:opacity-50"
                  >
                    {mode === 'buy' ? 'Confirm purchase' : 'Send offer to farmer'}
                  </button>
                </div>
              ) : null}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// 6. MAIN APP COMPONENT
// ==========================================

export default function FarmersMandiApp() {
  const [role, setRole] = useState<Role>('farmer');
  const [activeTab, setActiveTab] = useState<'prices' | 'produce' | 'marketplace' | 'purchases'>('prices');

  return (
    <MarketProvider role={role}>
      <FarmersMandiInner
        role={role}
        activeTab={activeTab}
        onRoleChange={setRole}
        onTabChange={setActiveTab}
      />
    </MarketProvider>
  );
}

function FarmersMandiInner({
  role,
  activeTab,
  onRoleChange,
  onTabChange
}: {
  role: Role;
  activeTab: 'prices' | 'produce' | 'marketplace' | 'purchases';
  onRoleChange: (role: Role) => void;
  onTabChange: (tab: 'prices' | 'produce' | 'marketplace' | 'purchases') => void;
}) {
  const {
    listings,
    myListings,
    offers,
    orders,
    addListing,
    withdrawListing,
    respondToOffer,
    placeOrder,
    sendOffer
  } = useMarket();

  // Prices View state
  const [selectedCropId, setSelectedCropId] = useState('tomato');
  const [includeTransport, setIncludeTransport] = useState(true);

  // Marketplace state
  const [marketCropId, setMarketCropId] = useState('all');
  const [marketQuery, setMarketQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Produce view state
  const [composing, setComposing] = useState(false);

  const selectedCrop = getCrop(selectedCropId);
  const quotes = useMemo(() => quotesForCrop(selectedCropId), [selectedCropId]);
  const best = bestQuoteForCrop(selectedCropId, includeTransport);
  const nearest = nearestQuoteForCrop(selectedCropId);

  const loadQuintal = myListings.find((l) => l.cropId === selectedCropId)?.quantityQuintal ?? 50;
  const buyerAsk = useMemo(() => {
    const open = listings.filter((l) => l.cropId === selectedCropId && l.status !== 'sold');
    if (!open.length) return null;
    return Math.round(open.reduce((sum, l) => sum + l.pricePerQuintal, 0) / open.length);
  }, [listings, selectedCropId]);

  const visibleListings = useMemo(() => {
    return listings.filter((l) => {
      if (marketCropId !== 'all' && l.cropId !== marketCropId) return false;
      if (
        marketQuery &&
        !l.farmer.name.toLowerCase().includes(marketQuery.toLowerCase()) &&
        !l.farmer.village.toLowerCase().includes(marketQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [listings, marketCropId, marketQuery]);

  const links =
    role === 'farmer'
      ? [
          { id: 'prices' as const, label: 'Mandi prices' },
          { id: 'produce' as const, label: 'My produce' },
          { id: 'marketplace' as const, label: 'Buyers' }
        ]
      : [
          { id: 'marketplace' as const, label: 'Buy produce' },
          { id: 'prices' as const, label: 'Mandi prices' },
          { id: 'purchases' as const, label: 'My purchases' }
        ];

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => onTabChange('prices')}
              className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-leaf-700"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-600 text-white shadow-sm">
                <SproutIcon className="h-5 w-5" />
              </span>
              KrishiSetu
            </button>

            <nav className="flex items-center gap-1">
              {links.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onTabChange(link.id)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeTab === link.id
                      ? 'bg-leaf-50 text-leaf-700 font-semibold'
                      : 'text-ink-muted hover:text-ink hover:bg-canvas'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-line bg-canvas p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onRoleChange('farmer')}
                className={`px-2.5 py-1 rounded-md ${role === 'farmer' ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted'}`}
              >
                Farmer
              </button>
              <button
                type="button"
                onClick={() => onRoleChange('buyer')}
                className={`px-2.5 py-1 rounded-md ${role === 'buyer' ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted'}`}
              >
                Buyer
              </button>
            </div>

            <span className="hidden items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-ink-muted md:inline-flex">
              <RadioIcon className="h-3 w-3 text-leaf-500 animate-pulse" />
              Live: {priceUpdatedAt}
            </span>
          </div>
        </div>
      </header>

      {/* BODY CONTENT */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        {/* VIEW 1: MANDI PRICES */}
        {activeTab === 'prices' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">Today&apos;s Mandi Realisations</h1>
              <p className="text-sm text-ink-muted">Compare modal rates and gate-level take-home after transport</p>
            </div>

            <CropSelector selectedCropId={selectedCropId} onSelect={setSelectedCropId} />

            {best && nearest && (
              <div className="grid gap-6 lg:grid-cols-3">
                <BestMandiPanel
                  quote={best}
                  nearest={nearest}
                  cropName={selectedCrop.name}
                  cropNameHi={selectedCrop.nameHi}
                  includeTransport={includeTransport}
                  loadQuintal={loadQuintal}
                />
                <DirectSaleCard
                  cropName={selectedCrop.name}
                  bestNet={best.net}
                  buyerAsk={buyerAsk}
                  activeBuyers={activeBuyersByCrop[selectedCropId] ?? 12}
                  role={role}
                  onNavigate={onTabChange}
                />
              </div>
            )}

            <MandiTable
              quotes={quotes}
              includeTransport={includeTransport}
              onIncludeTransportChange={setIncludeTransport}
              bestMandiId={best?.mandi.id}
              cropName={selectedCrop.name}
            />
          </div>
        )}

        {/* VIEW 2: MARKETPLACE / BUY PRODUCE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight">Direct Farm Produce Market</h1>
                <p className="text-sm text-ink-muted">{visibleListings.length} active farm lots available</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-ink-faint" />
                  <input
                    type="text"
                    value={marketQuery}
                    onChange={(e) => setMarketQuery(e.target.value)}
                    placeholder="Search farmer or village..."
                    className="rounded-xl border border-line bg-surface pl-9 pr-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMarketCropId('all')}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold ${
                  marketCropId === 'all' ? 'bg-leaf-700 text-white' : 'bg-surface border border-line text-ink'
                }`}
              >
                All crops
              </button>
              {crops.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setMarketCropId(c.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold ${
                    marketCropId === c.id ? 'bg-leaf-700 text-white' : 'bg-surface border border-line text-ink'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} onOpen={setSelectedListing} />
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: MY PRODUCE (FARMER VIEW) */}
        {activeTab === 'produce' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight">My Farm Produce</h1>
                <p className="text-sm text-ink-muted">{myListings.length} lots posted by you</p>
              </div>
              <button
                type="button"
                onClick={() => setComposing(!composing)}
                className="inline-flex items-center gap-2 rounded-xl bg-leaf-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-leaf-600"
              >
                <PlusIcon className="h-4 w-4" /> Post New Lot
              </button>
            </div>

            {composing && (
              <NewListingForm
                onCreate={(input) => {
                  const created = addListing(input);
                  setComposing(false);
                  toast.success(`Published ${getCrop(created.cropId).name} lot for ${inr(created.pricePerQuintal)}/qtl`);
                }}
                onCancel={() => setComposing(false)}
              />
            )}

            <div className="space-y-4">
              {myListings.map((l) => (
                <div key={l.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card">
                  <div className="flex items-center gap-4">
                    <img src={l.image} alt={l.cropId} className="h-14 w-14 rounded-xl object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-ink">{getCrop(l.cropId).name}</span>
                        <StatusBadge status={l.status} />
                        <span className="text-xs text-ink-faint">Grade {l.grade}</span>
                      </div>
                      <div className="text-xs text-ink-muted">
                        {l.quantityQuintal} quintals · Asking {inr(l.pricePerQuintal)}/qtl
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => withdrawListing(l.id)}
                      className="rounded-xl border border-line p-2 text-ink-muted hover:text-fall hover:bg-canvas"
                      title="Withdraw lot"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* INCOMING OFFERS */}
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-card space-y-4">
              <h2 className="font-display text-lg font-semibold">Incoming Buyer Offers</h2>
              <div className="divide-y divide-line">
                {offers.map((o) => (
                  <div key={o.id} className="flex flex-wrap items-center justify-between gap-4 py-3">
                    <div>
                      <div className="font-semibold text-sm text-ink">{o.buyerName} ({o.company})</div>
                      <div className="text-xs text-ink-muted">
                        Offered {inr(o.pricePerQuintal)}/qtl for {o.quantityQuintal} qtl · &ldquo;{o.message}&rdquo;
                      </div>
                    </div>
                    {o.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            respondToOffer(o.id, 'accepted');
                            toast.success('Offer accepted!');
                          }}
                          className="rounded-lg bg-leaf-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-leaf-600"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            respondToOffer(o.id, 'declined');
                            toast.info('Offer declined.');
                          }}
                          className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-canvas"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <StatusBadge status={o.status} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: PURCHASES (BUYER VIEW) */}
        {activeTab === 'purchases' && (
          <div className="space-y-6">
            <h1 className="font-display text-2xl font-semibold tracking-tight">My Purchases &amp; Orders</h1>
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-card divide-y divide-line">
              {orders.map((ord) => (
                <div key={ord.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div>
                    <div className="font-semibold text-ink">{getCrop(ord.cropId).name} from {ord.farmerName}</div>
                    <div className="text-xs text-ink-muted">
                      {ord.quantityQuintal} quintals @ {inr(ord.pricePerQuintal)}/qtl · Total: {inr(ord.quantityQuintal * ord.pricePerQuintal)}
                    </div>
                  </div>
                  <StatusBadge status={ord.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* DETAIL MODAL */}
      <ListingDetailPanel
        listing={selectedListing}
        canTransact={role === 'buyer'}
        onClose={() => setSelectedListing(null)}
        onBuy={(l, q) => {
          placeOrder(l, q);
          setSelectedListing(null);
          toast.success(`Purchased ${q} quintals of ${getCrop(l.cropId).name}!`);
        }}
        onOffer={(l, p, q, m) => {
          sendOffer(l, p, q, m);
          setSelectedListing(null);
          toast.success('Offer sent to farmer!');
        }}
      />

      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
