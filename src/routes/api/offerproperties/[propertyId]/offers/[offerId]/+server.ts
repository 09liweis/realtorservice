import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const DELETE: RequestHandler = async ({ request,params }) => {
  try {
    const propertyId = params.propertyId
    const offerId = params.offerId
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!propertyId) {
      return json({stats: 404, error: 'offer property not found'});
    }

    if (!offerId) {
      return json({stats: 404, error: 'offer not found'});
    }

    // Fetch user email from Supabase
    
    const { error } = await supabase
    .from('offers')
    .delete()
    .eq('id', offerId)
    .eq("user_id",user_id)
    .eq("property_id", propertyId);

    if (error) {
      return json(
        { error: "Failed to delete user offer from Supabase" },
        { status: 500 }
      );
    }
    return json({ msg: 'Deleted' });
  } catch (error) {
    console.error("offer delete Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};