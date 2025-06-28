<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { SocialMediaAccount } from '$lib/types/social';
  import { SocialMediaPlatform } from '$lib/types/social';
  import Button from '$lib/components/Button.svelte';

  export let account: SocialMediaAccount | undefined = undefined;
  export let onSubmit: (account: SocialMediaAccount) => void;
  export let onCancel: () => void;

  const dispatch = createEventDispatcher();

  // 初始化表单数据
  let formData: SocialMediaAccount = account
    ? { ...account }
    : {
        platform: SocialMediaPlatform.FACEBOOK,
        accountName: '',
        accountUrl: ''
      };

  // 平台选项
  const platformOptions = Object.values(SocialMediaPlatform);

  // 表单验证
  let errors: Record<string, string> = {};

  function validateForm(): boolean {
    errors = {};

    if (!formData.platform) {
      errors.platform = '请选择平台';
    }

    if (!formData.accountName) {
      errors.accountName = '请输入账户名称';
    }

    if (!formData.accountUrl) {
      errors.accountUrl = '请输入账户链接';
    } else if (!isValidUrl(formData.accountUrl)) {
      errors.accountUrl = '请输入有效的URL';
    }

    return Object.keys(errors).length === 0;
  }

  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  function handleSubmit() {
    if (validateForm()) {
      onSubmit(formData);
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <div>
    <label for="platform" class="block text-sm font-medium text-gray-700 mb-1">平台</label>
    <select
      id="platform"
      bind:value={formData.platform}
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    >
      {#each platformOptions as platform}
        <option value={platform}>{platform}</option>
      {/each}
    </select>
    {#if errors.platform}
      <p class="mt-1 text-sm text-red-600">{errors.platform}</p>
    {/if}
  </div>

  <div>
    <label for="accountName" class="block text-sm font-medium text-gray-700 mb-1">账户名称</label>
    <input
      type="text"
      id="accountName"
      bind:value={formData.accountName}
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      placeholder="例如：John Doe"
    />
    {#if errors.accountName}
      <p class="mt-1 text-sm text-red-600">{errors.accountName}</p>
    {/if}
  </div>

  <div>
    <label for="accountUrl" class="block text-sm font-medium text-gray-700 mb-1">账户链接</label>
    <input
      type="text"
      id="accountUrl"
      bind:value={formData.accountUrl}
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      placeholder="https://example.com/profile"
    />
    {#if errors.accountUrl}
      <p class="mt-1 text-sm text-red-600">{errors.accountUrl}</p>
    {/if}
  </div>

  <div class="flex justify-end space-x-3 pt-2">
    <Button type="button" variant="outline" on:click={onCancel}>
      取消
    </Button>
    <Button type="submit">
      {account ? '更新' : '添加'}
    </Button>
  </div>
</form>