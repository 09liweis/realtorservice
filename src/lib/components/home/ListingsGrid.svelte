<script lang="ts">
  import type { Listing } from "$lib/types/listing";
  import { formatAmount } from "$lib/types/constant";
  import { fade, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
    import ListingQuickInfo from "../../../routes/listings/components/ListingQuickInfo.svelte";
    import Link from "../Link.svelte";
    import ListingImage from "../listings/ListingImage.svelte";

  export let listings: Listing[];
  export let showTitle: boolean = true;
  export let showViewMore: boolean = false;
</script>

<section class="py-8 bg-gray-50">
  <div class="container mx-auto">
    <!-- Section Header -->
    {#if showTitle}
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Featured Listings
      </h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Discover exceptional real estate opportunities with our curated selection of premium properties.
      </p>
    </div>
    {/if}

    {#if listings.length === 0}
      <!-- Empty State -->
      <div class="text-center py-16">
        <div class="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Properties Available</h3>
        <p class="text-gray-500">Check back soon for new listings and opportunities.</p>
      </div>
    {:else}
      <!-- Listings Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {#each listings as listing, index (listing.id)}
          <div
            class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2"
            in:fly={{ y: 30, duration: 600, delay: index * 100 }}
            out:fade={{ duration: 300 }}
            animate:flip={{ duration: 400 }}
          >
            <!-- Property Image -->
            <div class="relative h-56 bg-gray-200 overflow-hidden">
              
              <ListingImage listing={listing} />

              <!-- Quick View Button -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a
                  href="/listings/{listing.id}"
                  class="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
                >
                  View Details
                </a>
              </div>
            </div>

            <!-- Property Content -->
            <div class="p-3">
              <!-- Price and Type -->
              <div class="flex justify-between items-start mb-4">
                <div>
                  <Link href={`/listings/${listing.id}`} className="text-2xl text-primary font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-300">
                    {formatAmount(listing.asking_price || listing.original_price)}
                  </Link>
                  {#if listing.listing_type === 'assignment_sale' && listing.original_price && listing.original_price !== listing.asking_price}
                    <div class="text-sm text-gray-400 line-through">
                      {formatAmount(listing.original_price)}
                    </div>
                  {/if}
                </div>
                {#if listing.ptype}
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                    {listing.ptype}
                  </span>
                {/if}
              </div>

              <!-- Address -->
              <div class="flex items-start space-x-2 mb-4">
                <svg class="w-4 h-4 text-gray-400 mt-1 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <div class="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {listing.address}
                </div>
              </div>
              <ListingQuickInfo {listing} />

              <!-- Realtor Information -->
              {#if listing.user_profiles}
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mt-4 transition-all duration-300 hover:bg-gray-100">
                  <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="ml-2">
                    <div class="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">
                      {listing.user_profiles.first_name} {listing.user_profiles.last_name}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      {listing.user_profiles.brokerage}
                    </div>
                  </div>
                </div>
              {/if}
              
            </div>
          </div>
        {/each}
      </div>

      {#if showViewMore}
      <div class="text-center mt-12">
        <a
          href="/listings"
          class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-primary hover:bg-primary-hover transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          View All Properties
          <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </a>
      </div>
      {/if}



    {/if}
  </div>
</section>

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

  /* Enhanced hover effects */
  .group:hover {
    transform: translateY(-8px);
  }

  /* Smooth transitions for all interactive elements */
  * {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
  }
</style>