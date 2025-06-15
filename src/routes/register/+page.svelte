<script>
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/auth';
  import { onMount } from 'svelte';

  // 如果用户已登录，重定向到仪表板
  onMount(() => {
    if ($user) {
      goto('/dashboard');
    }
  });

  // 表单数据
  let firstName = '';
  let lastName = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  
  // 错误和加载状态
  let error = '';
  let loading = false;
  let passwordsMatch = true;

  // 处理表单提交
  async function handleRegister() {
    // 重置错误
    error = '';
    
    // 验证密码匹配
    if (password !== confirmPassword) {
      passwordsMatch = false;
      error = '密码不匹配';
      return;
    }
    
    passwordsMatch = true;
    loading = true;

    try {
      // 使用Supabase注册用户
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (signUpError) throw signUpError;

      // 注册成功
      if (data) {
        // 注意：根据Supabase设置，可能需要验证电子邮件
        goto('/dashboard');
      }
    } catch (err) {
      console.error('注册错误:', err);
      error = err.message || '注册过程中出现错误';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>注册 - 房产经纪人服务</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        创建您的账户
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        或
        <a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
          已有账户？登录
        </a>
      </p>
    </div>
    
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleRegister}>
      <div class="rounded-md shadow-sm -space-y-px">
        <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div>
            <label for="first-name" class="sr-only">名字</label>
            <input
              id="first-name"
              name="first-name"
              type="text"
              required
              bind:value={firstName}
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md sm:rounded-tr-none sm:rounded-tl-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="名字"
            />
          </div>
          
          <div>
            <label for="last-name" class="sr-only">姓氏</label>
            <input
              id="last-name"
              name="last-name"
              type="text"
              required
              bind:value={lastName}
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:rounded-tr-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="姓氏"
            />
          </div>
        </div>
        
        <div>
          <label for="email-address" class="sr-only">电子邮件地址</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autocomplete="email"
            required
            bind:value={email}
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="电子邮件地址"
          />
        </div>
        
        <div>
          <label for="password" class="sr-only">密码</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="new-password"
            required
            bind:value={password}
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="密码"
            minlength="6"
          />
        </div>
        
        <div>
          <label for="confirm-password" class="sr-only">确认密码</label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autocomplete="new-password"
            required
            bind:value={confirmPassword}
            class={`appearance-none rounded-none relative block w-full px-3 py-2 border ${!passwordsMatch ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
            placeholder="确认密码"
            minlength="6"
          />
        </div>
      </div>

      {#if error}
        <div class="text-red-500 text-sm text-center">{error}</div>
      {/if}

      <div>
        <button
          type="submit"
          disabled={loading}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if loading}
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            注册中...
          {:else}
            注册
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>