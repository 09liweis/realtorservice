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
    let query = supabase.from('openhouse_guests').select('*').eq('user_id',user_id).order('updated_at',{ascending:false});
    const { data, error } = await query;

    if (error) {
      return json(
        { error: "Failed to fetch user openhouse_guests from Supabase" },
        { status: 500 }
      );
    }
    return json({ openhouse_guests: data });
  } catch (error) {
    console.error("openhouse_guests Error: ", error);
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

    const openhouseId = params.openhouseId
    if (!openhouseId) {
      return json({stats: 404, error: 'Openhouse not found'});
    }

    const {name, phone, buy_lease, has_agent, email} = await request.json();

    const { data, error } = await supabase
    .from('openhouse_guests')
    .insert({
      name, phone, buy_lease, has_agent, email, user_id, property_id: openhouseId
    });

    if (error) {
      return json(
        { error: "Failed to fetch user openhouse_guests from Supabase" },
        { status: 500 }
      );
    }
    return json({ openhouse_guest: data });
  } catch (error) {
    console.error("openhouse_guests Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};