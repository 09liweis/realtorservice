import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";
import { sendProjectSubmitted } from "$lib/email";
import { DASHBOARD_SOCIAL_MEDIA_SERVICES_URL } from "$lib/types/constant";

export const GET: RequestHandler = async ({ request }) => {
  try {
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    const isAdmin = authUser.isAdmin;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    // Fetch user email from Supabase
    let query = supabase.from('social_media_services').select('*').order('updated_at',{ascending:false});
    if (!isAdmin) {
      query = query.eq('user_id',user_id)
    }
    const { data, error } = await query;

    if (error) {
      return json(
        { error: "Failed to fetch user social media services from Supabase" },
        { status: 500 }
      );
    }
    return json({ social_media_services: data });
  } catch (error) {
    console.error("social media services Error: ", error);
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

    const socialMediaService = await request.json();

    const { data, error } = await supabase.from('social_media_services').insert({...socialMediaService,user_id}).select('*').single();

    if (error) {
      return json(
        { error: "Failed to add user social media services from Supabase" },
        { status: 500 }
      );
    }

    const projectName = `${socialMediaService.platforms.join(', ')} ${socialMediaService.posting_frequency}`;
    const projectUrl = `${DASHBOARD_SOCIAL_MEDIA_SERVICES_URL}/${data.id}`;

    sendProjectSubmitted(authUser.email, projectName, projectUrl);

    return json({ social_media_service: data });
  } catch (error) {
    console.error("social media service insert Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};