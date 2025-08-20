<script lang="ts">
  import { page } from "$app/stores";
  import { formatAmount } from "$lib/types/constant";
  import Link from "$lib/components/Link.svelte";
  import type { Listing } from "$lib/types/listing.js";
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
    import ListingQuickInfo from "../components/ListingQuickInfo.svelte";

  export let data;

  const listing: Listing = data.listing;
  let currentImageIndex = 0;
  let showImageModal = false;

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

  const images = getImages(listing.pics);
  const defaultImage = "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1200";

  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % Math.max(images.length, 1);
  }

  function prevImage() {
    currentImageIndex = currentImageIndex === 0 ? Math.max(images.length - 1, 0) : currentImageIndex - 1;
  }

  function openImageModal(index: number) {
    currentImageIndex = index;
    showImageModal = true;
  }

  onMount(() => {
    // Add keyboard navigation for image modal
    function handleKeydown(event: KeyboardEvent) {
      if (!showImageModal) return;
      
      if (event.key === 'Escape') {
        showImageModal = false;
      } else if (event.key === 'ArrowLeft') {
        prevImage();
      } else if (event.key === 'ArrowRight') {
        nextImage();
      }
    }

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  });
</script>

<svelte:head>
  <title>{listing.project_name} - {listing.address}</title>
  <meta name="description" content="{listing.description || `${listing.project_name} in ${listing.location}. ${formatFeatures(listing)}.`}" />
</svelte:head>

