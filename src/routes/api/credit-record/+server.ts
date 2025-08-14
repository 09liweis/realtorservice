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


export const POST: RequestHandler = async ({ request }) => {
  try {
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    const {tp, tp_id,amount, coupon_id} = await request.json();

    let totalAmount = amount;

    let coupon = null;
    if (coupon_id) {
      const {data, error} = await supabase.from('coupons').select('*').eq('id',coupon_id).single();
      coupon = data;
    }

    if (coupon) {
      totalAmount -= coupon.credits
    }

    // Fetch user email from Supabase
    const {error:creditRecordError} = await supabase
      .from('credit_records')
      .insert({
        tp,tp_id,amount: -totalAmount, user_id, status: 'done', coupon_id
      });

    if (creditRecordError) {
      return json(
        { error: "Failed to add credit record from Supabase" },
        { status: 500 }
      );
    }

    const {error: couponUsageError} = await supabase.from('coupon_usage').update({
      redeemed_at: new Date()
    }).eq('user_id',user_id).eq('coupon_id',coupon_id);

    if (couponUsageError) {
      return json(
        { error: "Failed to update coupon usage from Supabase" },
        { status: 500 }
      );
    }

    const newCredits = authUser.credits - totalAmount;
    const {error:userProfileError} = await supabase
      .from('user_profiles')
      .update({
        credits: newCredits
      })
      .eq('user_id', user_id);

    return json({ credits: newCredits });
  } catch (error) {
    console.error("Cleaning Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};