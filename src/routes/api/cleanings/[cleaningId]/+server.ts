import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request,params }) => {
  try {
    const cleaningId = params.cleaningId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    const isAdmin = authUser.isAdmin;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!cleaningId) {
      return json({stats: 404, error: 'Cleaning Service not found'});
    }

    const {data:foundCleaning,error:foundError} = await supabase.from('cleanings').select('*').eq("id",cleaningId).single();
    if (!foundCleaning) {
      return json({stats: 404, error: 'Cleaning service not found'});
    }

    const updateUnread = {is_admin_unread:true, is_user_unread: true}
    if (isAdmin) {
      updateUnread.is_admin_unread = false;
    } else {
      updateUnread.is_user_unread = false;
    }

    // Fetch user email from Supabase
    const { data, error } = await supabase
    .from('cleanings')
    .update(updateUnread)
    .eq("user_id",foundCleaning.user_id)
    .eq("id", cleaningId);
    

    if (error) {
      return json(
        { error: "Failed to fetch user Cleaning from Supabase" },
        { status: 500 }
      );
    }
    return json({ cleaning: foundCleaning });
  } catch (error) {
    console.error("Cleaning Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


export const PUT: RequestHandler = async ({ request,params }) => {
  try {
    const cleaningId = params.cleaningId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!cleaningId) {
      return json({stats: 404, error: 'Cleaning service not found'});
    }

    const cleaningservice = await request.json();

    // Fetch user email from Supabase
    const { data, error } = await supabase
    .from('cleanings')
    .update(cleaningservice)
    .eq('id', cleaningId)
    .eq("user_id", user_id)
    

    if (error) {
      return json(
        { error: "Failed to update user video service from Supabase" },
        { status: 500 }
      );
    }
    return json({ cleaning: data });
  } catch (error) {
    console.error("video service Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


export const DELETE: RequestHandler = async ({ request,params }) => {
  try {
    const cleaningId = params.cleaningId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!cleaningId) {
      return json({stats: 404, error: 'video service not found'});
    }

    // Fetch user email from Supabase
    
    const { data, error } = await supabase
    .from('cleanings')
    .delete()
    .eq("user_id",user_id)
    .eq("id", cleaningId);

    if (error) {
      return json(
        { error: "Failed to delete user Cleaning service from Supabase" },
        { status: 500 }
      );
    }
    return json({ msg: 'Deleted' });
  } catch (error) {
    console.error("cleanings Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};