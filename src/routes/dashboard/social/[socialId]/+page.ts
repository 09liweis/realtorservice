import { getSocialMediaService } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const socialId = params.socialId;
  
  if (!socialId) {
    throw error(404, 'Social media service not found');
  }

  try {
    const { data: socialMediaService, error: fetchError } = await getSocialMediaService(socialId);
    
    if (fetchError) {
      console.error('Error fetching social media service:', fetchError);
      throw error(500, 'Failed to load social media service');
    }

    if (!socialMediaService) {
      throw error(404, 'Social media service not found');
    }

    return {
      socialMediaService
    };
  } catch (err) {
    console.error('Error in social media service load function:', err);
    throw error(500, 'Failed to load social media service');
  }
};