<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Button from '$lib/components/common/Button.svelte';
  import Input from '$lib/components/common/Input.svelte';
  import ListingListPublic from '$lib/components/listings/ListingListPublic.svelte';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
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

  // Initialize Mapbox
  onMount(() => {
    mapboxgl.accessToken = PUBLIC_MAPBOX_API_KEY;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40], // Default center (adjust as needed)
      zoom: 9
    });

    // Collect coordinates for bounds calculation
    const coordinates = listings
      .filter(listing => listing.latitude && listing.longitude)
      .map(listing => [listing.longitude, listing.latitude]);

    // Add markers for each listing
    listings.forEach(listing => {
      if (listing.latitude && listing.longitude) {
        new mapboxgl.Marker()
          .setLngLat([listing.longitude, listing.latitude])
          .addTo(map);
      }
    });

    // Fit map to bounds if there are coordinates
    if (coordinates.length > 0) {
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      map.fitBounds(bounds, {
        padding: 50, // Add padding to avoid markers touching the edges
        maxZoom: 15 // Optional: Limit maximum zoom level
      });
    }
  });

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
  <div id="map" class="map-container"></div>
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

  .map-container {
    height: 400px;
    width: 100%;
    margin-bottom: 1rem;
  }

  .filters {
    margin-bottom: 1rem;
  }
</style>