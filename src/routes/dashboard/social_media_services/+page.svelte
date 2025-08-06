<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/auth';
  import { getPageTitle } from '$lib/types/constant';
  import SocialMediaServiceManager from '$lib/components/social/SocialMediaServiceManager.svelte';

  onMount(async () => {
    // Any initialization logic can go here
  });
</script>

<svelte:head>
  <title>{getPageTitle('Social Media Management')}</title>
</svelte:head>

{#if $user?.id}
  <SocialMediaServiceManager userId={$user.id} />
{:else}
  <div class="flex items-center justify-center py-12">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading...</p>
    </div>
  </div>
{/if}