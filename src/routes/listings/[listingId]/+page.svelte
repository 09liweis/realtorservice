<script lang="ts">
  import { page } from "$app/stores";
  import { formatAmount } from "$lib/types/constant";
  import Link from "$lib/components/Link.svelte";

  export let data;

  const listing = data.listing;

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

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Back button -->
  <div class="mb-6">
    <Link
      to="/dashboard/listings"
      class="flex items-center text-blue-600 hover:text-blue-800"
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

  <!-- Main content -->
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
  >
    <!-- Property Images -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
      <div class="h-96 bg-gray-100 overflow-hidden">
        <img
          src={getImages(listing.pics)[0] ||
            "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800"}
          alt={listing.project_name}
          class="w-full h-full object-cover"
        />
      </div>
      <div class="p-8">
        <!-- Price and Type -->
        <div class="flex justify-between items-start mb-6">
          <div>
            <div class="text-3xl font-bold text-gray-900 mb-1">
              {formatAmount(listing.asking_price)}
            </div>
            {#if listing.original_price && listing.original_price !== listing.asking_price}
              <div class="text-lg text-gray-500 line-through">
                {formatAmount(listing.original_price)}
              </div>
            {/if}
          </div>
          {#if listing.listing_type}
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {listing.listing_type}
            </span>
          {/if}
        </div>

        <!-- Project Name and Developer -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            {listing.project_name}
          </h1>
          {#if listing.developer}
            <p class="text-lg text-gray-600">by {listing.developer}</p>
          {/if}
        </div>

        <!-- Address -->
        <div class="flex items-start space-x-3 mb-6">
          <svg
            class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
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
          <div class="text-lg text-gray-600">
            {listing.address}{listing.location ? `, ${listing.location}` : ""}
          </div>
        </div>

        <!-- Property Features -->
        {#if formatFeatures(listing)}
          <div class="flex items-center space-x-3 mb-6">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </svg>
            <span class="text-lg text-gray-600">{formatFeatures(listing)}</span>
          </div>
        {/if}

        <!-- Additional Details -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          {#if listing.level}
            <div>
              <h3 class="text-sm font-medium text-gray-500">Level</h3>
              <p class="text-lg font-medium text-gray-900">{listing.level}</p>
            </div>
          {/if}
          {#if listing.parking}
            <div>
              <h3 class="text-sm font-medium text-gray-500">Parking</h3>
              <p class="text-lg font-medium text-gray-900">{listing.parking}</p>
            </div>
          {/if}
          {#if listing.exposure}
            <div>
              <h3 class="text-sm font-medium text-gray-500">Exposure</h3>
              <p class="text-lg font-medium text-gray-900">
                {listing.exposure}
              </p>
            </div>
          {/if}
          {#if listing.occupancy}
            <div>
              <h3 class="text-sm font-medium text-gray-500">Occupancy</h3>
              <p class="text-lg font-medium text-gray-900">
                {listing.occupancy}
              </p>
            </div>
          {/if}
        </div>

        <!-- Description -->
        {#if listing.description}
          <div class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 mb-4">
              Property Description
            </h2>
            <div class="prose max-w-none text-gray-600">
              {listing.description}
            </div>
          </div>
        {/if}

        <!-- Contact Information -->
        {#if listing.user_profiles}
          <div class="border-t border-gray-200 pt-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Contact Agent</h2>
            <div class="flex items-center space-x-4">
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
              <div class="mt-6">
                <a
                  href="tel:{listing.user_profiles.phone}"
                  class="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
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
                  Call Agent: {listing.user_profiles.phone}
                </a>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>

    <!-- Image Gallery -->
    {#if getImages(listing.pics).length > 1}
      <div class="border-t border-gray-200 px-8 py-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Property Images</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
  </div>
</div>
