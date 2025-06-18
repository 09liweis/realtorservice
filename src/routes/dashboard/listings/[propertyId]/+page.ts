import { getListing } from '$lib/supabase';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const { data: listing, error } = await getListing({ property_id: params.propertyId });
  
  if (error) {
    throw error;
  }

  return {
    listing
  };
};