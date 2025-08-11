<script lang="ts">
  import { formatAmount } from "$lib/types/constant";
  import type { Listing } from "$lib/types/listing";
  import Link from "$lib/components/Link.svelte";
  import { fade, fly, scale } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';
  import { user } from "$lib/stores/auth";

  export let listing: Listing;
  export let editListing: (listing: Listing) => void;
  export let deleteListing: (id: string) => ValidityState;

  // Get the first image from the pictures string
  function getFirstImage(pictures: string): string {
    if (!pictures) return 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800';
    const imageUrls = pictures.split(',').filter(url => url.trim());
    return imageUrls.length > 0 ? imageUrls[0].trim() : 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800';
  }

  // Get image count
  function getImageCount(pictures: string): number {
    if (!pictures) return 0;
    return pictures.split(',').filter(url => url.trim()).length;
  }

  // Format property features
  function formatFeatures(listing: Listing): string {
    const features = [];
    if (listing.bedroom) features.push(`${listing.bedroom} bed`);
    if (listing.bathroom) features.push(`${listing.bathroom} bath`);
    if (listing.size) features.push(`${listing.size} sqft`);
    return features.join(' • ');
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
  <!-- Property Image with Sold Badge and Image Count -->
  <Link href={`/listings/${listing.id}`} className="block">
    <div class="relative h-56 bg-gray-200 overflow-hidden">
      <img 
        src={getFirstImage(listing.pics)} 
        alt={listing.project_name}
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <!-- Listing Type Badge -->
      {#if listing.listing_type}
        <div 
          class="absolute top-3 left-3 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg"
          in:fly={{ x: -20, duration: 300, delay: 200 }}
        >
          {listing.listing_type}
        </div>
      {/if}
      
      <!-- Sold Badge -->
      {#if listing.is_sold}
        <div 
          class="absolute top-3 right-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg"
          in:scale={{ duration: 300, delay: 300, start: 0.8, easing: elasticOut }}
        >
          SOLD
        </div>
      {/if}
      
      <!-- Image Count -->
      {#if getImageCount(listing.pics) > 1}
        <div 
          class="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white px-2.5 py-1.5 rounded-lg text-xs flex items-center space-x-1 backdrop-blur-sm"
          in:fade={{ duration: 300, delay: 400 }}
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
          </svg>
          <span>{getImageCount(listing.pics)}</span>
        </div>
      {/if}
    </div>
  </Link>

  <!-- Property Details -->
  <div class="p-5">
    <!-- Price and Type -->
    <div class="flex justify-between items-start mb-4">
      <div in:fly={{ y: 20, duration: 400, delay: 200 }}>
        <div class="text-2xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-300">
          {formatAmount(listing.asking_price)}
        </div>
        {#if listing.original_price && listing.original_price !== listing.asking_price}
          <div class="text-sm text-gray-400 line-through">
            {formatAmount(listing.original_price)}
          </div>
        {/if}
      </div>
      {#if listing.ptype}
        <span 
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200"
          in:scale={{ duration: 300, delay: 300, easing: elasticOut }}
        >
          {listing.ptype}
        </span>
      {/if}
    </div>

    <!-- Project Name and Developer -->
    <div class="mb-4" in:fly={{ y: 15, duration: 400, delay: 250 }}>
      <h3 class="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-300">
        {listing.project_name}
      </h3>
      {#if listing.developer}
        <p class="text-sm text-gray-500 font-medium">by {listing.developer}</p>
      {/if}
    </div>

    <!-- Address -->
    <div class="flex items-start space-x-2 mb-4" in:fly={{ y: 15, duration: 400, delay: 300 }}>
      <svg class="w-4 h-4 text-gray-400 mt-1 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
      <div class="text-sm text-gray-600 line-clamp-2 leading-relaxed">
        {listing.address}{listing.location ? `, ${listing.location}` : ''}
      </div>
    </div>

    <!-- Property Features -->
    {#if formatFeatures(listing)}
      <div class="flex items-center space-x-2 mb-4" in:fly={{ y: 15, duration: 400, delay: 350 }}>
        <svg class="w-4 h-4 text-gray-400 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <span class="text-sm text-gray-600 font-medium">{formatFeatures(listing)}</span>
      </div>
    {/if}

    <!-- Description -->
    {#if listing.description}
      <p class="text-sm text-gray-600 mb-4 line-clamp-2" in:fly={{ y: 15, duration: 400, delay: 400 }}>
        {listing.description}
      </p>
    {/if}

    <!-- Additional Details -->
    <div class="border-t border-gray-100 pt-4 mt-4" in:fly={{ y: 15, duration: 400, delay: 450 }}>
      <div class="grid grid-cols-2 gap-3 text-xs text-gray-500">
        {#if listing.level}
          <div class="flex items-center space-x-1 transition-all duration-300 hover:text-gray-800">
            <span class="font-medium">Level:</span>
            <span>{listing.level}</span>
          </div>
        {/if}
        {#if listing.parking}
          <div class="flex items-center space-x-1 transition-all duration-300 hover:text-gray-800">
            <span class="font-medium">Parking:</span>
            <span>{listing.parking}</span>
          </div>
        {/if}
        {#if listing.exposure}
          <div class="flex items-center space-x-1 transition-all duration-300 hover:text-gray-800">
            <span class="font-medium">Exposure:</span>
            <span>{listing.exposure}</span>
          </div>
        {/if}
        {#if listing.occupancy}
          <div class="flex items-center space-x-1 transition-all duration-300 hover:text-gray-800">
            <span class="font-medium">Occupancy:</span>
            <span>{listing.occupancy}</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Edit Button -->
    {#if $user?.user_id === listing.user_id}
      <div class="border-t border-gray-100 pt-4 mt-4 flex justify-end" in:fly={{ y: 15, duration: 400, delay: 500 }}>
        <button 
          on:click={() => editListing(listing)}
          class="inline-flex items-center px-3 py-1.5 border border-primary text-xs font-medium rounded-lg text-primary bg-white hover:bg-primary hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-sm"
          in:scale={{ duration: 300, delay: 600, easing: elasticOut }}
        >
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Edit
        </button>
      </div>
    {/if}

    <!-- Contact Information -->
    {#if listing.user_profiles}
      <div class="border-t border-gray-100 pt-4 mt-4 bg-gray-50 -mx-5 px-5 pb-5" in:fly={{ y: 15, duration: 400, delay: 500 }}>
        <div class="flex items-center justify-between pt-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-sm">
              <span class="text-sm font-bold text-white">
                {listing.user_profiles.first_name?.charAt(0)}{listing.user_profiles.last_name?.charAt(0)}
              </span>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-900">
                {listing.user_profiles.first_name} {listing.user_profiles.last_name}
              </div>
              {#if listing.user_profiles.brokerage}
                <div class="text-xs text-gray-600 font-medium">{listing.user_profiles.brokerage}</div>
              {/if}
            </div>
          </div>
          {#if listing.user_profiles.phone}
            <a 
              href="tel:{listing.user_profiles.phone}"
              class="inline-flex items-center px-3 py-2 border border-primary text-xs font-semibold rounded-lg text-primary bg-white hover:bg-primary hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-sm"
              in:scale={{ duration: 300, delay: 600, easing: elasticOut }}
            >
              <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              Call
            </a>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
/* Enhanced hover effects */
.group:hover {
  transform: translateY(-8px);
}

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