<script lang="ts">
    import type { Listing } from "$lib/types/listing";

  export let listing: Listing;
</script>
<div class="flex items-center space-x-2 text-gray-600">
  {#if listing.bedroom}
    <div class="flex items-center space-x-1">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4l2 2 4-4"></path>
      </svg>
      <span class="text-lg font-medium">{listing.bedroom}</span>
      <span class="text-sm">bed</span>
    </div>
  {/if}
  {#if listing.bathroom}
    <div class="flex items-center space-x-1">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
      </svg>
      <span class="text-lg font-medium">{listing.bathroom}</span>
      <span class="text-sm">bath</span>
    </div>
  {/if}
  {#if listing.size}
    <div class="flex items-center space-x-1">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
      </svg>
      <span class="text-lg font-medium">{listing.size}</span>
      <span class="text-sm">sqft</span>
    </div>
  {/if}
</div>