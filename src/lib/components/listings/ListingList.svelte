<script lang="ts">
  import type { Listing } from "$lib/types/listing";

export let listings: Array<Listing> = [];

// Get the first image from the pictures string
function getFirstImage(pictures: string): string {
  if (!pictures) return '/placeholder-property.jpg';
  const imageUrls = pictures.split(',').filter(url => url.trim());
  return imageUrls.length > 0 ? imageUrls[0].trim() : '/placeholder-property.jpg';
}

// Get image count
function getImageCount(pictures: string): number {
  if (!pictures) return 0;
  return pictures.split(',').filter(url => url.trim()).length;
}
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{#each listings as listing}
  <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
    <!-- Property Image with Sold Badge and Image Count -->
    <div class="relative h-48 bg-gray-200 overflow-hidden">
      <img 
        src={getFirstImage(listing.pictures)} 
        alt={listing.project_name}
        class="w-full h-full object-cover"
        loading="lazy"
      />
      {#if listing.is_sold}
        <div class="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          SOLD
        </div>
      {/if}
      {#if getImageCount(listing.pictures) > 1}
        <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          📷 {getImageCount(listing.pictures)}
        </div>
      {/if}
    </div>

    <!-- Property Details -->
    <div class="p-4">
      <div class="flex justify-between items-start mb-1">
        <div>
          <span class="text-xs font-semibold text-[#0d7377] uppercase">{listing.listing_type}</span>
          <h3 class="text-lg font-semibold text-gray-800">{listing.project_name}</h3>
          <p class="text-sm text-gray-500">{listing.developer}</p>
        </div>
        <div class="text-right">
          <span class="text-lg font-bold text-[#0d7377]">${listing.asking_price}</span>
          {#if listing.original_price && listing.original_price !== listing.asking_price}
            <span class="block text-xs text-gray-400 line-through">${listing.original_price}</span>
          {/if}
        </div>
      </div>

      <p class="text-sm text-gray-600 mb-2">{listing.address}, {listing.location}</p>
      <p class="text-sm text-gray-600 mb-3 line-clamp-2">{listing.description}</p>

      <!-- Property Features -->
      <div class="grid grid-cols-2 gap-2 text-sm text-gray-600 border-t pt-3">
        <div><span class="font-medium">Type:</span> {listing.ptype}</div>
        <div><span class="font-medium">Bedrooms:</span> {listing.bedroom}</div>
        <div><span class="font-medium">Bathrooms:</span> {listing.bathroom}</div>
        <div><span class="font-medium">Level:</span> {listing.level}</div>
        <div><span class="font-medium">Size:</span> {listing.size} sqft</div>
        <div><span class="font-medium">Parking:</span> {listing.parking}</div>
      </div>

      <!-- Additional Info -->
      <div class="flex justify-between text-xs text-gray-500 mt-2">
        <span>Occupancy: {listing.occupancy}</span>
        <span>Deposit: {listing.deposit_paid}</span>
      </div>
    </div>
  </div>
{/each}
</div>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>