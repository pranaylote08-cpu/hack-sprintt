import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  buyerOrders as seedOrders,
  currentFarmer,
  incomingOffers as seedOffers,
  listingImages,
  listings as seedListings } from
'../data/listings';
import { Grade, Listing, Offer, Order } from '../types';

export type Role = 'farmer' | 'buyer';

export interface NewListingInput {
  cropId: string;
  quantityQuintal: number;
  pricePerQuintal: number;
  grade: Grade;
  organic: boolean;
  description: string;
}

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

export function MarketProvider({ role, children }: {role: Role;children: ReactNode;}) {
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
        current.map((listing) => listing.id === target.listingId ? { ...listing, status: 'reserved' } : listing)
        );
      }
      return prev.map((o) => o.id === offerId ? { ...o, status: next } : o);
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
    l.id === listing.id ?
    { ...l, status: quantityQuintal >= l.quantityQuintal ? 'sold' : 'reserved' } :
    l
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
      ...prev]
      );
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

// eslint-disable-next-line react-refresh/only-export-components
export function useMarket(): MarketContextValue {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error('useMarket must be used inside MarketProvider');
  return ctx;
}