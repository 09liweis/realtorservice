import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request,params }) => {
  try {
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    const propertyId = params.propertyId
    if (!propertyId) {
      return json({stats: 404, error: 'Openhouse not found'});
    }

    // Fetch user email from Supabase
    let query = supabase.from('offers').select('*').eq('property_id',propertyId).eq('user_id',user_id).order('updated_at',{ascending:false});
    const { data, error } = await query;

    if (error) {
      return json(
        { error: "Failed to fetch user offers from Supabase" },
        { status: 500 }
      );
    }
    return json({ offers: data });
  } catch (error) {
    console.error("offers Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};



export const POST: RequestHandler = async ({ request, params }) => {
  try {
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    const propertyId = params.propertyId
    if (!propertyId) {
      return json({stats: 404, error: 'offer property not found'});
    }

    const {data:foundProperty, error: foundError} = await supabase.from('offer_properties').select('*').eq('user_id',user_id).eq('id',propertyId).single();
    if (foundError) {
      return json({error: foundError},{status: 500});
    }

    if (!foundProperty) {
      return json({error: `Offer property ${propertyId} not found`}, {status: 404});
    }

    const propertyOffer = await request.json();

    const { data:addedOffer, error:addOfferError } = await supabase
    .from('offers')
    .insert({
      ...propertyOffer, user_id, property_id: propertyId
    }).select('*').single();

    if (addOfferError) {
      return json(
        { error: "Failed to fetch user offers from Supabase" },
        { status: 500 }
      );
    }
    return json({ property_offer: addedOffer });
  } catch (error) {
    console.error("offers Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};