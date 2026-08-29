export type Grade = 'A' | 'B' | 'C';

export type ListingStatus = 'available' | 'reserved' | 'sold';

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

/** One crop's price at one mandi, in rupees per quintal. */
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