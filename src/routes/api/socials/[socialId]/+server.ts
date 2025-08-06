import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request,params }) => {
  try {
    const socialId = params.socialId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!socialId) {
      return json({stats: 404, error: 'Openhouse not found'});
    }

    // Fetch user email from Supabase
    const { data, error } = await supabase
    .from('social_media_services')
    .select('*')
    .eq("user_id",user_id)
    .eq("id", socialId)
    .single();
    

    if (error) {
      return json(
        { error: "Failed to fetch user social_media_service from Supabase" },
        { status: 500 }
      );
    }
    return json({ social_media_service: data });
  } catch (error) {
    console.error("social_media_service Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


export const PUT: RequestHandler = async ({ request,params }) => {
  try {
    const socialId = params.socialId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!socialId) {
      return json({stats: 404, error: 'social media service not found'});
    }

    const socialMediaService = await request.json();

    // Fetch user email from Supabase
    const { data, error } = await supabase
    .from('social_media_services')
    .update(socialMediaService)
    .eq('id', socialId)
    .eq("user_id", user_id)
    

    if (error) {
      return json(
        { error: "Failed to update user social media service from Supabase" },
        { status: 500 }
      );
    }
    return json({ social_media_service: data });
  } catch (error) {
    console.error("social media service Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


export const DELETE: RequestHandler = async ({ request,params }) => {
  try {
    const socialId = params.socialId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!socialId) {
      return json({stats: 404, error: 'social media service not found'});
    }

    // Fetch user email from Supabase
    
    const { data, error } = await supabase
    .from('social_media_services')
    .delete()
    .eq("user_id",user_id)
    .eq("id", socialId);

    if (error) {
      return json(
        { error: "Failed to delete user social media service from Supabase" },
        { status: 500 }
      );
    }
    return json({ msg: 'Deleted' });
  } catch (error) {
    console.error("social_media_services Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};