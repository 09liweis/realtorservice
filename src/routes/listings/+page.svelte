<script lang="ts">
  import { page } from '$app/stores';
  import ListingListPublic from '$lib/components/listings/ListingListPublic.svelte';
  import MapboxMap from '$lib/components/MapboxMap.svelte';
  import { PUBLIC_MAPBOX_API_KEY } from '$env/static/public';

  export let data;

  $: ({ listings, pagination, filters, filterOptions } = data);
</script>

<div class="max-w-7xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 gap-4">
  <MapboxMap accessToken={PUBLIC_MAPBOX_API_KEY} {listings} />
  <ListingListPublic {listings} />
</div>