import supabase from "$lib/db/client";
import { formatUserName, getUserInitials } from "$lib/helper";

export async function checkAuth(request:Request) {
  const authorization = request.headers.get('authorization');
  let userProfile = {id:'',user_id:'',isAdmin:false,credits:0,email:''};
  if (!authorization) return userProfile;
  try {
    const {access_token,user} = JSON.parse(authorization);
    if (user?.id) {
      const {data:profile,error} = await supabase.from('user_profiles').select('*').eq('user_id',user.id).single();
      if (profile) {
        userProfile = {
          ...profile,
          isAdmin: profile?.role === 'admin',
          isApproved: profile?.realtor_approved,
          name: formatUserName(profile),
          initial: getUserInitials(profile),
        }
      }
    }
    return userProfile;
  } catch (err) {
    console.error("Parse error ", err)
    return userProfile;
  }
}