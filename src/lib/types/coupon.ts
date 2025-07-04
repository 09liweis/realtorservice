export interface Coupon {
  id?: string;
  name: string;
  credits: number;
  tp: string; // type: 'staging', 'listing', 'general', etc.
  active: boolean;
  description?: string;
  usage_limit?: number;
  used_count?: number;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

export function formatCredits(credits: number): string {
  return new Intl.NumberFormat('en-US').format(credits);
}

export const COUPON_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'staging', label: 'Staging Services' },
  { value: 'cleaning', label: 'Cleaning Services' },
  { value: 'listing', label: 'Listing Services' },
  { value: 'openhouse', label: 'Open House Services' },
  { value: 'social', label: 'Social Media Services' }
];

export const EMPTY_COUPON: Coupon = {
  name: '',
  credits: 0,
  tp: 'general',
  active: true,
  description: '',
  usage_limit: 0,
  expires_at: ''
};