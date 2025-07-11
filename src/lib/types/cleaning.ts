import type { Service } from "../../types/service.types";
import { EMPTY_SERVICE } from "../../types/service.types";

export interface Cleaning extends Service {
  location: string;
  property_type: string;
  size: string;
  rooms: string;
  bathrooms: string;
  cleaning_type: string;
  frequency: string;
  special_requests?: string;
  scheduled_date?: string;
  user_profiles?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    brokerage: string;
  };
}

export const EMPTY_CLEANING: Cleaning = {
  ...EMPTY_SERVICE,
  location: '',
  property_type: 'house',
  size: '',
  rooms: '',
  bathrooms: '',
  cleaning_type: 'deep_cleaning',
  frequency: 'one_time',
  special_requests: '',
  scheduled_date: ''
};

export const CLEANING_TYPES = [
  { value: 'deep_cleaning', label: 'Deep Cleaning' },
  { value: 'regular_cleaning', label: 'Regular Cleaning' },
  { value: 'move_in_out', label: 'Move In/Out Cleaning' },
  { value: 'post_construction', label: 'Post Construction Cleaning' },
  { value: 'pre_listing', label: 'Pre-Listing Cleaning' }
];

export const CLEANING_FREQUENCIES = [
  { value: 'one_time', label: 'One Time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi_weekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

export const CLEANING_STATUS_OPTIONS = ['draft', 'submitted', 'confirmed', 'paid', 'scheduled', 'completed'];

// Cleaning pricing calculation based on Dolphin Cleaning estimator
export const CLEANING_RATES:Record<string, any> = {
  // Base rates per room type (CAD)
  ROOM_RATES: {
    bedroom: 25,
    bathroom: 35,
    kitchen: 45,
    living_room: 30,
    dining_room: 25,
    office: 25,
    basement: 30,
    laundry_room: 20
  },
  
  // Cleaning type multipliers
  TYPE_MULTIPLIERS: {
    regular_cleaning: 1.0,
    deep_cleaning: 1.5,
    move_in_out: 1.8,
    post_construction: 2.2,
    pre_listing: 1.3
  },
  
  // Property type multipliers
  PROPERTY_MULTIPLIERS: {
    apartment: 0.8,
    condo: 0.9,
    house: 1.0,
    townhouse: 1.1,
    commercial: 1.5
  },
  
  // Frequency discounts
  FREQUENCY_DISCOUNTS: {
    one_time: 0,
    weekly: 0.15,
    bi_weekly: 0.10,
    monthly: 0.05
  },
  
  // Minimum service fee
  MINIMUM_FEE: 80,
  
  // Additional fees
  TRAVEL_FEE: 15, // if outside service area
  SUPPLY_FEE: 25  // cleaning supplies
};

export function calculateCleaningPrice(
  rooms: number,
  bathrooms: number,
  cleaningType: string = 'regular_cleaning',
  propertyType: string = 'house',
  frequency: string = 'one_time',
  size: number = 0
): {
  basePrice: number;
  typeMultiplier: number;
  propertyMultiplier: number;
  frequencyDiscount: number;
  supplyFee: number;
  totalPrice: number;
  breakdown: string[];
} {
  const rates = CLEANING_RATES;
  
  // Calculate base price from rooms
  let basePrice = 0;
  
  // Estimate room breakdown if not provided
  if (rooms > 0) {
    // Assume typical room distribution
    const bedrooms = Math.max(1, Math.floor(rooms * 0.4)); // 40% bedrooms
    const livingAreas = Math.max(1, Math.floor(rooms * 0.3)); // 30% living areas
    const otherRooms = rooms - bedrooms - livingAreas;
    
    basePrice += bedrooms * rates.ROOM_RATES.bedroom;
    basePrice += livingAreas * rates.ROOM_RATES.living_room;
    basePrice += otherRooms * rates.ROOM_RATES.office; // Use office rate for other rooms
  }
  
  // Add bathrooms
  basePrice += bathrooms * rates.ROOM_RATES.bathroom;
  
  // Add kitchen (assume 1 kitchen)
  basePrice += rates.ROOM_RATES.kitchen;
  
  // Size-based adjustment (if size is very large)
  if (size > 3000) {
    basePrice *= 1.2; // 20% increase for large properties
  } else if (size > 2000) {
    basePrice *= 1.1; // 10% increase for medium-large properties
  }
  
  // Apply cleaning type multiplier
  const typeMultiplier = rates.TYPE_MULTIPLIERS[cleaningType] || 1.0;
  const typeAdjustedPrice = basePrice * typeMultiplier;
  
  // Apply property type multiplier
  const propertyMultiplier = rates.PROPERTY_MULTIPLIERS[propertyType.toLowerCase()] || 1.0;
  const propertyAdjustedPrice = typeAdjustedPrice * propertyMultiplier;
  
  // Apply frequency discount
  const frequencyDiscount = rates.FREQUENCY_DISCOUNTS[frequency] || 0;
  const discountAmount = propertyAdjustedPrice * frequencyDiscount;
  
  // Add supply fee
  const supplyFee = rates.SUPPLY_FEE;
  
  // Calculate total
  let totalPrice = propertyAdjustedPrice - discountAmount + supplyFee;
  
  // Ensure minimum fee
  totalPrice = Math.max(totalPrice, rates.MINIMUM_FEE);
  
  // Create breakdown
  const breakdown = [
    `Base cleaning: $${basePrice.toFixed(2)}`,
    `${CLEANING_TYPES.find(t => t.value === cleaningType)?.label || cleaningType} (${(typeMultiplier * 100).toFixed(0)}%): $${typeAdjustedPrice.toFixed(2)}`,
    `Property type adjustment: $${propertyAdjustedPrice.toFixed(2)}`,
  ];
  
  if (frequencyDiscount > 0) {
    breakdown.push(`Frequency discount (${(frequencyDiscount * 100).toFixed(0)}%): -$${discountAmount.toFixed(2)}`);
  }
  
  breakdown.push(`Cleaning supplies: $${supplyFee.toFixed(2)}`);
  
  return {
    basePrice,
    typeMultiplier,
    propertyMultiplier,
    frequencyDiscount: discountAmount,
    supplyFee,
    totalPrice,
    breakdown
  };
}