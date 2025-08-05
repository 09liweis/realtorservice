import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request }) => {
  try {
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    const isAdmin = authUser.isAdmin;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    // Fetch user email from Supabase
    let query = supabase.from('video_services').select('*').order('updated_at',{ascending:false});
    if (!isAdmin) {
      query = query.eq('user_id',user_id)
    }
    const { data, error } = await query;

    if (error) {
      return json(
        { error: "Failed to fetch user video services from Supabase" },
        { status: 500 }
      );
    }
    return json({ video_services: data });
  } catch (error) {
    console.error("video services Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};