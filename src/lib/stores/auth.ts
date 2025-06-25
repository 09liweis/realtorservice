import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import { browser } from '$app/environment';

// 创建用户存储
export const user = writable(null);
export const isLoading = writable(true);

// 获取用户资料
async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    console.error('获取用户资料错误:', error);
    return null;
  }
  
  return data;
}

// 初始化函数，检查当前会话状态
export async function initializeAuth() {
  if (!browser) return;
  
  // 检查当前会话
  const { data } = await supabase.auth.getSession();
  
  if (data?.session?.user) {
    const userData = data.session.user;
    const profile = await fetchUserProfile(userData.id);
    
    // 设置用户数据，包括资料
    user.set({
      ...userData,
      profile
    });
  } else {
    user.set(null);
  }
  
  isLoading.set(false);
  
  // 监听认证状态变化
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      const userData = session.user;
      const profile = await fetchUserProfile(userData.id);
      
      // 设置用户数据，包括资料
      user.set({
        ...userData,
        profile
      });
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