import type { Listing, ListingSearch } from './types/listing';
import type { Offer, OfferProperty } from './types/offer';
import type { Staging } from './types/staging';
import type { Cleaning } from './types/cleaning';
import type { CreditRecord } from './types/credit';
import type { Coupon } from './types/coupon';
import type { VideoService } from './types/video';
import type { SocialMediaService } from './types/social';
import supabase from './db/client';

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
  await supabase.from('openhouse_guests')
    .delete()
    .eq('property_id', id);
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

// Updated Listings CRUD operations
export const getListings = async (params?: ListingSearch) => {
  let query = supabase
    .from('listings')
    .select(`
      *,
      user_profiles!inner(
        first_name,
        last_name,
        brokerage,
        phone,
        email
      )
    `)
    .order('created_at', { ascending: false });

  // Only filter by user_id if provided
  if (params?.user_id) {
    query = query.eq('user_id', params.user_id);
  }

  return await query;
}

export const getListing = async ({property_id}:ListingSearch) => {
  return await supabase
    .from('listings')
    .select(`
      *,
      user_profiles!inner(
        first_name,
        last_name,
        brokerage,
        phone,
        email
      )
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



// Stagings CRUD operations
export const getStagings = async ({user_id}:ListingSearch) => {
  return await supabase
    .from('stagings')
    .select(`
      *
    `)
    .eq('user_id',user_id)
    .order('updated_at', { ascending: false })
    ;
}

// Get all stagings for admin (no user filter)
export const getAllStagings = async () => {
  return await supabase
    .from('stagings')
    .select(`
      *,
      user_profiles!inner(
        first_name,
        last_name,
        email,
        phone,
        brokerage
      )
    `)
    .order('updated_at', { ascending: false });
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
  delete staging.user_profiles;
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

// Cleanings CRUD operations
export const getCleanings = async ({user_id}:ListingSearch) => {
  return await supabase
    .from('cleanings')
    .select(`
      *
    `)
    .eq('user_id',user_id)
    .order('updated_at', { ascending: false })
    ;
}

// Get all cleanings for admin (no user filter)
export const getAllCleanings = async () => {
  return await supabase
    .from('cleanings')
    .select(`
      *,
      user_profiles!inner(
        first_name,
        last_name,
        email,
        phone,
        brokerage
      )
    `)
    .order('updated_at', { ascending: false });
}

export const getCleaning = async ({property_id}:ListingSearch) => {
  return await supabase
    .from('cleanings')
    .select(`
      *
    `)
    .eq('id',property_id)
    .single();
}

export const upsertCleaning = async (cleaning:Cleaning) => {
  delete cleaning.user_profiles;
  if (cleaning.id) {
    return await supabase
      .from('cleanings')
      .update({
        updated_at: new Date(),
        ...cleaning
      })
      .eq('id',cleaning.id);
  } else {
    return await supabase
      .from('cleanings')
      .insert(cleaning);
  }
}

export const deleteCleaning = async (id:string) => {
  return await supabase
    .from('cleanings')
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

export const getUserProfile = async (user_id: string) => {
  return await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user_id)
    .single();
}

export const updateUserProfile = async (user_id: string, updates: any) => {
  return await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', user_id);
}

export const getCreditRecords = async (user_id:string) => {
  return await supabase
    .from('credit_records')
    .select(`*`)
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
}

export const getPendingTopUpCreditRecord = async (creditRecord: CreditRecord) => {
  return await supabase
    .from('credit_records')
    .select('*')
    .eq('user_id',creditRecord.user_id)
    .eq('tp', 'topup')
    .eq('status', 'pending')
    .single();
}

export const upsertCreditRecord = async (creditRecord:CreditRecord) => {
  const {data,error} = await supabase.from('credit_records').select('*').eq('stripe_client_secret',creditRecord.stripe_client_secret).single();
  if (data) {
    return await supabase
      .from('credit_records')
      .update(creditRecord)
      .eq('id', data.id);
  } else {
    return await supabase
      .from('credit_records')
      .insert(creditRecord);
  }
}

export const calcUserCredits = async (user_id:string, amount:number) => {
  const {data, error} = await supabase
    .from('user_profiles')
    .select(`credits`)
    .eq('user_id', user_id)
    .single();
  const newCredit = (data?.credits || 0) + amount;
  return await supabase
    .from('user_profiles')
    .update({credits: newCredit})
    .eq('user_id', user_id);
}

// Get user's total credits
export const getUserCredits = async (user_id: string) => {
  const { data, error } = await supabase
    .from('credit_records')
    .select('amount')
    .eq('status', 'done')
    .eq('user_id', user_id);

  if (error) return { data: 0, error };

  const totalCredits = data?.reduce((sum, record) => sum + record.amount, 0) || 0;
  return { data: totalCredits, error: null };
}

// Temporary function to check if social_media_accounts table exists
export const checkSocialMediaTableExists = async () => {
  try {
    const { data, error } = await supabase
      .from('social_media_accounts')
      .select('*')
      .limit(1);
    
    if (error) {
      return { exists: false, error };
    }
    return { exists: true, error: null };
  } catch (err) {
    return { exists: false, error: err };
  }
}

// Social Media Services CRUD operations
export const getUserSocialMediaServices = async (user_id: string) => {
  return await supabase
    .from('social_media_services')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
}

export const getSocialMediaService = async (id: string) => {
  return await supabase
    .from('social_media_services')
    .select('*')
    .eq('id', id)
    .single();
}

export const upsertSocialMediaService = async (service: SocialMediaService) => {
  if (service.id) {
    return await supabase
      .from('social_media_services')
      .update({
        updated_at: new Date(),
        ...service
      })
      .eq('id', service.id);
  } else {
    return await supabase
      .from('social_media_services')
      .insert(service);
  }
}

export const deleteSocialMediaService = async (id: string) => {
  return await supabase
    .from('social_media_services')
    .delete()
    .eq('id', id);
}

// Video Services CRUD operations
export const getUserVideoServices = async (user_id: string) => {
  return await supabase
    .from('video_services')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
}

export const getVideoService = async (id: string) => {
  return await supabase
    .from('video_services')
    .select('*')
    .eq('id', id)
    .single();
}

export const upsertVideoService = async (videoService: VideoService) => {
  if (videoService.id) {
    return await supabase
      .from('video_services')
      .update({
        updated_at: new Date(),
        ...videoService
      })
      .eq('id', videoService.id);
  } else {
    return await supabase
      .from('video_services')
      .insert(videoService);
  }
}

export const deleteVideoService = async (id: string) => {
  return await supabase
    .from('video_services')
    .delete()
    .eq('id', id);
}

// Coupon CRUD operations
export const getCoupons = async () => {
  return await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });
}

export const getCoupon = async (id: string) => {
  return await supabase
    .from('coupons')
    .select('*')
    .eq('id', id)
    .single();
}

export const upsertCoupon = async (coupon: Coupon) => {
  if (coupon.id) {
    return await supabase
      .from('coupons')
      .update({
        updated_at: new Date(),
        ...coupon
      })
      .eq('id', coupon.id);
  } else {
    return await supabase
      .from('coupons')
      .insert(coupon);
  }
}

export const deleteCoupon = async (id: string) => {
  return await supabase
    .from('coupons')
    .delete()
    .eq('id', id);
}

export const toggleCouponStatus = async (id: string, active: boolean) => {
  return await supabase
    .from('coupons')
    .update({ 
      active,
      updated_at: new Date()
    })
    .eq('id', id);
}

// Get active coupons for users
export const getActiveCoupons = async () => {
  return await supabase
    .from('coupons')
    .select('*')
    .eq('active', true)
    .or('expires_at.is.null,expires_at.gte.' + new Date().toISOString())
    .order('created_at', { ascending: false });
}

export const getUserCoupons = async (user_id:string) => {
  const {data,error} = await supabase
    .from('coupon_usage')
    .select(`
      *,
      coupons (
        *
      )
    `)
    .eq('user_id', user_id);
  const coupons = data?.map(coupon => {
    return coupon.coupons
  })
  return {data: coupons, error};
}

// Get welcome coupons (for new user registration)
export const getWelcomeCoupons = async () => {
  return await supabase
    .from('coupons')
    .select('*')
    .eq('active', true)
    .or('expires_at.is.null,expires_at.gte.' + new Date().toISOString())
    .order('created_at', { ascending: false });
}

// Auto-apply welcome coupons to new user
export const autoApplyWelcomeCoupons = async (userId: string) => {
  try {
    // Get all active welcome coupons
    const { data: welcomeCoupons, error: couponsError } = await getWelcomeCoupons();
    
    if (couponsError || !welcomeCoupons || welcomeCoupons.length === 0) {
      return { data: [], error: couponsError };
    }

    const appliedCoupons = [];
    let totalCreditsAdded = 0;

    // Apply each welcome coupon
    for (const coupon of welcomeCoupons) {
      // Check if coupon has usage limit and is not exceeded
      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        continue; // Skip this coupon if usage limit exceeded
      }

      // Record coupon usage
      const { error: usageError } = await supabase
        .from('coupon_usage')
        .insert({
          coupon_id: coupon.id,
          user_id: userId,
          redeemed_at: null
        });

      if (usageError) {
        console.error('Error recording coupon usage:', coupon.id, usageError);
        continue;
      }

      // Update coupon used count
      const { error: updateCouponError } = await supabase
        .from('coupons')
        .update({
          used_count: (coupon.used_count || 0) + 1,
          updated_at: new Date()
        })
        .eq('id', coupon.id);

      if (updateCouponError) {
        console.error('Error updating coupon used count:', coupon.id, updateCouponError);
      }

      appliedCoupons.push(coupon);
      totalCreditsAdded += coupon.credits;
    }

    return { 
      data: {
        appliedCoupons,
        totalCreditsAdded
      }, 
      error: null 
    };

  } catch (error) {
    console.error('Error auto-applying welcome coupons:', error);
    return { data: [], error };
  }
}

// Validate and redeem coupon
export const redeemCoupon = async (couponCode: string, userId: string) => {
  // First, get the coupon
  const { data: coupon, error: couponError } = await supabase
    .from('coupons')
    .select('*')
    .eq('name', couponCode.toUpperCase())
    .eq('active', true)
    .single();

  if (couponError || !coupon) {
    return { data: null, error: { message: 'Invalid or inactive coupon code' } };
  }

  // Check if coupon is expired
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { data: null, error: { message: 'This coupon has expired' } };
  }

  // Check usage limit
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return { data: null, error: { message: 'This coupon has reached its usage limit' } };
  }

  // Check if user has already used this coupon
  const { data: existingUsage } = await supabase
    .from('coupon_usage')
    .select('*')
    .eq('coupon_id', coupon.id)
    .eq('user_id', userId)
    .single();

  if (existingUsage) {
    return { data: null, error: { message: 'You have already used this coupon' } };
  }

  // Record coupon usage
  const { error: usageError } = await supabase
    .from('coupon_usage')
    .insert({
      coupon_id: coupon.id,
      user_id: userId
    });

  if (usageError) {
    return { data: null, error: usageError };
  }

  // Update coupon used count
  const { error: updateCouponError } = await supabase
    .from('coupons')
    .update({
      used_count: (coupon.used_count || 0) + 1,
      updated_at: new Date()
    })
    .eq('id', coupon.id);

  if (updateCouponError) {
    return { data: null, error: updateCouponError };
  }

  return { data: { coupon, credits: coupon.credits }, error: null };
}