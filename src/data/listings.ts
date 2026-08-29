import { Listing } from '../types';

export const listingImages: Record<string, string> = {
  tomato: "/ef32d800-273c-4b1d-85f3-b7a1da90e161.jpg",
  onion: "/27f6a036-5b85-43b2-86ce-42528d77f868.jpg",
  wheat: "/3a600232-f6d2-420d-8d3a-9a45f7c25ca2.jpg",
  'green-chilli': "/af9c2a0f-5ef4-4de3-9609-1ce812bb955c.jpg",
  potato: "/ba78f0b1-65bd-41e7-afd8-0268efe7dcbf.jpg"
};

/** The signed-in farmer, used for listings created in-session. */
export const currentFarmer = {
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

export const listings: Listing[] = [
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
  description:
  'Hybrid Abhinav tomatoes, hand-graded and packed in 25 kg crates. Loading available from the farm gate up to 6 PM.',
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
},
{
  id: 'L-2043',
  cropId: 'tomato',
  farmer: {
    name: 'Mahesh Reddy',
    village: 'Srinivaspur',
    district: 'Kolar',
    state: 'Karnataka',
    distanceKm: 104,
    rating: 4.2,
    deals: 12,
    verified: false,
    phone: '+91 76762 90104'
  },
  quantityQuintal: 45,
  pricePerQuintal: 2280,
  grade: 'B',
  organic: false,
  harvestedOn: '26 Aug 2026',
  image: listingImages.tomato,
  description: 'Mixed-size tomato lot suited for pulp and sauce buyers. Priced to move within 48 hours.',
  status: 'available'
},
{
  id: 'L-2039',
  cropId: 'wheat',
  farmer: {
    name: 'Devendra Jadhav',
    village: 'Mohol',
    district: 'Solapur',
    state: 'Maharashtra',
    distanceKm: 196,
    rating: 4.6,
    deals: 28,
    verified: true,
    phone: '+91 99700 63821'
  },
  quantityQuintal: 260,
  pricePerQuintal: 2580,
  grade: 'A',
  organic: false,
  harvestedOn: '11 Aug 2026',
  image: listingImages.wheat,
  description: 'Lokwan wheat, single-variety lot. Moisture 11%, screened twice, ready for immediate pickup.',
  status: 'available'
}];


export const incomingOffers = [
{
  id: 'O-501',
  listingId: 'L-1041',
  buyerName: 'Nikhil Shetty',
  company: 'FreshCart Retail',
  pricePerQuintal: 2380,
  quantityQuintal: 40,
  message: 'Can lift 40 quintal tomorrow morning with our own vehicle. Payment on loading.',
  placedAgo: '2 hours ago',
  status: 'pending' as const
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
  status: 'pending' as const
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
  status: 'accepted' as const
}];


export const buyerOrders = [
{
  id: 'P-3092',
  listingId: 'L-2051',
  cropId: 'onion',
  farmerName: 'Anita Deshmukh',
  quantityQuintal: 120,
  pricePerQuintal: 2150,
  placedAgo: '3 days ago',
  status: 'in-transit' as const
},
{
  id: 'P-3081',
  listingId: 'L-2064',
  cropId: 'potato',
  farmerName: 'Sandeep Kulkarni',
  quantityQuintal: 60,
  pricePerQuintal: 1310,
  placedAgo: '9 days ago',
  status: 'delivered' as const
}];