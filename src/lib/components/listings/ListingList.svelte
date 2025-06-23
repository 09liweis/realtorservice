<script lang="ts">
  import type { Listing } from "$lib/types/listing";
  import ListingCard from "./ListingCard.svelte";

  export let listings: Array<Listing> = [];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
{#each listings as listing}
  <ListingCard {listing} />
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