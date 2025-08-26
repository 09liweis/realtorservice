<script lang="ts">
  import type { Listing } from "$lib/types/listing";
  import { fade, fly, scale } from 'svelte/transition';
    import ListingType from "./ListingType.svelte";

  export let listing: Listing;

  const DEFAUTL_IMAGE = 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800';

  // Get the first image from the pictures string
  function getFirstImage(pictures: string): string {
    if (!pictures) return DEFAUTL_IMAGE;
    const imageUrls = pictures.split(',').filter(url => url.trim());
    return imageUrls.length > 0 ? imageUrls[0].trim() : DEFAUTL_IMAGE;
  }

  // Get image count
  function getImageCount(pictures: string): number {
    if (!pictures) return 0;
    return pictures.split(',').filter(url => url.trim()).length;
  }


</script>
<img
  src={getFirstImage(listing?.pics||'')}
  alt={listing.project_name}
  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
  loading="lazy"
/>

<!-- Gradient Overlay -->
<div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

<!-- Listing Type Badge -->
<ListingType listing={listing} />

<!-- Image Count -->
{#if listing.pics && getImageCount(listing.pics) > 1}
  <div class="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 backdrop-blur-sm">
    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
    </svg>
    <span>{getImageCount(listing.pics)}</span>
  </div>
{/if}