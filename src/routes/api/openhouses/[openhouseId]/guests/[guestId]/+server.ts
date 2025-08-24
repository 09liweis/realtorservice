import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkAuth } from '$lib/server/apiAuth';
import supabase from '$lib/db/client';

// Update a guest
export const PUT: RequestHandler = async ({ params, request }) => {
  const { openhouseId, guestId } = params;
  const data = await request.json();

  // TODO: Implement guest update logic here
  // Example: Update guest in database
  // const updatedGuest = await updateGuest(openhouseId, guestId, data);

  return json({ success: true, message: 'Guest updated successfully' });
};

export const DELETE: RequestHandler = async ({ request,params }) => {
  try {
    const openhouseId = params.openhouseId
    const guestId = params.guestId;
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    if (!openhouseId) {
      return json({stats: 404, error: 'Openhouse not found'});
    }

    // Fetch user email from Supabase
    
    const { error } = await supabase
    .from('openhouse_guests')
    .delete()
    .eq("user_id",user_id)
    .eq('id', guestId)
    .eq("property_id", openhouseId);

    if (error) {
      return json(
        { error: "Failed to delete openhouse guest from Supabase" },
        { status: 500 }
      );
    }
    return json({ msg: 'Deleted' });
  } catch (error) {
    console.error("openhouse guest Error: ", error);
    return json(
      { error: "Fail to delete openhouse guest" },
      { status: 500 }
    );
  }
};
