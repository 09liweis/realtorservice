export interface SocialMediaAccount {
  id?: string;
  user_id?: string;
  platform: string;
  accountName: string;
  accountUrl: string;
  created_at?: Date;
  updated_at?: Date;
}

export enum SocialMediaPlatform {
  FACEBOOK = 'Facebook',
  TWITTER = 'Twitter',
  INSTAGRAM = 'Instagram',
  LINKEDIN = 'LinkedIn',
  YOUTUBE = 'YouTube',
  TIKTOK = 'TikTok',
  PINTEREST = 'Pinterest',
  OTHER = 'Other'
}