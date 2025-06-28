<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { SocialMediaAccount } from '$lib/types/social';
  import { SocialMediaPlatform } from '$lib/types/social';
  import Button from '$lib/components/Button.svelte';

  export let account: SocialMediaAccount | undefined = undefined;
  export let onSubmit: (account: SocialMediaAccount) => void;
  export let onCancel: () => void;

  const dispatch = createEventDispatcher();

  // Initialize form data
  let formData: SocialMediaAccount = account
    ? { ...account }
    : {
        platform: SocialMediaPlatform.FACEBOOK,
        accountName: '',
        accountUrl: ''
      };

  // Platform options
  const platformOptions = Object.values(SocialMediaPlatform);

  // Form validation
  let errors: Record<string, string> = {};

  function validateForm(): boolean {
    errors = {};

    if (!formData.platform) {
      errors.platform = 'Please select a platform';
    }

    if (!formData.accountName) {
      errors.accountName = 'Please enter account name';
    }

    if (!formData.accountUrl) {
      errors.accountUrl = 'Please enter account URL';
    } else if (!isValidUrl(formData.accountUrl)) {
      errors.accountUrl = 'Please enter a valid URL';
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
    <label for="platform" class="block text-sm font-medium text-gray-700 mb-1">Platform</label>
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
    <label for="accountName" class="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
    <input
      type="text"
      id="accountName"
      bind:value={formData.accountName}
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      placeholder="e.g., John Doe"
    />
    {#if errors.accountName}
      <p class="mt-1 text-sm text-red-600">{errors.accountName}</p>
    {/if}
  </div>

  <div>
    <label for="accountUrl" class="block text-sm font-medium text-gray-700 mb-1">Account URL</label>
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
    <Button type="button" variant="outline" onclick={onCancel}>
      Cancel
    </Button>
    <Button type="submit">
      {account ? 'Update' : 'Add'}
    </Button>
  </div>
</form>