<main class="min-h-screen bg-gray-50">
  <!-- Navigation -->
  <nav class="bg-white border-b border-gray-100 sticky top-0 z-40" in:fade={{ duration: 300 }}>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <Link
          href="/listings"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Listings
        </Link>
        
        <div class="flex items-center space-x-4">
          <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
          <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Image Section -->
  <section class="relative h-96 md:h-[500px] overflow-hidden" in:fade={{ duration: 600, delay: 200 }}>
    <img
      src={images[currentImageIndex] || defaultImage}
      alt={listing.project_name}
      class="w-full h-full object-cover"
    />
    
    <!-- Image Navigation -->
    {#if images.length > 1}
      <button
        on:click={prevImage}
        class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <button
        on:click={nextImage}
        class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    {/if}

    <!-- Image Counter -->
    {#if images.length > 1}
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
        {currentImageIndex + 1} / {images.length}
      </div>
    {/if}

    <!-- Listing Type Badge -->
    {#if listing.listing_type}
      <div class="absolute top-6 left-6 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
        {listing.listing_type}
      </div>
    {/if}

    <!-- Sold Badge -->
    {#if listing.is_sold}
      <div class="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
        SOLD
      </div>
    {/if}
  </section>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Left Column - Property Details -->
      <div class="lg:col-span-2 space-y-8">
        
        <!-- Property Header -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8" in:fly={{ y: 30, duration: 600, delay: 400 }}>
          <div class="mb-6">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {listing.project_name}
            </h1>
            <div class="flex items-center text-gray-600 mb-4">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="text-lg">{listing.address}{listing.location ? `, ${listing.location}` : ""}</span>
            </div>
            {#if listing.developer}
              <p class="text-gray-600">by <span class="font-medium">{listing.developer}</span></p>
            {/if}
          </div>

          <!-- Price and Key Features -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between border-t border-gray-100 pt-6">
            <div class="mb-4 md:mb-0">
              <div class="text-4xl font-bold text-gray-900 mb-2">
                {formatAmount(listing.asking_price)}
              </div>
              {#if listing.original_price && listing.original_price !== listing.asking_price}
                <div class="text-lg text-gray-500 line-through">
                  {formatAmount(listing.original_price)}
                </div>
              {/if}
            </div>
            
            {#if formatFeatures(listing)}
              <ListingQuickInfo {listing} />
            {/if}
          </div>
        </div>

        <!-- Description -->
        {#if listing.description}
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8" in:fly={{ y: 30, duration: 600, delay: 500 }}>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <div class="prose prose-gray max-w-none text-gray-700 leading-relaxed">
              {listing.description}
            </div>
          </div>
        {/if}

        <!-- Property Details -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8" in:fly={{ y: 30, duration: 600, delay: 600 }}>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Building Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Building
              </h3>
              <div class="space-y-3">
                {#if listing.ptype}
                  <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="text-gray-600">Property Type</span>
                    <span class="font-medium text-gray-900">{listing.ptype}</span>
                  </div>
                {/if}
                {#if listing.level}
                  <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="text-gray-600">Floor/Level</span>
                    <span class="font-medium text-gray-900">{listing.level}</span>
                  </div>
                {/if}
                {#if listing.exposure}
                  <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="text-gray-600">Exposure</span>
                    <span class="font-medium text-gray-900">{listing.exposure}</span>
                  </div>
                {/if}
                {#if listing.occupancy}
                  <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="text-gray-600">Occupancy</span>
                    <span class="font-medium text-gray-900">{listing.occupancy}</span>
                  </div>
                {/if}
              </div>
            </div>

            <!-- Features & Amenities -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Features
              </h3>
              <div class="space-y-3">
                {#if listing.parking}
                  <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="text-gray-600">Parking</span>
                    <span class="font-medium text-gray-900">{listing.parking}</span>
                  </div>
                {/if}
                {#if listing.locker}
                  <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="text-gray-600">Locker</span>
                    <span class="font-medium text-gray-900">{listing.locker}</span>
                  </div>
                {/if}
                {#if listing.basement}
                  <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="text-gray-600">Basement</span>
                    <span class="font-medium text-gray-900">{listing.basement}</span>
                  </div>
                {/if}
                {#if listing.commission}
                  <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="text-gray-600">Commission</span>
                    <span class="font-medium text-gray-900">{listing.commission}%</span>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- Photo Gallery -->
        {#if images.length > 1}
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8" in:fly={{ y: 30, duration: 600, delay: 700 }}>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Photo Gallery</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {#each images as image, index}
                <button
                  on:click={() => openImageModal(index)}
                  class="relative h-32 bg-gray-100 rounded-xl overflow-hidden group cursor-pointer"
                >
                  <img
                    src={image}
                    alt={`${listing.project_name} - Image ${index + 1}`}
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <svg class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                    </svg>
                  </div>
                </button>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Remarks -->
        {#if listing.remark}
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8" in:fly={{ y: 30, duration: 600, delay: 800 }}>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Additional Information</h2>
            <div class="prose prose-gray max-w-none text-gray-700 leading-relaxed">
              {listing.remark}
            </div>
          </div>
        {/if}
      </div>

      <!-- Right Column - Contact Card -->
      <div class="lg:col-span-1">
        {#if listing.user_profiles}
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-24" in:fly={{ x: 30, duration: 600, delay: 600 }}>
            <h2 class="text-xl font-bold text-gray-900 mb-6">Contact Agent</h2>
            
            <!-- Agent Info -->
            <div class="flex items-center space-x-4 mb-6">
              <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <span class="text-xl font-bold text-white">
                  {listing.user_profiles.first_name?.charAt(0)}{listing.user_profiles.last_name?.charAt(0)}
                </span>
              </div>
              <div>
                <div class="text-lg font-semibold text-gray-900">
                  {listing.user_profiles.first_name} {listing.user_profiles.last_name}
                </div>
                {#if listing.user_profiles.brokerage}
                  <div class="text-gray-600">{listing.user_profiles.brokerage}</div>
                {/if}
              </div>
            </div>

            <!-- Contact Actions -->
            <div class="space-y-3">
              {#if listing.user_profiles.phone}
                <a
                  href="tel:{listing.user_profiles.phone}"
                  class="w-full flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors duration-200 shadow-sm"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  Call Now
                </a>
              {/if}

              {#if listing.user_profiles.email}
                <a
                  href="mailto:{listing.user_profiles.email}"
                  class="w-full flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-xl font-medium hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Send Email
                </a>
              {/if}
            </div>

            <!-- Quick Info -->
            <div class="mt-8 p-4 bg-gray-50 rounded-xl">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Quick Information</h3>
              <div class="space-y-2 text-sm">
                <div class="flex items-center text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Response within 24 hours</span>
                </div>
                <div class="flex items-center text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Licensed professional</span>
                </div>
                <div class="flex items-center text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Free consultation</span>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>

<!-- Image Modal -->
{#if showImageModal && images.length > 0}
  <div 
    class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
    on:click={() => showImageModal = false}
    in:fade={{ duration: 300 }}
    out:fade={{ duration: 200 }}
  >
    <div class="relative max-w-4xl max-h-full">
      <img
        src={images[currentImageIndex]}
        alt={`${listing.project_name} - Image ${currentImageIndex + 1}`}
        class="max-w-full max-h-full object-contain rounded-lg"
        on:click|stopPropagation
      />
      
      <!-- Close Button -->
      <button
        on:click={() => showImageModal = false}
        class="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Navigation Arrows -->
      {#if images.length > 1}
        <button
          on:click|stopPropagation={prevImage}
          class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <button
          on:click|stopPropagation={nextImage}
          class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <!-- Image Counter -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .prose {
    line-height: 1.7;
  }
  
  .prose p {
    margin-bottom: 1rem;
  }
</style>