<script lang="ts">
  import type { Listing } from "$lib/types/listing";
  import { fade, fly, scale } from 'svelte/transition';
  export let listing: Listing;
</script>

{#if listing.listing_type}
  <div 
    class="absolute top-3 left-3 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg"
    in:fly={{ x: -20, duration: 300, delay: 200 }}
  >
    {listing.listing_type.split('_').join(' ')}
  </div>
{/if}