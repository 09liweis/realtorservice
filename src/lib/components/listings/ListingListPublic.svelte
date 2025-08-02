<script lang="ts">
  import type { Listing } from "$lib/types/listing";
  import Link from "../Link.svelte";

  export let listings: Array<Listing> = [];
</script>

<div class="space-y-3">
{#each listings as listing (listing.id)}
  <Link href={`/listings/${listing.id}`} className="justify-between p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow">
    <div class="inline-flex flex-col">
      <span class="text-blue-500 text-sm font-medium bg-blue-50 px-2 py-1 rounded">{listing.listing_type}</span>
      <div class="font-medium text-lg mb-2">{listing.address}</div>
    </div>
    
    <span class="text-green-500 font-semibold">${listing.asking_price}</span>
  </Link>
{/each}
</div>