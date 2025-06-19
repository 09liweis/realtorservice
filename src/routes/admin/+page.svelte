<script lang="ts">
  import { getUserProfiles } from '$lib/supabase';
  import UserTable from '$lib/components/admin/UserTable.svelte';

  let loading = true;
  let error: string | null = null;
  let users: any[] = [];

  const loadUsers = async () => {
    try {
      loading = true;
      const { data, error: supabaseError } = await getUserProfiles();
      if (supabaseError) throw supabaseError;
      users = data || [];
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load users';
    } finally {
      loading = false;
    }
  };

  loadUsers();
</script>

<div class="bg-white shadow rounded-lg p-6">
  <h1 class="text-2xl font-bold text-gray-900 mb-6">User Management</h1>

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
      on:click={loadUsers}
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Retry
    </button>
  {:else}
    <UserTable {users} />
  {/if}
</div>