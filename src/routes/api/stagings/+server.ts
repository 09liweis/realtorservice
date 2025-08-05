import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request }) => {
  try {
    
    const authUser = checkAuth(request);
    const user_id = authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    // Fetch user email from Supabase
    const { data, error } = await supabase
      .from('stagings')
      .select(`
        *
      `)
      .eq('user_id',user_id)
      .order('updated_at', { ascending: false })
      ;

    if (error) {
      return json(
        { error: "Failed to fetch user email from Supabase" },
        { status: 500 }
      );
    }
    return json({ stagings: data });
  } catch (error) {
    console.error("Staging Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};