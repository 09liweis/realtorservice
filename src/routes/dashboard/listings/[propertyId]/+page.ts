import supabase from '$lib/db/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const { data: listing, error } = await supabase.from('listings').select('*').eq("id",params.propertyId).single();
  
  if (error) {
    throw error;
  }

  return {
    listing
  };
};