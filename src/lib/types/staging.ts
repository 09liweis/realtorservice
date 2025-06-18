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
}