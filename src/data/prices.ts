import { PriceRecord } from '../types';

/** Today's arrivals and rates, in rupees per quintal. Reported 28 Aug, 11:40 AM. */
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
{ cropId: 'cotton', mandiId: 'lasalgaon', modal: 7340, min: 6800, max: 7850, prevModal: 7390, arrivalsTonnes: 96 }];


export const priceUpdatedAt = '28 Aug, 11:40 AM';