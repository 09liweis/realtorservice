import supabase from '$lib/db/client';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const listingId = params.listingId;
  const {data:listing,error} = await supabase.from('listings').select(`
    *,
    user_profiles!inner(
        first_name,
        last_name,
        brokerage,
        phone,
        email
      )
    `).eq('id', listingId).single();

  if (!listing) {
    throw error(404, 'Listing not found');
  }

  return {
    listing
  };
};