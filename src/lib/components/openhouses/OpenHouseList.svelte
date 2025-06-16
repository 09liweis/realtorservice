<script lang="ts">
  export let openHouses:any[] = [];
  export let handleEdit;
  export let handleDelete;
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {#each openHouses as house (house.id)}
    <div class="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <h3 class="text-lg font-medium text-gray-900 truncate">{house.address}</h3>
      </div>
      
      <div class="p-4">
        <div class="flex items-center mb-3">
          <div class="flex-shrink-0 text-blue-500 mr-2">
            📅
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">
              {new Date(house.date).toLocaleDateString('en-CA', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        
      </div>
      
      <div class="px-4 py-3 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
        <button
          onclick={() => handleEdit(house)}
          class="text-sm text-blue-600 hover:text-blue-900 flex items-center"
        >
          <span class="mr-1">✏️</span> Edit
        </button>
        <button
          onclick={() => handleDelete(house.id)}
          class="text-sm text-red-600 hover:text-red-900 flex items-center"
        >
          <span class="mr-1">🗑️</span> Delete
        </button>
      </div>
    </div>
  {:else}
    <div class="col-span-full text-center py-12 bg-white rounded-lg">
      <p class="text-gray-500">No open houses found</p>
    </div>
  {/each}
</div>