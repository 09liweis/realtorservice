<script lang="ts">
  export let listings: any[];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each listings as listing}
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={listing.image_url || 'https://via.placeholder.com/300'}
        alt={listing.title}
        class="w-full h-48 object-cover"
      />
      <div class="p-4">
        <h3 class="text-lg font-semibold">{listing.title}</h3>
        <p class="text-gray-600">{listing.address}</p>
        <p class="text-gray-800 font-bold mt-2">${listing.price}</p>
      </div>
    </div>
  {/each}
</div>