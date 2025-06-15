import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import { browser } from '$app/environment';

// 创建用户存储
export const user = writable(null);
export const isLoading = writable(true);

// 初始化函数，检查当前会话状态
export async function initializeAuth() {
  if (!browser) return;
  
  // 检查当前会话
  const { data } = await supabase.auth.getSession();
  user.set(data?.session?.user || null);
  isLoading.set(false);
  
  // 监听认证状态变化
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      user.set(session.user);
    } else if (event === 'SIGNED_OUT') {
      user.set(null);
    }
  });
}

// 登出函数
export async function signOut() {
  try {
    await supabase.auth.signOut();
    user.set(null);
    return { success: true };
  } catch (error) {
    console.error('登出错误:', error);
    return { success: false, error };
  }
}