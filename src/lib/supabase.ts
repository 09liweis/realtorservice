import { createClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public"
import type { Listing, ListingSearch } from './types/listing';
import type { Offer, OfferProperty } from './types/offer';
import type { Staging } from './types/staging';

// 从环境变量中获取Supabase URL和匿名密钥
const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY;

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


export const getOpenHouses = async ({user_id}) => {
  return await supabase
    .from('openhouses')
    .select(`
      id,
      user_id,
      address,
      date
    `)
    .eq('user_id',user_id);
}

export const getOpenHouse = async ({property_id}) => {
  return await supabase
    .from('openhouses')
    .select(`
      id,
      user_id,
      address,
      date
    `)
    .eq('id',property_id)
    .single()
    ;
}

export const upsertOpenHouse = async (oh) => {
  if (oh.id) {
    return await supabase
      .from('openhouses')
      .update({
        updated_at: new Date(),
        ...oh
      })
      .eq('id',oh.id);
  } else {
    return await supabase
      .from('openhouses')
      .insert(oh);
  }
}

export const deleteOpenhouse = async (id:string) => {
  return await supabase
    .from('openhouses')
    .delete()
    .eq('id',id);
}

export const getOpenHouseGuests = async ({user_id, property_id}) => {
  return await supabase
    .from('openhouse_guests')
    .select(`
      *
    `)
    .eq('user_id',user_id)
    .eq('property_id',property_id)
    ;
}

export const upsertOpenHouseGuest = async (guest) => {
  if (guest.id) {
    return await supabase
      .from('openhouse_guests')
      .update({
        updated_at: new Date(),
        ...guest
      })
      .eq('id',guest.id);
  } else {
    return await supabase
      .from('openhouse_guests')
      .insert(guest);
  }
}

export const deleteOpenHouseGuest = async (id:string) => {
  return await supabase
    .from('openhouse_guests')
    .delete()
    .eq('id',id);
}



export const getOfferProperties = async ({user_id}) => {
  return await supabase
    .from('offer_properties')
    .select(`
      id,
      user_id,
      address,
      date,
      asking_price
    `)
    .eq('user_id',user_id);
}

export const getOfferProperty = async ({propertyId}) => {
  return await supabase
    .from('offer_properties')
    .select(
      `*`
    )
    .eq("id", propertyId)
    .single()
    ;
}

export const upsertOfferProperty = async (op:OfferProperty) => {
  if (op.id) {
    return await supabase
      .from('offer_properties')
      .update({
        updated_at: new Date(),
        ...op
      })
      .eq('id',op.id);
  } else {
    return await supabase
      .from('offer_properties')
      .insert(op);
  }
}

export const deleteOfferProperty = async (id:string) => {
  return await supabase
    .from('offer_properties')
    .delete()
    .eq('id',id);
}

export const getOffers = async ({user_id, property_id}) => {
  return await supabase
    .from('offers')
    .select(`
      *
    `)
    .eq('user_id',user_id)
    .eq('property_id',property_id)
    ;
}

export const upsertOffer = async (offer:Offer) => {
  if (offer.id) {
    return await supabase
      .from('offers')
      .update({
        updated_at: new Date(),
        ...offer
      })
      .eq('id',offer.id);
  } else {
    return await supabase
      .from('offers')
      .insert(offer);
  }
}

export const deleteOffer = async (id:string) => {
  return await supabase
    .from('offers')
    .delete()
    .eq('id',id);
}

// Listings CRUD operations
export const getListings = async ({user_id}:ListingSearch) => {
  return await supabase
    .from('listings')
    .select(`
      *
    `)
    .eq('user_id',user_id);
}

export const getListing = async ({property_id}:ListingSearch) => {
  return await supabase
    .from('listings')
    .select(`
      *
    `)
    .eq('id',property_id)
    .single();
}

export const upsertListing = async (listing:Listing) => {
  if (listing.id) {
    return await supabase
      .from('listings')
      .update({
        updated_at: new Date(),
        ...listing
      })
      .eq('id',listing.id);
  } else {
    return await supabase
      .from('listings')
      .insert(listing);
  }
}

export const deleteListing = async (id:string) => {
  return await supabase
    .from('listings')
    .delete()
    .eq('id',id);
}



// Listings CRUD operations
export const getStagings = async ({user_id}:ListingSearch) => {
  return await supabase
    .from('stagings')
    .select(`
      *
    `)
    .eq('user_id',user_id);
}

export const getStaging = async ({property_id}:ListingSearch) => {
  return await supabase
    .from('stagings')
    .select(`
      *
    `)
    .eq('id',property_id)
    .single();
}

export const upsertStaging = async (staging:Staging) => {
  if (staging.id) {
    return await supabase
      .from('stagings')
      .update({
        updated_at: new Date(),
        ...staging
      })
      .eq('id',staging.id);
  } else {
    return await supabase
      .from('stagings')
      .insert(staging);
  }
}

export const deleteStaging = async (id:string) => {
  return await supabase
    .from('stagings')
    .delete()
    .eq('id',id);
}

// User Profiles operations
export const getUserProfiles = async () => {
  return await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });
}

export const updateUserProfile = async (id: string, updates: any) => {
  return await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', id);
}