import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";
import { sendProjectSubmitted } from "$lib/email";
import { logApiError } from "../../../utils/errorLogger";

export const GET: RequestHandler = async ({ request }) => {
  try {
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    const isAdmin = authUser.isAdmin;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    // Fetch user email from Supabase
    let query = supabase.from('cleanings').select('*').order('updated_at',{ascending:false});
    if (!isAdmin) {
      query = query.eq('user_id',user_id)
    }
    const { data, error } = await query;

    if (error) {
      return json(
        { error: "Failed to fetch user cleaning from Supabase" },
        { status: 500 }
      );
    }
    return json({ cleanings: data });
  } catch (error) {
    logApiError(request, error);
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

    const cleaningService = await request.json();

    const { data, error } = await supabase.from('cleanings').insert({...cleaningService,user_id}).select('*').single();

    if (error) {
      return json(
        { error: "Failed to add user cleaning services from Supabase" },
        { status: 500 }
      );
    }

    const projectName = cleaningService.location || data?.id;
    const projectUrl = `/dashboard/cleanings/${data?.id}`;

    sendProjectSubmitted(authUser.email, projectName, projectUrl);

    return json({ cleaning: data });
  } catch (error) {
    console.error("cleaning service insert Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};