import { getVideoService } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const videoId = params.videoId;
  
  if (!videoId) {
    throw error(404, 'Video service not found');
  }

  try {
    const { data: videoService, error: fetchError } = await getVideoService(videoId);
    
    if (fetchError) {
      console.error('Error fetching video service:', fetchError);
      throw error(500, 'Failed to load video service');
    }

    if (!videoService) {
      throw error(404, 'Video service not found');
    }

    return {
      videoService
    };
  } catch (err) {
    console.error('Error in video service load function:', err);
    throw error(500, 'Failed to load video service');
  }
};