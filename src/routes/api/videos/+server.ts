import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";
import { getServiceTypeInfo } from "$lib/types/video";
import { sendProjectSubmitted } from "$lib/email";

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


export const POST: RequestHandler = async ({ request }) => {
  try {
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    const isAdmin = authUser.isAdmin;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (isAdmin) {
      return json({stats: 401, error: 'Admin can not do this operation'});
    }

    const videoService = await request.json();

    const { data, error } = await supabase.from('video_services').insert({...videoService,user_id}).select('*').single();

    if (error) {
      return json(
        { error: "Failed to add user video services from Supabase" },
        { status: 500 }
      );
    }

    const serviceType = getServiceTypeInfo(videoService?.service_type);

    const projectName = `Project ${serviceType?.label}`;
    const projectUrl = `/dashboard/video_services/${data.id}`;

    sendProjectSubmitted(authUser.email, projectName, projectUrl);

    return json({ video_service: data });
  } catch (error) {
    console.error("video service insert Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};