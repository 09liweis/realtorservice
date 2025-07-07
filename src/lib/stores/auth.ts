import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import supabase from '$lib/db/client';

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  isApproved: boolean;
  profile: any;
  name: string;
  initial: string;
}

// 创建用户存储
export const user = writable<User | null>(null);
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

async function setUserProfile(userData: any) {
  const profile = await fetchUserProfile(userData.id);
  
  if (!profile) return;
  
  // 设置用户数据，包括资料
  user.set({
    ...userData,
    isAdmin: profile?.role === 'admin',
    isApproved: profile?.realtor_approved,
    name: `${profile.first_name} ${profile.last_name}`,
    initial: `${profile.first_name[0]}`,
    profile
  });
}

// 初始化函数，检查当前会话状态
export async function initializeAuth() {
  if (!browser) return;
  
  // 检查当前会话
  const { data } = await supabase.auth.getSession();
  
  if (data?.session?.user) {
    const userData = data.session.user;
    await setUserProfile(userData);
  } else {
    user.set(null);
  }
  
  isLoading.set(false);
  
  // 监听认证状态变化
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      const userData = session.user;
      await setUserProfile(userData);
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