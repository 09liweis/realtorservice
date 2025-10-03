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
    let query = supabase.from('openhouses').select(`
      *,
      openhouse_guests (
        id
      )
    `).eq('user_id',user_id).order('updated_at',{ascending:false});
    const { data, error } = await query;

    if (error) {
      console.error("openhouses list Error: ", error);
      return json(
        { error: "Failed to fetch user openhouses from Supabase" },
        { status: 500 }
      );
    }
    return json({ openhouses: data });
  } catch (error) {
    console.error("openhouses Error: ", error);
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

    const {address, date} = await request.json();

    const { data, error } = await supabase
    .from('openhouses')
    .insert({
      address, date, user_id
    });

    if (error) {
      return json(
        { error: "Failed to fetch user openhouses from Supabase" },
        { status: 500 }
      );
    }
    return json({ openhouse: data });
  } catch (error) {
    console.error("openhouses Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};