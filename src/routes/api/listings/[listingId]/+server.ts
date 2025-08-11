import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request,params }) => {
  try {
    const listingId = params.listingId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    const isAdmin = authUser.isAdmin;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!listingId) {
      return json({stats: 404, error: 'Cleaning Service not found'});
    }

    const {data:foundListing,error:foundError} = await supabase.from('listings').select('*').eq("id",listingId).single();
    if (!foundListing) {
      return json({stats: 404, error: 'Cleaning service not found'});
    }

    const updateUnread = {is_admin_unread:true, is_user_unread: true}
    if (isAdmin) {
      updateUnread.is_admin_unread = false;
    } else {
      updateUnread.is_user_unread = false;
    }

    // Fetch user email from Supabase
    const { data, error } = await supabase
    .from('listings')
    .update(updateUnread)
    .eq("user_id",foundListing.user_id)
    .eq("id", listingId);
    

    if (error) {
      return json(
        { error: "Failed to fetch user Cleaning from Supabase" },
        { status: 500 }
      );
    }
    return json({ cleaning: foundListing });
  } catch (error) {
    console.error("Cleaning Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


export const PUT: RequestHandler = async ({ request,params }) => {
  try {
    const listingId = params.listingId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!listingId) {
      return json({stats: 404, error: 'Cleaning service not found'});
    }

    const {data:foundListing,error:foundError} = await supabase.from('listings').select('*').eq("id",listingId).single();
    if (!foundListing) {
      return json({stats: 404, error: 'staging service not found'});
    }

    const listing = await request.json();
    delete listing.user_profiles;

    // Fetch user email from Supabase
    const { data, error } = await supabase
    .from('listings')
    .update(listing)
    .eq('id', listingId)
    .eq("user_id", user_id)
    .select('*')
    .single();
    

    if (error) {
      return json(
        { error: "Failed to update user listing from Supabase" },
        { status: 500 }
      );
    }
    return json({ listing: data });
  } catch (error) {
    console.error("update listing Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};


export const DELETE: RequestHandler = async ({ request,params }) => {
  try {
    const listingId = params.listingId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!listingId) {
      return json({stats: 404, error: 'listing not found'});
    }

    // Fetch user email from Supabase
    
    const { data, error } = await supabase
    .from('listings')
    .delete()
    .eq("user_id",user_id)
    .eq("id", listingId);

    if (error) {
      return json(
        { error: "Failed to delete user listing from Supabase" },
        { status: 500 }
      );
    }
    return json({ msg: 'Deleted' });
  } catch (error) {
    console.error("listings Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};