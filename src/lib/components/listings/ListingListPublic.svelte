<script lang="ts">
  import type { Listing } from "$lib/types/listing";
  import Link from "../Link.svelte";

  export let listings: Array<Listing> = [];
</script>

<div class="space-y-3">
{#each listings as listing (listing.id)}
  <Link href={`/listings/${listing.id}`} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm transition-shadow" hoverClass="hover:shadow-md">
    <span class="font-medium">{listing.address}</span>
    <span class="text-green-600 font-bold">${listing.asking_price}</span>
  </Link>
{/each}
</div>