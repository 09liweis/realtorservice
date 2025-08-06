import { json } from "@sveltejs/kit";
import supabase from "$lib/db/client";
import type { RequestHandler } from "./$types";
import { checkAuth } from "$lib/server/apiAuth";

export const GET: RequestHandler = async ({ request }) => {
  try {
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    const isAdmin = authUser.isAdmin;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    // Fetch user email from Supabase
    let cleaningsQuery = supabase.from('cleanings').select('*').order('updated_at',{ascending:false});
    let stagingsQuery = supabase.from('stagings').select('*').order('updated_at',{ascending:false});
    let socialsQuery = supabase.from('social_media_services').select('*').order('updated_at',{ascending:false});
    let videosQuery = supabase.from('video_services').select('*').order('updated_at',{ascending:false});
    let listingsQuery = supabase.from('listings').select('*').order('updated_at',{ascending:false});
    if (!isAdmin) {
      cleaningsQuery = cleaningsQuery.eq('user_id',user_id)
      stagingsQuery = stagingsQuery.eq('user_id',user_id)
      socialsQuery = socialsQuery.eq('user_id',user_id)
      videosQuery = videosQuery.eq('user_id',user_id)
      listingsQuery = listingsQuery.eq('user_id',user_id)
    }
    const { data:cleanings, error:cleaningsError } = await cleaningsQuery;
    const { data:stagings, error: stagingsError } = await stagingsQuery;
    const { data:socials, error: socialsError } = await socialsQuery;
    const { data:videos, error: videosError } = await videosQuery;
    const { data:listings, error: listingsError } = await listingsQuery;

    if (cleaningsError||stagingsError||socialsError||videosError||listingsError) {
      return json(
        { error: "Failed to fetch data from Supabase" },
        { status: 500 }
      );
    }


    let dashboardStats = {
      listings: {
        total: 0,
        active: 0,
        sold: 0
      },
      services: {
        stagings: {
          count: 0,
          is_user_unread:0,
          is_admin_unread:0
        },
        cleanings: {
          count: 0,
          is_user_unread:0,
          is_admin_unread:0
        },
        videos: {
          count: 0,
          is_user_unread:0,
          is_admin_unread:0
        },
        social: {
          count: 0,
          is_user_unread:0,
          is_admin_unread:0
        },
      },
      activities: {
        offers: 0,
        openHouses: 0
      },
      credits: {
        available: authUser.credits,
        used: 0
      }
    };

    // Process listings data
    if (listings?.length) {
      dashboardStats.listings = {
        total: listings.length,
        active: listings.filter(l => !l.is_sold).length,
        sold: listings.filter(l => l.is_sold).length
      };
    }

    // Process services data
    dashboardStats.services = {
      stagings: {
        count: stagings?.length || 0,
        is_user_unread: stagings?.filter(item => item.is_user_unread).length || 0,
        is_admin_unread: stagings?.filter(item => item.is_admin_unread).length || 0
      },
      cleanings: {
        count: cleanings?.length || 0,
        is_user_unread: cleanings?.filter(item => item.is_user_unread).length || 0,
        is_admin_unread: cleanings?.filter(item => item.is_admin_unread).length || 0
      },
      videos: {
        count: videos?.length || 0,
        is_user_unread: videos?.filter(item => item.is_user_unread).length || 0,
        is_admin_unread: videos?.filter(item => item.is_admin_unread).length || 0
      },
      social: {
        count: socials?.length || 0,
        is_user_unread: socials?.filter(item => item.is_user_unread).length || 0,
        is_admin_unread: socials?.filter(item => item.is_admin_unread).length || 0
      }
    };

    // // Process activities data
    // dashboardStats.activities = {
    //   offers: offersResult.data?.length || 0,
    //   openHouses: openHousesResult.data?.length || 0
    // };
    return json({ dashboardStats });
  } catch (error) {
    console.error("Cleaning Error: ", error);
    return json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};