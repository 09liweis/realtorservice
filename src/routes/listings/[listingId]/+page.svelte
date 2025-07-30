<script lang="ts">
  import { page } from "$app/stores";
  import { formatAmount } from "$lib/types/constant";
  import Link from "$lib/components/Link.svelte";
    import type { Listing } from "$lib/types/listing.js";

  export let data;

  const listing:Listing = data.listing;

  // Get all images from the pictures string
  function getImages(pictures: string): string[] {
    if (!pictures) return [];
    return pictures.split(",").filter((url) => url.trim());
  }

  // Format property features
  function formatFeatures(listing: any): string {
    const features = [];
    if (listing.bedroom) features.push(`${listing.bedroom} bed`);
    if (listing.bathroom) features.push(`${listing.bathroom} bath`);
    if (listing.size) features.push(`${listing.size} sqft`);
    return features.join(" • ");
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Back button -->
  <div class="mb-6">
    <Link
      href="/listings"
      className="flex items-center text-blue-600 hover:text-blue-800"
    >
      <svg
        class="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        ></path>
      </svg>
      Back to Listings
    </Link>
  </div>

  <!-- Property header -->
  <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
    <div class="p-6 border-b border-gray-200">
      <h1 class="text-3xl font-bold text-gray-900">{listing.project_name}</h1>
      <div class="flex items-center mt-2">
        <svg
          class="w-5 h-5 text-gray-400 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
        <span class="text-gray-600">
          {listing.address}{listing.location ? `, ${listing.location}` : ""}
        </span>
      </div>
    </div>

    <!-- Price and status -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div class="mb-4 md:mb-0">
          <div class="text-4xl font-bold text-gray-900">
            {formatAmount(listing.asking_price)}
          </div>
          {#if listing.original_price && listing.original_price !== listing.asking_price}
            <div class="text-lg text-gray-500 line-through">
              {formatAmount(listing.original_price)}
            </div>
          {/if}
        </div>
        <div class="flex space-x-6">
          <div class="text-center">
            <div class="text-sm text-gray-500">Bedrooms</div>
            <div class="text-2xl font-semibold">{listing.bedroom || '-'}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-500">Bathrooms</div>
            <div class="text-2xl font-semibold">{listing.bathroom || '-'}</div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-500">Size</div>
            <div class="text-2xl font-semibold">
              {listing.size ? `${listing.size} sqft` : '-'}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-0">
      <!-- Left column - Images and description -->
      <div class="lg:col-span-2">
        <!-- Main image -->
        <div class="h-96 bg-gray-100 overflow-hidden relative">
          <img
            src={getImages(listing.pics)[0] ||
              "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800"}
            alt={listing.project_name}
            class="w-full h-full object-cover"
          />
          {#if listing.listing_type}
            <div class="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
              {listing.listing_type}
            </div>
          {/if}
        </div>

        <!-- Image gallery -->
        {#if getImages(listing.pics).length > 1}
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Photo Gallery</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              {#each getImages(listing.pics) as image, index}
                {#if index > 0}
                  <div class="h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${listing.project_name} - Image ${index + 1}`}
                      class="w-full h-full object-cover"
                    />
                  </div>
                {/if}
              {/each}
            </div>
          </div>
        {/if}

        <!-- Description -->
        {#if listing.description}
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <div class="prose max-w-none text-gray-600">
              {listing.description}
            </div>
          </div>
        {/if}

        <!-- Property details -->
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-3">Building</h3>
              <div class="space-y-3">
                {#if listing.developer}
                  <div class="flex justify-between">
                    <span class="text-gray-600">Developer</span>
                    <span class="font-medium">{listing.developer}</span>
                  </div>
                {/if}
                {#if listing.level}
                  <div class="flex justify-between">
                    <span class="text-gray-600">Level</span>
                    <span class="font-medium">{listing.level}</span>
                  </div>
                {/if}
                {#if listing.exposure}
                  <div class="flex justify-between">
                    <span class="text-gray-600">Exposure</span>
                    <span class="font-medium">{listing.exposure}</span>
                  </div>
                {/if}
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-3">Features</h3>
              <div class="space-y-3">
                {#if listing.parking}
                  <div class="flex justify-between">
                    <span class="text-gray-600">Parking</span>
                    <span class="font-medium">{listing.parking}</span>
                  </div>
                {/if}
                {#if listing.occupancy}
                  <div class="flex justify-between">
                    <span class="text-gray-600">Occupancy</span>
                    <span class="font-medium">{listing.occupancy}</span>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- Remarks -->
        {#if listing.remark}
          <div class="p-6 border-t border-gray-200">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Remarks</h2>
            <div class="prose max-w-none text-gray-600">
              {listing.remark}
            </div>
          </div>
        {/if}
      </div>

      <!-- Right column - Contact and actions -->
      <div class="border-t lg:border-t-0 lg:border-l border-gray-200">
        <!-- Contact Information -->
        {#if listing.user_profiles}
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Contact Agent</h2>
            <div class="flex items-center space-x-4 mb-6">
              <div
                class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
              >
                <span class="text-lg font-semibold text-blue-600">
                  {listing.user_profiles.first_name?.charAt(
                    0,
                  )}{listing.user_profiles.last_name?.charAt(0)}
                </span>
              </div>
              <div>
                <div class="text-lg font-medium text-gray-900">
                  {listing.user_profiles.first_name}
                  {listing.user_profiles.last_name}
                </div>
                {#if listing.user_profiles.brokerage}
                  <div class="text-sm text-gray-500">
                    {listing.user_profiles.brokerage}
                  </div>
                {/if}
              </div>
            </div>

            {#if listing.user_profiles.phone}
              <div class="mb-4">
                <a
                  href="tel:{listing.user_profiles.phone}"
                  class="w-full flex items-center justify-center px-4 py-3 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                  Call Agent
                </a>
              </div>
            {/if}

            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-sm font-medium text-gray-500 mb-2">
                Request More Information
              </h3>
              <button
                class="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary focus:outline-none transition-colors duration-200"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                Email Agent
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>