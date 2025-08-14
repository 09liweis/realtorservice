import supabase from "$lib/db/client";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const { data: listings, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Error fetching listings:", error);
    return { listings: [] };
  }

  return { listings };
};
