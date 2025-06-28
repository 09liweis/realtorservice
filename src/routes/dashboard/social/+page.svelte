<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/auth';
  import SocialMediaManager from '$lib/components/social/SocialMediaManager.svelte';

  onMount(async () => {
    
  });
</script>

<SocialMediaManager userId={$user.id} />