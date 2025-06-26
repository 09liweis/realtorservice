<script lang="ts">
  import { formatAmount } from "$lib/types/constant";
  import type { Listing } from "$lib/types/listing";
  import Link from "$lib/components/Link.svelte";

  export let listing: Listing;

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

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
  <!-- Property Image with Sold Badge and Image Count -->
  <Link href={`/listings/${listing.id}`} className="block">
    <div class="relative h-64 bg-gray-200 overflow-hidden">
      <img 
        src={getFirstImage(listing.pics)} 
        alt={listing.project_name}
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      
      <!-- Listing Type Badge -->
      {#if listing.listing_type}
        <div class="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
          {listing.listing_type}
        </div>
      {/if}
      
      <!-- Sold Badge -->
      {#if listing.is_sold}
        <div class="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
          SOLD
        </div>
      {/if}
      
      <!-- Image Count -->
      {#if getImageCount(listing.pics) > 1}
        <div class="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
          </svg>
          <span>{getImageCount(listing.pics)}</span>
        </div>
      {/if}
    </div>
  </Link>

  <!-- Property Details -->
  <div class="p-6">
    <!-- Price and Type -->
    <div class="flex justify-between items-start mb-3">
      <div>
        <div class="text-2xl font-bold text-gray-900 mb-1">
          {formatAmount(listing.asking_price)}
        </div>
        {#if listing.original_price && listing.original_price !== listing.asking_price}
          <div class="text-sm text-gray-500 line-through">
            {formatAmount(listing.original_price)}
          </div>
        {/if}
      </div>
      {#if listing.ptype}
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {listing.ptype}
        </span>
      {/if}
    </div>

    <!-- Project Name and Developer -->
    <div class="mb-3">
      <h3 class="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
        {listing.project_name}
      </h3>
      {#if listing.developer}
        <p class="text-sm text-gray-600">by {listing.developer}</p>
      {/if}
    </div>

    <!-- Address -->
    <div class="flex items-start space-x-2 mb-3">
      <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
      <div class="text-sm text-gray-600 line-clamp-2">
        {listing.address}{listing.location ? `, ${listing.location}` : ''}
      </div>
    </div>

    <!-- Property Features -->
    {#if formatFeatures(listing)}
      <div class="flex items-center space-x-2 mb-4">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <span class="text-sm text-gray-600">{formatFeatures(listing)}</span>
      </div>
    {/if}

    <!-- Description -->
    {#if listing.description}
      <p class="text-sm text-gray-600 mb-4 line-clamp-2">
        {listing.description}
      </p>
    {/if}

    <!-- Additional Details -->
    <div class="border-t border-gray-100 pt-4">
      <div class="grid grid-cols-2 gap-3 text-xs text-gray-500">
        {#if listing.level}
          <div class="flex items-center space-x-1">
            <span class="font-medium">Level:</span>
            <span>{listing.level}</span>
          </div>
        {/if}
        {#if listing.parking}
          <div class="flex items-center space-x-1">
            <span class="font-medium">Parking:</span>
            <span>{listing.parking}</span>
          </div>
        {/if}
        {#if listing.exposure}
          <div class="flex items-center space-x-1">
            <span class="font-medium">Exposure:</span>
            <span>{listing.exposure}</span>
          </div>
        {/if}
        {#if listing.occupancy}
          <div class="flex items-center space-x-1">
            <span class="font-medium">Occupancy:</span>
            <span>{listing.occupancy}</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Contact Information -->
    {#if listing.user_profiles}
      <div class="border-t border-gray-100 pt-4 mt-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-xs font-semibold text-blue-600">
                {listing.user_profiles.first_name?.charAt(0)}{listing.user_profiles.last_name?.charAt(0)}
              </span>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900">
                {listing.user_profiles.first_name} {listing.user_profiles.last_name}
              </div>
              {#if listing.user_profiles.brokerage}
                <div class="text-xs text-gray-500">{listing.user_profiles.brokerage}</div>
              {/if}
            </div>
          </div>
          {#if listing.user_profiles.phone}
            <a 
              href="tel:{listing.user_profiles.phone}"
              class="inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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