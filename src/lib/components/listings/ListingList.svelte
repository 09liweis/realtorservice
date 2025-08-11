<script lang="ts">
  import type { Listing } from "$lib/types/listing";
  import ListingCard from "./ListingCard.svelte";
  import { fade, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  export let listings: Array<Listing> = [];
  export let editListing: (listing: Listing) => void;
  export let deleteListing: (id: string) => void;
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
{#each listings as listing (listing.id)}
  <div
    in:fly={{ y: 20, duration: 400, delay: 200 }}
    out:fade={{ duration: 300 }}
    animate:flip={{ duration: 300 }}
  >
    <ListingCard {listing} editListing={editListing} deleteListing={deleteListing} />
  </div>
{/each}
</div>

<style>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>