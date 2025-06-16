import { createClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public"

// 从环境变量中获取Supabase URL和匿名密钥
const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY;

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


export const getOpenHouses = async ({user_id}) => {
  return await supabase
    .from('openhouses')
    .select(`
      id,
      user_id,
      address,
      date
    `)
    .eq('user_id',user_id);
}

export const upsertOpenHouse = async (oh) => {
  if (oh.id) {
    return await supabase
      .from('openhouses')
      .update({
        updated_at: new Date(),
        ...oh
      })
      .eq('id',oh.id);
  } else {
    return await supabase
      .from('openhouses')
      .insert(oh);
  }
}

export const deleteOpenhouse = async (id:string) => {
  return await supabase
    .from('openhouses')
    .delete()
    .eq('id',id);
}