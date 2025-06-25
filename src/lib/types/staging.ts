export interface Staging {
  id?: string,
  location: string,
  size: string,
  occupation_status: string,
  property_type: string,
  rooms: string,
  selling_price: number,
  timeline: string,
  length: string,
  status: string,
  created_at?: string,
  updated_at?: string
  estimate_price?: number,
  quotation_price?: number,
  user_profiles?: {
    first_name: string,
    last_name: string,
    brokerage: string
  }
}

export const EMPTY_STAGING = {
  location: '',
  size: '',
  occupation_status: 'vacant',
  property_type: 'House',
  rooms: '',
  selling_price: 0,
  timeline: '',
  length: '',
  status: 'pending',
  estimate_price: 0,
  quotation_price: 0
}

// Toronto-based staging fee calculation constants
export const STAGING_RATES: Record<string, any> = {
  // Base rate per square foot per month (CAD)
  BASE_RATE_PER_SQFT: 0.85,
  
  // Room-specific rates per month (CAD)
  ROOM_RATES: {
    living_room: 450,
    dining_room: 350,
    master_bedroom: 400,
    bedroom: 300,
    kitchen: 200, // Usually minimal staging
    bathroom: 150, // Usually minimal staging
    home_office: 250,
    basement: 300,
    other: 200
  },
  
  // Property type multipliers
  PROPERTY_TYPE_MULTIPLIERS: {
    house: 1.0,
    condo: 0.85,
    townhouse: 0.95,
    apartment: 0.8,
    commercial: 1.2,
    other: 1.0
  },
  
  // Minimum monthly fee
  MINIMUM_MONTHLY_FEE: 800,
  
  // Setup and removal fees (one-time)
  SETUP_FEE: 500,
  REMOVAL_FEE: 300,
  
  // Discounts for longer terms
  TERM_DISCOUNTS: {
    1: 0, // 1 month - no discount
    2: 0.05, // 2 months - 5% discount
    3: 0.10, // 3+ months - 10% discount
    6: 0.15, // 6+ months - 15% discount
  }
};

export function calculateStagingFee(
  size: number,
  rooms: number,
  months: number,
  propertyType: string = 'house'
): {
  monthlyFee: number;
  setupFee: number;
  removalFee: number;
  totalMonthlyFees: number;
  discount: number;
  totalCost: number;
  breakdown: string[];
} {
  const rates = STAGING_RATES;
  
  // Calculate base monthly fee using square footage
  let baseFeeBySize = size * rates.BASE_RATE_PER_SQFT;
  
  // Calculate fee based on number of rooms (assuming average room mix)
  let baseFeeByRooms = rooms * 320; // Average room rate
  
  // Use the higher of the two calculations
  let monthlyFee = Math.max(baseFeeBySize, baseFeeByRooms);
  
  // Apply property type multiplier
  const propertyMultiplier = rates.PROPERTY_TYPE_MULTIPLIERS[propertyType.toLowerCase()] || 1.0;
  monthlyFee *= propertyMultiplier;
  
  // Ensure minimum monthly fee
  monthlyFee = Math.max(monthlyFee, rates.MINIMUM_MONTHLY_FEE);
  
  // Calculate discount based on term length
  let discountRate = 0;
  if (months >= 6) discountRate = rates.TERM_DISCOUNTS[6];
  else if (months >= 3) discountRate = rates.TERM_DISCOUNTS[3];
  else if (months >= 2) discountRate = rates.TERM_DISCOUNTS[2];
  else discountRate = rates.TERM_DISCOUNTS[1];
  
  const discount = monthlyFee * months * discountRate;
  const totalMonthlyFees = (monthlyFee * months) - discount;
  
  const setupFee = rates.SETUP_FEE;
  const removalFee = rates.REMOVAL_FEE;
  const totalCost = totalMonthlyFees + setupFee + removalFee;
  
  // Create breakdown for display
  const breakdown = [
    `Monthly staging fee: $${monthlyFee.toFixed(2)} × ${months} month${months !== 1 ? 's' : ''}`,
    `Setup fee: $${setupFee.toFixed(2)}`,
    `Removal fee: $${removalFee.toFixed(2)}`,
  ];
  
  if (discount > 0) {
    breakdown.push(`Term discount (${(discountRate * 100).toFixed(0)}%): -$${discount.toFixed(2)}`);
  }
  
  return {
    monthlyFee,
    setupFee,
    removalFee,
    totalMonthlyFees,
    discount,
    totalCost,
    breakdown
  };
}