import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import { sendCustomEmail } from "$lib/email";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { user_id, content } = await request.json();

    if (!user_id || !content) {
      return json(
        { error: "Missing required fields: user_id or content" },
        { status: 400 }
      );
    }

    // Fetch user email from Supabase
    const { data: userProfile, error } = await supabase
      .from("user_profiles")
      .select("email")
      .eq("user_id", user_id)
      .single();

    if (error || !userProfile) {
      return json(
        { error: "Failed to fetch user email from Supabase" },
        { status: 500 }
      );
    }

    // Send email
    await sendCustomEmail(userProfile.email, content);

    return json({ success: true });
  } catch (error) {
    console.error("Email API error:", error);
    return json(
      { error: "Failed to send email notification" },
      { status: 500 }
    );
  }
};