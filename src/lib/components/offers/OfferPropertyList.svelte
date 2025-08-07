<script lang="ts">
    import { formatAmount, getStatusStyle } from "$lib/types/constant";
    import Link from "../Link.svelte";
    import { fade, fly, slide } from "svelte/transition";
    import { flip } from 'svelte/animate';

  export let offerProperties;
  export let handleClick;

</script>

<!-- offerProperties Grid -->
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {#each offerProperties as offerProperty (offerProperty.id)}
    <div 
      class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
      animate:flip={{ duration: 300 }}
      in:fly={{ y: 20, duration: 300, delay: 100 }}
      out:fade={{ duration: 200 }}
    >
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900 truncate">{offerProperty.address}</h3>
          </div>
          <span
            class={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(
              offerProperty.status
            )}`}
          >
            {offerProperty.status}
          </span>
        </div>
        
        <div class="mt-4 space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Amount</span>
            <span class="text-sm font-medium text-gray-900">{formatAmount(offerProperty.asking_price)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Submitted</span>
            <span class="text-sm text-gray-900">{offerProperty.date}</span>
          </div>
        </div>

        <div class="mt-6 text-right">
          <Link
            href={`/dashboard/offers/${offerProperty.id}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  {:else}
    <div 
      class="col-span-full text-center py-12 bg-white rounded-lg"
      in:fade={{ duration: 300, delay: 150 }}
    >
      <p class="text-gray-500">No offers found</p>
    </div>
  {/each}
</div>