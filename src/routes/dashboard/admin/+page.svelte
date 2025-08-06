<script lang="ts">
  import UserTable from '$lib/components/admin/UserTable.svelte';
  import StagingScreen from '$lib/components/stagings/StagingScreen.svelte';
  import CouponManager from '$lib/components/admin/CouponManager.svelte';
  import CleaningScreen from '$lib/components/cleanings/CleaningScreen.svelte';
  import VideoServiceManager from '$lib/components/video/VideoServiceManager.svelte';
  import SocialMediaServiceManager from '$lib/components/social/SocialMediaServiceManager.svelte';
    import { sendRequest } from '$lib/helper';

  // Tab management
  type Tab = 'users' | 'stagings' | 'coupons' | 'cleanings' | 'videos' | 'social';
  let activeTab: Tab = 'users';
  
  // Tab configuration using array of objects
  const tabs = [
    {
      id: 'users' as Tab,
      label: 'Users',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
    },
    {
      id: 'coupons' as Tab,
      label: 'Coupons',
      icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
    },
    // {
    //   id: 'stagings' as Tab,
    //   label: 'Stagings',
    //   icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
    // },
    // {
    //   id: 'cleanings' as Tab,
    //   label: 'Cleanings',
    //   icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
    // },
    // {
    //   id: 'videos' as Tab,
    //   label: 'Video Services',
    //   icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
    // },
    // {
    //   id: 'social' as Tab,
    //   label: 'Social Media',
    //   icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
    // }
  ];
  
  const setActiveTab = (tab: Tab) => {
    activeTab = tab;
  };

  let loading = false;
  let error: string | null = null;
  let users: any[] = [];

  const loadAdminData = async () => {
    try {
      loading = true;
      const {data} = await sendRequest({
        url: '/api/dashboard/users',
        method: 'GET'
      })
      if (data.error) throw data.error;
      users = data.users || [];

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
        {#each tabs as tab}
          <button
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            on:click={() => setActiveTab(tab.id)}
          >
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={tab.icon}></path>
              </svg>
              <span>{tab.label}</span>
            </div>
          </button>
        {/each}
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
      {:else if activeTab === 'cleanings'}
        <CleaningScreen />
      {:else if activeTab === 'coupons'}
        <CouponManager />
      {:else if activeTab === 'videos'}
        <VideoServiceManager />
      {:else if activeTab === 'social'}
        <SocialMediaServiceManager />
      {/if}
    </div>
  {/if}
</div>