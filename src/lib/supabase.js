import { createClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public"

// 从环境变量中获取Supabase URL和匿名密钥
const supabaseUrl = browser ? import.meta.env.PUBLIC_SUPABASE_URL : PUBLIC_SUPABASE_URL;
const supabaseAnonKey = browser ? import.meta.env.PUBLIC_SUPABASE_ANON_KEY : PUBLIC_SUPABASE_ANON_KEY;

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);