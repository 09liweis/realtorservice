import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import supabase from '$lib/db/client';
import type { Listing } from '$lib/types/listing';
import { sendRequest } from '$lib/helper';

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  isApproved: boolean;
  profile: any;
  name: string;
  initial: string;
  credits: number;
}

// 创建用户存储
export const user = writable<User | null>(null);
export const isLoading = writable(true);

export const listings = writable<Listing[]>([]);

async function setUserProfile() {
  const {data:{userProfile}} = await sendRequest({
    url:'/api/user',
    method: 'GET'
  })
  
  if (!userProfile) return;
  
  // 设置用户数据，包括资料
  user.set(userProfile);
}

// 初始化函数，检查当前会话状态
export async function initializeAuth() {
  if (!browser) return;
  
  // 检查当前会话
  const { data } = await supabase.auth.getSession();
  
  if (data?.session?.user) {
    const userData = data.session.user;
    await setUserProfile();
  } else {
    user.set(null);
  }
  
  isLoading.set(false);
  
  // 监听认证状态变化
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      const userData = session.user;
      await setUserProfile();
    } else if (event === 'SIGNED_OUT') {
      user.set(null);
    }
  });
}

// 添加页面可见性变化监听
if (browser) {
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
      //TODO: need to fix later
      // location.reload();
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