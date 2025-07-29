<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/common/Button.svelte';
  import Input from '$lib/components/common/Input.svelte';
  import ListingListPublic from '$lib/components/listings/ListingListPublic.svelte';
  import MapboxMap from '$lib/components/MapboxMap.svelte';
  import { PUBLIC_MAPBOX_API_KEY } from '$env/static/public';

  export let data;

  $: ({ listings, pagination, filters, filterOptions } = data);

  // Filter form state
  let searchForm = {
    search: data.filters.search || '',
    type: data.filters.type || '',
    location: data.filters.location || '',
    minPrice: data.filters.minPrice || '',
    maxPrice: data.filters.maxPrice || '',
    bedrooms: data.filters.bedrooms || '',
    bathrooms: data.filters.bathrooms || ''
  };

  let showFilters = false;

  // Handle filter form submission
  function handleFilterSubmit() {
    const params = new URLSearchParams();
    
    // Add non-empty filters to URL params
    Object.entries(searchForm).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        params.set(key, value.toString());
      }
    });

    // Reset to page 1 when filtering
    params.set('page', '1');

    // Navigate with new filters
    goto(`/listings?${params.toString()}`);
  }

  // Clear all filters
  function clearFilters() {
    searchForm = {
      search: '',
      type: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: ''
    };
  }
</script>

<div class="listings-container">
  <MapboxMap accessToken={PUBLIC_MAPBOX_API_KEY} {listings} />
  <div class="filters">
    <form on:submit|preventDefault={handleFilterSubmit}>
      <Input
        type="text"
        bind:value={searchForm.search}
        placeholder="Search by address or MLS#"
      />
      <Button type="submit">Search</Button>
      <Button type="button" on:click={clearFilters}>Clear Filters</Button>
    </form>
  </div>
  <ListingListPublic {listings} {pagination} />
</div>

<style>
  .listings-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .filters {
    margin-bottom: 1rem;
  }
</style>