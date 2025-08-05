import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request,params }) => {
  try {
    const openhouseId = params.openhouseId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!openhouseId) {
      return json({stats: 404, error: 'Openhouse not found'});
    }

    // Fetch user email from Supabase
    const { data, error } = await supabase
    .from('openhouse_guests')
    .select('*')
    .eq("user_id",user_id)
    .eq("property_id", openhouseId)
    .order('updated_at',{ascending:false});
    

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