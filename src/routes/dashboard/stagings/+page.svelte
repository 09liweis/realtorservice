<script lang="ts">
  import { StagingScreen } from "$lib/components/stagings";
    import { getPageTitle } from "$lib/types/constant";
</script>

<svelte:head>
  <title>{getPageTitle('Stagings Services')}</title>
</svelte:head>

<StagingScreen />