<script lang="ts">
  import { getAllStagings, getUserProfiles } from '$lib/supabase';
  import UserTable from '$lib/components/admin/UserTable.svelte';
  import type { Staging } from '$lib/types/staging';
  import StagingScreen from '$lib/components/stagings/StagingScreen.svelte';
  import CouponManager from '$lib/components/admin/CouponManager.svelte';

  // Tab management
  type Tab = 'users' | 'stagings' | 'coupons';
  let activeTab: Tab = 'users';
  
  const setActiveTab = (tab: Tab) => {
    activeTab = tab;
  };

  let loading = false;
  let error: string | null = null;
  let users: any[] = [];

  const loadAdminData = async () => {
    try {
      loading = true;
      const { data, error: supabaseError } = await getUserProfiles();
      if (supabaseError) throw supabaseError;
      users = data || [];

    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load admin data';
    } finally {
      loading = false;
    }
  };

  loadAdminData();
</script>

<div class="bg-white shadow rounded-lg p-6">
  <h1 class="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

  {#if loading}
    <div class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  {:else if error}
    <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div class="flex">
        <div class="text-red-700">{error}</div>
      </div>
    </div>
    <button
      on:click={loadAdminData}
      class="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 transition"
    >
      Retry
    </button>
  {:else}
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => setActiveTab('users')}
        >
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            <span>Users</span>
          </div>
        </button>
        <button
          class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {activeTab === 'stagings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => setActiveTab('stagings')}
        >
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
            </svg>
            <span>Stagings</span>
          </div>
        </button>
        <button
          class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {activeTab === 'coupons' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => setActiveTab('coupons')}
        >
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            <span>Coupons</span>
          </div>
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="mt-4">
      {#if activeTab === 'users'}
        <div class="tab-panel">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">User Management</h2>
          <UserTable {users} />
        </div>
      {:else if activeTab === 'stagings'}
        <StagingScreen />
      {:else if activeTab === 'coupons'}
        <CouponManager />
      {/if}
    </div>
  {/if}
</div>