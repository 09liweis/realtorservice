<script lang="ts">
  import { onMount } from 'svelte';
  import VideoServiceManager from '$lib/components/video/VideoServiceManager.svelte';
  import { getPageTitle } from '$lib/types/constant';

  onMount(async () => {
    // Any initialization logic can go here
  });
</script>

<svelte:head>
  <title>{getPageTitle('Video Editing Services')}</title>
</svelte:head>

<VideoServiceManager />