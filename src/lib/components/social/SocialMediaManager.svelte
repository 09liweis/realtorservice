<script lang="ts">
  import { onMount } from 'svelte';
  import { getUserSocialMedia, upsertSocialMediaAccount, deleteSocialMediaAccount } from '$lib/supabase';
  import type { SocialMediaAccount } from '$lib/types/social';
  import SocialMediaForm from './SocialMediaForm.svelte';
  import SocialMediaList from './SocialMediaList.svelte';
  import Button from '$lib/components/Button.svelte';

  export let userId: string;

  let accounts: SocialMediaAccount[] = [];
  let isFormVisible = false;
  let editingIndex: number | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    await loadAccounts();
  });

  async function loadAccounts() {
    loading = true;
    error = null;
    try {
      const { data, error: err } = await getUserSocialMedia(userId);
      if (err) throw err;
      accounts = data || [];
    } catch (err) {
      error = '加载社交媒体账户时出错';
      console.error('Error loading social media accounts:', err);
    } finally {
      loading = false;
    }
  }

  async function handleSubmit(account: SocialMediaAccount) {
    error = null;
    try {
      const accountToSave = {
        ...account,
        user_id: userId
      };

      if (editingIndex !== null && accounts[editingIndex]?.id) {
        accountToSave.id = accounts[editingIndex].id;
      }

      const { error: err } = await upsertSocialMediaAccount(accountToSave);
      if (err) throw err;

      await loadAccounts();
      isFormVisible = false;
      editingIndex = null;
    } catch (err) {
      error = '保存社交媒体账户时出错';
      console.error('Error saving social media account:', err);
    }
  }

  async function handleDelete(index: number) {
    if (!confirm('确定要删除这个社交媒体账户吗？')) return;

    error = null;
    const accountId = accounts[index]?.id;
    if (!accountId) return;

    try {
      const { error: err } = await deleteSocialMediaAccount(accountId);
      if (err) throw err;
      await loadAccounts();
    } catch (err) {
      error = '删除社交媒体账户时出错';
      console.error('Error deleting social media account:', err);
    }
  }

  function handleEdit(index: number) {
    editingIndex = index;
    isFormVisible = true;
  }

  function handleCancel() {
    isFormVisible = false;
    editingIndex = null;
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h2 class="text-2xl font-semibold">社交媒体账户</h2>
    {#if !isFormVisible}
      <Button on:click={() => isFormVisible = true}>
        添加账户
      </Button>
    {/if}
  </div>

  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
      <p>{error}</p>
    </div>
  {/if}

  {#if loading}
    <div class="text-center py-8">
      <p>加载中...</p>
    </div>
  {:else}
    {#if isFormVisible}
      <div class="bg-gray-50 p-6 rounded-lg">
        <SocialMediaForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          account={editingIndex !== null ? accounts[editingIndex] : undefined}
        />
      </div>
    {/if}

    <SocialMediaList
      {accounts}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  {/if}
</div>