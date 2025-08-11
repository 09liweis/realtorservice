import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";
import { isLoading } from "$lib/stores/auth";

export const GET: RequestHandler = async ({ request,params }) => {
  try {
    const couponId = params.couponId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    const isAdmin = authUser.isAdmin;
    if (!isAdmin) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!couponId) {
      return json({stats: 404, error: 'coupon service not found'});
    }

    const {data:foundCoupon,error:foundError} = await supabase.from('coupons').select('*').eq("id",couponId).single();

    if (foundError) {
      return json(
        { error: "Failed to fetch user Cleaning from Supabase" },
        { status: 500 }
      );
    }

    if (!foundCoupon) {
      return json({stats: 404, error: 'Coupon not found'});
    }
  

    
    return json({ coupon: foundCoupon });
  } catch (error) {
    console.error("couponid Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


export const PUT: RequestHandler = async ({ request,params }) => {
  try {
    const couponId = params.couponId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!isLoading) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!couponId) {
      return json({stats: 404, error: 'Couponid not found'});
    }

    const couponservice = await request.json();

    if (!couponservice.expires_at) {
      couponservice.expires_at = null;
    }

    // Fetch user email from Supabase
    const { data, error } = await supabase
    .from('coupons')
    .update(couponservice)
    .eq('id', couponId).select('*').single();
    

    if (error) {
      return json(
        { error: "Failed to update coupon from Supabase" },
        { status: 500 }
      );
    }
    return json({ coupon: data });
  } catch (error) {
    console.error("update coupon Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


export const DELETE: RequestHandler = async ({ request,params }) => {
  try {
    const couponId = params.couponId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!isLoading) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!couponId) {
      return json({stats: 404, error: 'couponId not found'});
    }

    // Fetch user email from Supabase
    
    const { data, error } = await supabase
    .from('coupons')
    .delete()
    .eq("id", couponId);

    if (error) {
      return json(
        { error: "Failed to delete coupon from Supabase" },
        { status: 500 }
      );
    }
    return json({ msg: 'Deleted' });
  } catch (error) {
    console.error("delete coupon Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};