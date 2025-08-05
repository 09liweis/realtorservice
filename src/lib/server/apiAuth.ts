import supabase from "$lib/db/client";

export async function checkAuth(request:Request) {
  const authorization = request.headers.get('authorization');
  let userProfile = {id:'',user_id:'',isAdmin:false};
  if (!authorization) return userProfile;
  try {
    const {access_token,user} = JSON.parse(authorization);
    if (user?.id) {
      const {data,error} = await supabase.from('user_profiles').select('*').eq('user_id',user.id).single();
      if (data) {
        userProfile = {...data,isAdmin:data.role === 'admin'}
      }
    }
    console.log(userProfile);
    return userProfile;
  } catch (err) {
    console.error("Parse error ", err)
    return userProfile;
  }
}