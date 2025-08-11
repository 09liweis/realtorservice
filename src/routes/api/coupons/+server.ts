import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request }) => {
  try {
    const authUser = await checkAuth(request);
    const isAdmin = authUser.isAdmin;
    if (!isAdmin) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    // Fetch user email from Supabase
    let query = supabase.from('coupons').select('*').order('updated_at',{ascending:false});
    const { data, error } = await query;

    if (error) {
      return json(
        { error: "Failed to fetch coupons from Supabase" },
        { status: 500 }
      );
    }
    return json({ coupons: data });
  } catch (error) {
    console.error("Coupons Error: ", error);
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
    if (!isAdmin) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    const couponservice = await request.json();

    if (!couponservice.expires_at) {
      couponservice.expires_at = null;
    }

    const { data, error } = await supabase.from('coupons').insert(couponservice).select('*').single();

    if (error) {
      console.error("Insert error: ", error);
      return json(
        { error: "Failed to add coupon from Supabase" },
        { status: 500 }
      );
    }
    return json({ coupons: data });
  } catch (error) {
    console.error("coupons insert Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};