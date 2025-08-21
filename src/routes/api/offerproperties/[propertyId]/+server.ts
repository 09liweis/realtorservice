import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request,params }) => {
  try {
    const propertyId = params.propertyId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!propertyId) {
      return json({stats: 404, error: 'Offer property not found'});
    }

    // Fetch user email from Supabase
    const { data, error } = await supabase
    .from('offer_properties')
    .select('*')
    .eq("user_id",user_id)
    .eq("id", propertyId)
    .single();
    

    if (error) {
      return json(
        { error: "Failed to fetch user offer_properties from Supabase" },
        { status: 500 }
      );
    }
    return json({ offer_properties: data });
  } catch (error) {
    console.error("offer_properties Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


export const PUT: RequestHandler = async ({ request,params }) => {
  try {
    const propertyId = params.propertyId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!propertyId) {
      return json({stats: 404, error: 'Openhouse not found'});
    }

    const offerProperty = await request.json();
    delete offerProperty.offers;

    // Fetch user email from Supabase
    const { data, error } = await supabase
    .from('offer_properties')
    .update(offerProperty)
    .eq('id', propertyId)
    .eq("user_id", user_id)
    

    if (error) {
      console.error('Update offer property: ', error);
      return json(
        { error: "Failed to update user offer property from Supabase" },
        { status: 500 }
      );
    }
    return json({ offer_property: data });
  } catch (error) {
    console.error("update offer propety Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


export const DELETE: RequestHandler = async ({ request,params }) => {
  try {
    const propertyId = params.propertyId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!propertyId) {
      return json({stats: 404, error: 'Offer property not found'});
    }

    // Fetch user email from Supabase
    
    const { data, error } = await supabase
    .from('offers')
    .delete()
    .eq("user_id",user_id)
    .eq("property_id", propertyId);

    await supabase.from('offer_properties').delete().eq("user_id", user_id).eq("id",propertyId);

    if (error) {
      return json(
        { error: "Failed to delete user offers and property from Supabase" },
        { status: 500 }
      );
    }
    return json({ msg: 'Deleted' });
  } catch (error) {
    console.error("offers Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};