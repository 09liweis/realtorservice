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
      return json({stats: 404, error: 'Openhouse not found'});
    }

    const {name, phone, buy_lease, has_agent, email} = await request.json();

    const { data, error } = await supabase
    .from('offers')
    .insert({
      name, phone, buy_lease, has_agent, email, user_id, property_id: propertyId
    });

    if (error) {
      return json(
        { error: "Failed to fetch user offers from Supabase" },
        { status: 500 }
      );
    }
    return json({ openhouse_guest: data });
  } catch (error) {
    console.error("offers Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};