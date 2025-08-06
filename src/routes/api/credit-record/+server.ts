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
    const {data, error} = await supabase
    .from('credit_records')
    .select('*')
    .eq('user_id',user_id)
    .eq('tp', 'topup')
    .eq('status', 'pending')
    .single();

    if (error) {
      return json(
        { error: "Failed to fetch user cleaning from Supabase" },
        { status: 500 }
      );
    }
    return json({ pendingTopupCreditRecord: data });
  } catch (error) {
    console.error("Cleaning Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};