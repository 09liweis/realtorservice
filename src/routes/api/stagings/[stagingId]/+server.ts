import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request,params }) => {
  try {
    const stagingId = params.stagingId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    const isAdmin = authUser.isAdmin;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!stagingId) {
      return json({stats: 404, error: 'Staging Service not found'});
    }

    const {data:foundStaging,error:foundError} = await supabase.from('stagings').select('*').eq("id",stagingId).single();
    if (!foundStaging) {
      return json({stats: 404, error: 'staging service not found'});
    }

    const updateUnread = {is_admin_unread:true, is_user_unread: true}
    if (isAdmin) {
      updateUnread.is_admin_unread = false;
    } else {
      updateUnread.is_user_unread = false;
    }

    // Fetch user email from Supabase
    const { data, error } = await supabase
    .from('stagings')
    .update(updateUnread)
    .eq("user_id",foundStaging.user_id)
    .eq("id", stagingId);
    

    if (error) {
      return json(
        { error: "Failed to fetch user staging from Supabase" },
        { status: 500 }
      );
    }
    return json({ staging: foundStaging });
  } catch (error) {
    console.error("staging Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


export const PUT: RequestHandler = async ({ request,params }) => {
  try {
    const stagingId = params.stagingId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!stagingId) {
      return json({stats: 404, error: 'staging service not found'});
    }

    const stagingService = await request.json();

    // Fetch user email from Supabase
    const { data, error } = await supabase
    .from('stagings')
    .update(stagingService)
    .eq('id', stagingId)
    .eq("user_id", user_id)
    

    if (error) {
      return json(
        { error: "Failed to update user video service from Supabase" },
        { status: 500 }
      );
    }
    return json({ staging: data });
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
    const stagingId = params.stagingId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!stagingId) {
      return json({stats: 404, error: 'video service not found'});
    }

    // Fetch user email from Supabase
    
    const { data, error } = await supabase
    .from('stagings')
    .delete()
    .eq("user_id",user_id)
    .eq("id", stagingId);

    if (error) {
      return json(
        { error: "Failed to delete user staging service from Supabase" },
        { status: 500 }
      );
    }
    return json({ msg: 'Deleted' });
  } catch (error) {
    console.error("stagings Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};