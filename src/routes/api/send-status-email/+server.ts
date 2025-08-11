import { json } from "@sveltejs/kit";
import { sendProjectStatusChange, sendProjectSubmitted } from "$lib/email";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";
import supabase from "$lib/db/client";

export const POST: RequestHandler = async ({ request }) => {
  try {

    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    const isAdmin = authUser.isAdmin;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    const { tp, oldStatus, id, type } =
      await request.json();

    if (!tp || !id) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    const {data:service, error} = await supabase.from(tp).select('*').eq('id',id).single();
    if (error) {
      return json({error},{status:500});
    }

    const PROJECT_NAMES:{[key:string]:string} = {
      social_media_services: service?.platforms?.join(', ') + ' ' + service?.posting_frequency,
      video_services: `Project ${service.id?.slice(-8)}`,
      stagings: service?.location,
      cleanings: service?.location,
    }
    
    if (!service) {
      return json({error: 'Service not found'},{status:404});
    }

    const {data:user, error:userError} = await supabase.from('user_profiles').select('email').eq('user_id',service.user_id).single();
    const email = user?.email;
    const projectUrl = `/dashboard/${tp}/${service.id}`;
    const projectName = PROJECT_NAMES[tp];
    const newStatus = service.status;

    if (type === "submission") {
      await sendProjectSubmitted(email, projectName, projectUrl);
    } else {
      if (!oldStatus || !newStatus) {
        return json(
          { error: "Missing status fields for status change email" },
          { status: 400 }
        );
      }
      await sendProjectStatusChange(
        email,
        projectName,
        oldStatus,
        newStatus,
        projectUrl
      );
    }

    return json({ success: true });
  } catch (error) {
    console.error("Email API error:", error);
    return json(
      { error: "Failed to send email notification" },
      { status: 500 }
    );
  }
};
