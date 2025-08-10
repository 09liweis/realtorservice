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

    const {data:creditRecords,error} = await supabase.from('credit_records').select('*').eq('user_id',user_id).order('updated_at',{ascending:false});

    return json({ userProfile: authUser, creditRecords });
  } catch (error) {
    console.error("User Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};

export const POST: RequestHandler = async ({ request,params }) => {
  try {
    const userProfile = await request.json();

    // Fetch user email from Supabase
    const { data, error: addUserProfileError } = await supabase
    .from('user_profiles')
    .insert({...userProfile, credits: 0, role: 'realtor',});
    

    if (addUserProfileError) {
      return json(
        { error: "Failed to add user profile from Supabase" },
        { status: 500 }
      );
    }

    const {data: coupons, error: getCouponsError } = await supabase
      .from('coupons')
      .select('*')
      .eq('active', true)
      .or('expires_at.is.null,expires_at.gte.' + new Date().toISOString())
      .order('created_at', { ascending: false });
    
    if (getCouponsError) {
      return json(
        { error: "Failed to get coupons from Supabase" },
        { status: 500 }
      );
    }

    if (coupons.length > 0) {
      const userCoupons = coupons.map(coupon => {
        return {
          coupon_id: coupon.id,
          user_id: userProfile.user_id,
          redeemed_at: null
        }
      });

      // Record coupon usage
        const { error: usageError } = await supabase
          .from('coupon_usage')
          .insert(userCoupons);

      return json({ msg:'Added' });
    } else {
      return json({msg: 'Added without coupons' })
    }
    
  } catch (error) {
    console.error("userProfile Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


export const PUT: RequestHandler = async ({ request,params }) => {
  try {
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    const userProfile = await request.json();

    // Fetch user email from Supabase
    const { data, error } = await supabase
    .from('user_profiles')
    .update({...userProfile,updated_at: new Date()})
    .eq("user_id", user_id)
    

    if (error) {
      return json(
        { error: "Failed to update user profile from Supabase" },
        { status: 500 }
      );
    }
    return json({ msg:'Updated' });
  } catch (error) {
    console.error("userProfile Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};