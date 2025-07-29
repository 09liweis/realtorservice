<script lang="ts">
  import { onMount } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import type { Listing } from '$lib/types/listing';

  export let accessToken: string;
  export let listings: Listing[] = [];

  onMount(() => {
    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40], // Default center
      zoom: 9
    });

    // Add markers
    listings.forEach(listing => {
      if (listing.latitude && listing.longitude) {
        const markerColor = listing.listing_type === 'Assignment Sale' ? '#FF5733' : '#3399FF';
        new mapboxgl.Marker({ color: markerColor })
          .setLngLat([listing.longitude, listing.latitude])
          .addTo(map);
      }
    });

    // Fit bounds
    const coordinates = listings
      .filter(listing => listing.latitude && listing.longitude)
      .map(listing => [listing.longitude, listing.latitude]);

    if (coordinates.length > 0) {
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  });
</script>

<div id="map" class="aspect-square h-[500px] w-full"></div>

<style>
</style>