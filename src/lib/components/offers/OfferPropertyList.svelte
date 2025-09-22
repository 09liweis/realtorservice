<script lang="ts">
    import { DASHBOARD_OFFERS_URL, formatAmount } from "$lib/types/constant";
    import Link from "../Link.svelte";
    import { fade, fly, slide } from "svelte/transition";
    import { flip } from 'svelte/animate';

  export let offerProperties;
  export let handleClick;
  export let handleEdit;
  export let handleDelete;

</script>

<!-- offerProperties Grid -->
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {#each offerProperties as offerProperty (offerProperty.id)}
    <div 
      class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200 hover:scale-[1.02] transform transition-transform duration-200 ease-in-out"
      animate:flip={{ duration: 300 }}
      in:fly={{ y: 20, duration: 300, delay: 100 }}
      out:fade={{ duration: 200 }}
    >
      <div class="p-6">
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-900 truncate hover:text-blue-600 transition-colors duration-200">{offerProperty.address}</h3>
        </div>
        
        <div class="mt-4 space-y-3">
          <div class="flex justify-between hover:bg-gray-50 p-2 rounded transition-colors duration-200">
            <span class="text-sm text-gray-500">Amount</span>
            <span class="text-sm font-medium text-gray-900">{formatAmount(offerProperty.asking_price)}</span>
          </div>
          <div class="flex justify-between hover:bg-gray-50 p-2 rounded transition-colors duration-200">
            <span class="text-sm text-gray-500">Submitted</span>
            <span class="text-sm text-gray-900">{offerProperty.date}</span>
          </div>
          <div class="flex justify-between hover:bg-gray-50 p-2 rounded transition-colors duration-200">
            <span class="text-sm text-gray-500">Number of offers</span>
            <span class="text-sm text-gray-900">{offerProperty.offers.length}</span>
          </div>
        </div>

        <div class="mt-6 flex justify-between">
          <div class="space-x-2">
            <button
              on:click={() => handleEdit(offerProperty)}
              class="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Edit
            </button>
            <button
              on:click={() => handleDelete(offerProperty.id)}
              class="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 cursor-pointer"
            >
              Delete
            </button>
          </div>
          <Link
            href={`${DASHBOARD_OFFERS_URL}/${offerProperty.id}`}
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
      <p class="text-gray-500">No Properties found</p>
    </div>
  {/each}
</div>