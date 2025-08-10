import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request, url }) => {
  try {

    const isPublic = url.searchParams.get('isPublic');
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
    let query = supabase.from('listings').select('*').order('updated_at',{ascending:false});
    if (!isPublic && !isAdmin) {
      query = query.eq('user_id',user_id)
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