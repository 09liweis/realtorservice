<script>
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  // 如果用户未登录，重定向到登录页面
  onMount(() => {
    if (!$user) {
      goto('/login');
    }
  });
</script>

<svelte:head>
  <title>仪表板 - 房产经纪人服务</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">欢迎回来，{$user?.email?.split('@')[0] || '用户'}</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 房源管理卡片 -->
        <div class="bg-blue-50 p-6 rounded-lg">
          <h2 class="text-lg font-semibold text-blue-900 mb-2">房源管理</h2>
          <p class="text-blue-700 mb-4">管理您的房源列表，添加新房源或更新现有房源。</p>
          <a 
            href="/dashboard/listings" 
            class="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            查看房源
            <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <!-- 报价管理卡片 -->
        <div class="bg-green-50 p-6 rounded-lg">
          <h2 class="text-lg font-semibold text-green-900 mb-2">报价管理</h2>
          <p class="text-green-700 mb-4">查看和管理收到的报价，与潜在买家进行沟通。</p>
          <a 
            href="/dashboard/offers" 
            class="inline-flex items-center text-green-600 hover:text-green-800"
          >
            查看报价
            <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <!-- 个人资料卡片 -->
        <div class="bg-purple-50 p-6 rounded-lg">
          <h2 class="text-lg font-semibold text-purple-900 mb-2">个人资料</h2>
          <p class="text-purple-700 mb-4">更新您的个人信息和联系方式。</p>
          <a 
            href="/dashboard/profile" 
            class="inline-flex items-center text-purple-600 hover:text-purple-800"
          >
            编辑资料
            <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>