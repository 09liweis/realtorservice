export interface Listing {
  id?: string;
  listing_type: string;
  project_name: string;
  developer: string;
  address: string;
  location: string;
  ptype: string;
  bedroom: string;
  bathroom: string;
  level: string;
  size: string;
  parking: string;
  locker: string;
  basement: string;
  exposure: string;
  occupancy: string;
  asking_price: string;
  commission: string;
  description: string;
  is_sold: boolean;
  pictures: string;
  original_price: string;
  deposit_paid: string;
  [key: string]: any; // 允许其他扩展属性
}

export interface ListingSearch {
  user_id?: string;
  property_id?: string;
}