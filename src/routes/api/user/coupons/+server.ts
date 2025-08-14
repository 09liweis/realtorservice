import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";
import supabase from "$lib/db/client";

export const GET: RequestHandler = async ({ request }) => {
  try {
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    const {data,error} = await supabase
    .from('coupon_usage')
    .select(`
      *,
      coupons (
        *
      )
    `)
    .eq('user_id', user_id);

    if (error) {
      return json({ error: "Failed to get coupons from Supabase" },{status:500});
    }

    if (!data || data?.length == 0) {
      return json({ coupons: [] });
    }
    const coupons = data?.map(coupon => {
      return coupon.coupons
    })

    return json({ coupons});
  } catch (error) {
    console.error("User Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};