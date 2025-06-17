import { getOfferProperty } from '$lib/supabase';
import { error } from '@sveltejs/kit';

export async function load({ params }: { params: { propertyId: string } }) {
  
  const {propertyId} = params;
  const {data: property, error: propertyError} = await getOfferProperty({propertyId});

  if (propertyError) {
    throw error(404, 'Property not found');
  }

  return {
    property
  };
}