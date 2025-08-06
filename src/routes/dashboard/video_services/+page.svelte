<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/auth';
  import VideoServiceManager from '$lib/components/video/VideoServiceManager.svelte';
  import { getPageTitle } from '$lib/types/constant';

  onMount(async () => {
    // Any initialization logic can go here
  });
</script>

<svelte:head>
  <title>{getPageTitle('Video Editing Services')}</title>
</svelte:head>

{#if $user?.id}
  <VideoServiceManager userId={$user.id} />
{:else}
  <div class="flex items-center justify-center py-12">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading...</p>
    </div>
  </div>
{/if}