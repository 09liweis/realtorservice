import type { Service } from '../../types/service.types';
import { EMPTY_SERVICE } from '../../types/service.types';

export interface SocialMediaService extends Service {
  end_date: string;
  platforms: string[]; // Array of social media platforms
  subscription_type: 'Monthly' | 'Semi-Annual' | 'Annual';
  posting_frequency: 'Weekly' | 'Bi-Weekly' | 'Monthly';
  addons: string[]; // Array of addon service types
}

export const SOCIAL_MEDIA_PLATFORMS = [
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'YouTube', label: 'YouTube' },
  { value: 'WeChat', label: 'WeChat' },
  { value: 'XiaoHongShu', label: 'XiaoHongShu (RED)' },
];

export const SUBSCRIPTION_TYPES = [
  { value: 'Monthly', label: 'Monthly Plan', duration: 30 },
  { value: 'Semi-Annual', label: '6-Month Plan', duration: 180 },
  { value: 'Annual', label: 'Annual Plan', duration: 365 }
];

export const POSTING_FREQUENCIES = [
  { value: 'Weekly', label: 'Weekly (4–5 posts/month)' },
  { value: 'Bi-Weekly', label: 'Bi-weekly (2 posts/month)' },
  { value: 'Monthly', label: 'Monthly (1 post/month)' }
];

export const SOCIAL_MEDIA_ADDONS = [
  {
    value: 'video_shooting',
    label: 'Short Video Shooting On-Site',
    price: 150,
    description: 'Professional on-site video shooting (GTA only)',
    unit: 'per session'
  },
  {
    value: 'voice_over',
    label: 'Professional Voice-Over',
    price: 80,
    description: 'Professional voice-over for videos',
    unit: 'per video'
  },
  {
    value: 'bilingual_content',
    label: 'English-Chinese Bilingual Content',
    price: 50,
    description: 'Content creation in both English and Chinese',
    unit: 'per post'
  },
  {
    value: 'paid_ads',
    label: 'Paid Ads Management',
    price: 200,
    description: 'Professional social media advertising management',
    unit: 'per month'
  }
];

// Pricing structure based on posting frequency and subscription type
export const SOCIAL_MEDIA_PRICING = {
  Weekly: {
    Monthly: 480,
    'Semi-Annual': 2580, // 10% discount
    Annual: 4800 // 17% discount
  },
  'Bi-Weekly': {
    Monthly: 280,
    'Semi-Annual': 1500, // 11% discount
    Annual: 2800 // 17% discount
  },
  Monthly: {
    Monthly: 160,
    'Semi-Annual': 870, // 9% discount
    Annual: 1600 // 17% discount
  }
};

export const EMPTY_SOCIAL_MEDIA_SERVICE: SocialMediaService = {
  ...EMPTY_SERVICE,
  end_date: '',
  platforms: [],
  subscription_type: 'Monthly',
  posting_frequency: 'Weekly',
  addons: []
};

// Calculate service end date based on subscription type and start date
export function getServiceEndDate(subscriptionType: string, startDate: Date): string {
  if (!subscriptionType) return '';
  const subscription = SUBSCRIPTION_TYPES.find(type => type.value === subscriptionType);
  if (!subscription || !subscription.duration) return '';
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + subscription.duration);
  return endDate.toISOString().split('T')[0];
}

// Calculate pricing for social media service
export function calculateSocialMediaPrice(
  postingFrequency: string,
  subscriptionType: string,
  addons: string[] = [],
  customPrice?: number
): {
  basePrice: number;
  addonPrice: number;
  totalPrice: number;
  savings: number;
  monthlyEquivalent: number;
  addonInfo: any[];
  isCustomPrice: boolean;
} {
  // If custom price is provided, use it
  if (customPrice !== undefined && customPrice > 0) {
    return {
      basePrice: customPrice,
      addonPrice: 0,
      totalPrice: customPrice,
      savings: 0,
      monthlyEquivalent: customPrice,
      addonInfo: [],
      isCustomPrice: true
    };
  }

  const pricing = SOCIAL_MEDIA_PRICING[postingFrequency as keyof typeof SOCIAL_MEDIA_PRICING];
  if (!pricing) {
    return {
      basePrice: 0,
      addonPrice: 0,
      totalPrice: 0,
      savings: 0,
      monthlyEquivalent: 0,
      addonInfo: [],
      isCustomPrice: false
    };
  }

  const basePrice = pricing[subscriptionType as keyof typeof pricing] || 0;
  const monthlyPrice = pricing.Monthly;
  
  // Calculate savings
  let savings = 0;
  if (subscriptionType === 'Semi-Annual') {
    savings = (monthlyPrice * 6) - basePrice;
  } else if (subscriptionType === 'Annual') {
    savings = (monthlyPrice * 12) - basePrice;
  }

  // Calculate addon prices
  const addonInfo = addons.map(addonType => 
    SOCIAL_MEDIA_ADDONS.find(addon => addon.value === addonType)
  ).filter(Boolean);

  const addonPrice = addonInfo.reduce((total, addon) => total + (addon?.price || 0), 0);
  
  // For addons, multiply by subscription period if it's a recurring addon
  let totalAddonPrice = addonPrice;
  if (subscriptionType === 'Semi-Annual') {
    totalAddonPrice = addonPrice * 6;
  } else if (subscriptionType === 'Annual') {
    totalAddonPrice = addonPrice * 12;
  }

  const totalPrice = basePrice + totalAddonPrice;
  const monthlyEquivalent = subscriptionType === 'Monthly' ? totalPrice : totalPrice / (subscriptionType === 'Semi-Annual' ? 6 : 12);

  return {
    basePrice,
    addonPrice: totalAddonPrice,
    totalPrice,
    savings,
    monthlyEquivalent,
    addonInfo,
    isCustomPrice: false
  };
}