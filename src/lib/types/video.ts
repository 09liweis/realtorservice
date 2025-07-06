export interface VideoService {
  id?: string;
  user_id?: string;
  service_type: string;
  number_of_videos: number;
  notes?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export const VIDEO_SERVICE_TYPES = [
  {
    value: 'social_media_short',
    label: 'Social Media Short (≤60 sec)',
    price: 120,
    turnaround: '2–3 business days',
    description: 'Perfect for Instagram, TikTok, and Facebook posts'
  },
  {
    value: 'listing_video',
    label: 'Listing Video (1–3 mins)',
    price: 180,
    turnaround: '3–4 business days',
    description: 'Professional property showcase videos'
  },
  {
    value: 'agent_branding',
    label: 'Agent Introduction / Branding Video',
    price: 250,
    turnaround: '4–5 business days',
    description: 'Personal branding and introduction videos'
  },
  {
    value: 'bilingual_subtitles',
    label: 'Bilingual Subtitles (EN+CN)',
    price: 40,
    turnaround: '+1 day',
    description: 'Add-on service for bilingual subtitles',
    isAddon: true
  },
  {
    value: 'voice_over_editing',
    label: 'Voice-over Editing',
    price: 60,
    turnaround: '+1 day',
    description: 'Professional voice-over integration',
    isAddon: true
  },
  {
    value: 'custom_long_form',
    label: 'Custom Long-Form Video (3+ min)',
    price: 300,
    turnaround: 'Based on complexity',
    description: 'Custom video projects over 3 minutes'
  },
  {
    value: 'bulk_package',
    label: 'Bulk Editing Package (5+ videos/month)',
    price: 0,
    turnaround: 'Priority turnaround',
    description: 'Custom quote for bulk video editing',
    isCustomQuote: true
  }
];

export const VIDEO_SERVICE_STATUS = [
  { value: 'pending', label: 'Pending Review', color: 'yellow' },
  { value: 'in_progress', label: 'In Progress', color: 'blue' },
  { value: 'review', label: 'Under Review', color: 'purple' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' }
];

export const EMPTY_VIDEO_SERVICE: VideoService = {
  service_type: '',
  number_of_videos: 1,
  notes: '',
  status: 'pending'
};

// Calculate total price for video service
export function calculateVideoServicePrice(serviceType: string, numberOfVideos: number): {
  basePrice: number;
  totalPrice: number;
  serviceInfo: any;
} {
  const serviceInfo = VIDEO_SERVICE_TYPES.find(type => type.value === serviceType);
  
  if (!serviceInfo) {
    return { basePrice: 0, totalPrice: 0, serviceInfo: null };
  }

  const basePrice = serviceInfo.price;
  const totalPrice = serviceInfo.isCustomQuote ? 0 : basePrice * numberOfVideos;

  return { basePrice, totalPrice, serviceInfo };
}