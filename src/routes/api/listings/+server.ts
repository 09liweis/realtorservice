import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request, url }) => {
  try {

    const isPublic = url.searchParams.get('isPublic');
    const listing_type = url.searchParams.get('listing_type');
    const property_type = url.searchParams.get('property_type');
    const bedroom = url.searchParams.get('bedroom');
    const bathroom = url.searchParams.get('bathroom');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');

    let user_id = '';
    let isAdmin = false;

    if (!isPublic) {
      const authUser = await checkAuth(request);
      user_id = authUser?.user_id || authUser?.id;
      isAdmin = authUser.isAdmin;
      if (!user_id) {
        return json({stats: 401, error: 'Unauthorized'});
      }
    }

    // Fetch user email from Supabase
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
    .order('updated_at',{ascending:false});
    
    if (!isPublic && !isAdmin) {
      query = query.eq('user_id',user_id)
    }

    if (isPublic) {
      query = query.eq('is_sold', false);
    }

    if (listing_type) {
      query = query.eq('listing_type',decodeURIComponent(listing_type));
    }
    if (property_type) {
      query = query.eq('ptype',decodeURIComponent(property_type));
    }

    if (bedroom) {
      let value = bedroom;
      let hasPlus = false;
      if (bedroom.includes('+')) {
        hasPlus = true;
        value = bedroom.replace('+','');
      }
      const bedroomValue = parseInt(value);
      if (hasPlus) {
        query = query.gte('bedroom',bedroomValue);
      } else {
        query = query.eq('bedroom',bedroomValue);
      }
    }

    if (bathroom) {
      let value = bathroom;
      let hasPlus = false;
      if (bathroom.includes('+')) {
        hasPlus = true;
        value = bathroom.replace('+','');
      }
      const bathroomValue = parseInt(value);
      if (hasPlus) {
        query = query.gte('bathroom',bathroomValue);
      } else {
        query = query.eq('bathroom',bathroomValue);
      }
    }

    if (minPrice) {
      const minPriceValue = parseInt(minPrice);
      query = query.gte('asking_price',minPriceValue);
    }

    if (maxPrice) {
      const maxPriceValue = parseInt(maxPrice);
      query = query.lte('asking_price',maxPriceValue);
    }


    const { data, error } = await query;

    if (error) {
      return json(
        { error: "Failed to fetch user listings from Supabase" },
        { status: 500 }
      );
    }
    return json({ listings: data });
  } catch (error) {
    console.error("listings Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


export const POST: RequestHandler = async ({ request, url }) => {
  try {

    const authUser = await checkAuth(request);
    let user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    const newListing = await request.json();
    delete newListing.user_profiles;

    newListing.user_id = user_id;
    const { data, error } = await supabase.from('listings').insert(newListing).select('*').single();

    if (error) {
      return json(
        { error: "Failed to add user listings from Supabase" },
        { status: 500 }
      );
    }
    return json({ listing: data });
  } catch (error) {
    console.error("listing add Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};