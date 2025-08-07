import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request }) => {
  try {
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    // Fetch user email from Supabase
    let query = supabase.from('offer_properties').select('*').eq('user_id',user_id).order('updated_at',{ascending:false});
    const { data, error } = await query;

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



export const POST: RequestHandler = async ({ request }) => {
  try {
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    const offerProperty = await request.json();

    const { data, error } = await supabase
    .from('offer_properties')
    .insert({
      ...offerProperty, user_id
    }).select('*').single();

    if (error) {
      return json(
        { error: "Failed to add user offer_propertie from Supabase" },
        { status: 500 }
      );
    }
    return json({ offer_property: data });
  } catch (error) {
    console.error("offer_properties Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};