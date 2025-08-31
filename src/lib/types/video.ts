import type { Service } from '../../types/service.types';
import { EMPTY_SERVICE } from '../../types/service.types';

export interface VideoService extends Service {
  service_type: string;
  number_of_videos: number;
  addons?: string[]; // Array of addon service types
}

export function getServiceTypeInfo(serviceType: string) {
  return VIDEO_SERVICE_TYPES.find(type => type.value === serviceType);
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

export const VIDEO_SERVICE_ADDONS = [
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
  }
];

export const EMPTY_VIDEO_SERVICE: VideoService = {
  ...EMPTY_SERVICE,
  service_type: 'social_media_short',
  number_of_videos: 1,
  addons: []
};

// Calculate total price for video service including addons
export function calculateVideoServicePrice(serviceType: string, numberOfVideos: number, addons: string[] = [], customPrice?: number): {
  basePrice: number;
  addonPrice: number;
  totalPrice: number;
  serviceInfo: any;
  addonInfo: any[];
  isCustomPrice: boolean;
} {
  const serviceInfo = VIDEO_SERVICE_TYPES.find(type => type.value === serviceType);
  
  if (!serviceInfo) {
    return { 
      basePrice: 0, 
      addonPrice: 0, 
      totalPrice: 0, 
      serviceInfo: null, 
      addonInfo: [], 
      isCustomPrice: false 
    };
  }

  // If custom price is provided, use it
  if (customPrice !== undefined && customPrice > 0) {
    return { 
      basePrice: customPrice, 
      addonPrice: 0,
      totalPrice: customPrice * numberOfVideos, 
      serviceInfo, 
      addonInfo: [],
      isCustomPrice: true 
    };
  }

  const basePrice = serviceInfo.price;
  
  // Calculate addon prices
  const addonInfo = addons.map(addonType => 
    VIDEO_SERVICE_ADDONS.find(addon => addon.value === addonType)
  ).filter(Boolean);
  
  const addonPrice = addonInfo.reduce((total, addon) => total + (addon?.price || 0), 0);
  
  const totalPrice = serviceInfo.isCustomQuote ? 0 : (basePrice + addonPrice) * numberOfVideos;

  return { 
    basePrice, 
    addonPrice, 
    totalPrice, 
    serviceInfo, 
    addonInfo, 
    isCustomPrice: false 
  };
}