import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request }) => {
  try {
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    return json({ user: authUser });
  } catch (error) {
    console.error("User Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};