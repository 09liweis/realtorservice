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

<SocialMediaServiceManager />