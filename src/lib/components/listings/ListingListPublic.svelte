<script lang="ts">
  import type { Listing } from "$lib/types/listing";
  import Link from "../Link.svelte";

  export let listings: Array<Listing> = [];
</script>

<div class="space-y-2">
{#each listings as listing (listing.id)}
  <Link href={`/listings/${listing.id}`} className="flex justify-between items-center p-2 bg-gray-100 rounded">
    <span class="font-medium">{listing.address}</span>
    <span class="text-green-600 font-bold">${listing.asking_price}</span>
  </Link>
{/each}
</div>