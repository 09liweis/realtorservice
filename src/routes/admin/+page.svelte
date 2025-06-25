<script lang="ts">
  import { getAllStagings, getUserProfiles } from '$lib/supabase';
  import UserTable from '$lib/components/admin/UserTable.svelte';
  import type { Staging } from '$lib/types/staging';
  import StagingsList from '$lib/components/stagings/StagingsList.svelte';

  // Tab management
  type Tab = 'users' | 'stagings';
  let activeTab: Tab = 'users';
  
  const setActiveTab = (tab: Tab) => {
    activeTab = tab;
  };

  let loading = true;
  let error: string | null = null;
  let users: any[] = [];
  let stagings: Staging[] = [];

  const loadAdminData = async () => {
    try {
      loading = true;
      const { data, error: supabaseError } = await getUserProfiles();
      if (supabaseError) throw supabaseError;
      users = data || [];

      const { data: stagingData, error: stagingError } = await getAllStagings();
      if (stagingError) throw stagingError;
      stagings = stagingData || [];
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
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Retry
    </button>
  {:else}
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'stagings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => setActiveTab('stagings')}
        >
          Stagings
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
        <div class="tab-panel">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Staging Requests</h2>
          <StagingsList requests={stagings} {loading} />
        </div>
      {/if}
    </div>
  {/if}
</div>