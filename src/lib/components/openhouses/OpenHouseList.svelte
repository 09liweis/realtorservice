<script lang="ts">
  import Link from "../Link.svelte";

  export let openHouses: any[] = [];
  export let handleEdit;
  export let handleDelete;
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {#each openHouses as house (house.id)}
    <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <!-- Header with address -->
      <div class="p-5 border-b border-gray-100">
        <Link 
          href={`/dashboard/openhouses/${house.id}`} 
          className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200"
        >
          {house.address}
        </Link>
      </div>
      
      <!-- Content area -->
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0 text-blue-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-700">
              {new Date(house.date).toLocaleDateString('en-CA', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Action buttons -->
      <div class="px-5 py-4 bg-gray-50 flex justify-end space-x-4 border-t border-gray-100">
        <button
          on:click={() => handleEdit(house)}
          class="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit
        </button>
        <button
          on:click={() => handleDelete(house.id)}
          class="text-sm font-medium text-red-500 hover:text-red-700 flex items-center transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  {:else}
    <div class="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <p class="text-gray-500 font-medium">No open houses found</p>
      <p class="text-gray-400 text-sm mt-1">Create a new open house to get started</p>
    </div>
  {/each}
</div>