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

    if (!isAdmin) {
      return json({stats: 401, error: 'Unauthorized not admin'});
    }

    const {data, error} = await supabase.from('user_profiles').select('*');

    
    return json({ users:data });
  } catch (error) {
    console.error("Cleaning Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


export const PUT: RequestHandler = async ({ request }) => {
  try {
    const authUser = await checkAuth(request);
    const isAdmin = authUser.isAdmin;

    if (!isAdmin) {
      return json({stats: 401, error: 'Unauthorized not admin'});
    }

    const {user_id, realtor_approved} = await request.json();

    const {data, error} = await supabase.from('user_profiles').update({realtor_approved}).eq('user_id',user_id);
    if (error) {
      return json({error},{status:500});
    }
    
    //TODO: notify user

    return json({ msg: 'Updated' });
  } catch (error) {
    console.error("Cleaning Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};