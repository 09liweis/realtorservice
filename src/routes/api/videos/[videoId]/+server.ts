import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request,params }) => {
  try {
    const videoId = params.videoId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    const isAdmin = authUser.isAdmin;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!videoId) {
      return json({stats: 404, error: 'Vidoe Service not found'});
    }

    const {data:foundVideo,error:foundError} = await supabase.from('video_services').select('*').eq("id",videoId).single();
    if (!foundVideo) {
      return json({stats: 404, error: 'social service not found'});
    }

    const updateUnread = {is_admin_unread:true, is_user_unread: true}
    if (isAdmin) {
      updateUnread.is_admin_unread = false;
    } else {
      updateUnread.is_user_unread = false;
    }

    // Fetch user email from Supabase
    const { data, error } = await supabase
    .from('video_services')
    .update(updateUnread)
    .eq("user_id",foundVideo.user_id)
    .eq("id", videoId);
    

    if (error) {
      return json(
        { error: "Failed to fetch user video_service from Supabase" },
        { status: 500 }
      );
    }
    return json({ video_service: foundVideo });
  } catch (error) {
    console.error("video_service Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


export const PUT: RequestHandler = async ({ request,params }) => {
  try {
    const videoId = params.videoId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    const isAdmin = authUser.isAdmin;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!videoId) {
      return json({stats: 404, error: 'video service not found'});
    }

    const {data:foundVideo,error:foundError} = await supabase.from('video_services').select('*').eq("id",videoId).single();
    if (!foundVideo) {
      return json({stats: 404, error: 'social service not found'});
    }

    const videoService = await request.json();

    if (isAdmin) {
      videoService.is_admin_unread = false;
      videoService.is_user_unread = true;
    } else {
      videoService.is_admin_unread = true;
      videoService.is_user_unread = false;
    }

    // Fetch user email from Supabase
    const { data, error } = await supabase
    .from('video_services')
    .update(videoService)
    .eq('id', videoId)
    .eq("user_id", foundVideo.user_id)
    

    if (error) {
      return json(
        { error: "Failed to update user video service from Supabase" },
        { status: 500 }
      );
    }
    return json({ video_service: data });
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
    const videoId = params.videoId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!videoId) {
      return json({stats: 404, error: 'video service not found'});
    }

    // Fetch user email from Supabase
    
    const { data, error } = await supabase
    .from('video_services')
    .delete()
    .eq("user_id",user_id)
    .eq("id", videoId);

    if (error) {
      return json(
        { error: "Failed to delete user video service from Supabase" },
        { status: 500 }
      );
    }
    return json({ msg: 'Deleted' });
  } catch (error) {
    console.error("video_services Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};