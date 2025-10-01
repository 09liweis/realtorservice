<script lang="ts">
  import Link from "../Link.svelte";
  import { fade, fly, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { quintOut, elasticOut } from 'svelte/easing';
    import { formatDate } from "$lib/helper";
    import { DASHBOARD_OPENHOUSES_URL } from "$lib/types/constant";

  export let openHouses: any[] = [];
  export let handleEdit;
  export let handleDelete;
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {#each openHouses as house, i (house.id)}
    <div 
      class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:scale-[1.02]"
      in:fly={{ y: 20, duration: 400, delay: i * 100, easing: quintOut }}
      out:fade={{ duration: 300 }}
      animate:flip={{ duration: 400 }}
    >
      <!-- Header with address -->
      <div class="p-5 border-b border-gray-100">
        <Link 
          href={`${DASHBOARD_OPENHOUSES_URL}/${house.id}`} 
          className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200"
        >
          {house.address}
        </Link>
      </div>
      
      <!-- Content area -->
      <div class="p-5">
        <p class="text-sm font-medium text-gray-700">
          {formatDate(house.date)}
        </p>
        <p class="text-sm font-medium text-gray-700">
          {house.openhouse_guests?.length || 0} guests
        </p>
      </div>
      
      <!-- Action buttons -->
      <div class="px-5 py-4 bg-gray-50 flex justify-end space-x-4 border-t border-gray-100">
        <Link 
          href={`${DASHBOARD_OPENHOUSES_URL}/${house.id}`}>
          View
        </Link>
        <button
          on:click={() => handleEdit(house)}
          class="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-all duration-300 hover:scale-105"
          in:scale={{ delay: 300, duration: 200, easing: elasticOut }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4 mr-1 transition-transform duration-300 hover:rotate-12" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit
        </button>
        <button
          on:click={() => handleDelete(house.id, house.address)}
          class="text-sm font-medium text-red-500 hover:text-red-700 flex items-center transition-all duration-300 hover:scale-105"
          in:scale={{ delay: 400, duration: 200, easing: elasticOut }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4 mr-1 transition-transform duration-300 hover:rotate-12" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  {:else}
    <div 
      class="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm"
      in:fade={{ duration: 400, delay: 200 }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-12 w-12 text-gray-300 mb-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        in:scale={{ duration: 600, delay: 400, easing: elasticOut, start: 0.5 }}
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <p 
        class="text-gray-500 font-medium"
        in:fly={{ y: 10, duration: 400, delay: 600 }}
      >
        No open houses found
      </p>
      <p 
        class="text-gray-400 text-sm mt-1"
        in:fly={{ y: 10, duration: 400, delay: 700 }}
      >
        Create a new open house to get started
      </p>
    </div>
  {/each}
</div>