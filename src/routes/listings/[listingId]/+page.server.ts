import { getListing } from '$lib/supabase';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const listingId = params.listingId;
  const {data:listing,error} = await getListing({ property_id: listingId });

  if (!listing) {
    throw error(404, 'Listing not found');
  }

  return {
    listing
  };
};