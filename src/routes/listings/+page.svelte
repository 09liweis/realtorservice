<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import ListingList from '$lib/components/listings/ListingList.svelte';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';

  export let data;

  $: ({ listings, pagination, filters, filterOptions } = data);

  // Filter form state
  let searchForm = {
    search: data.filters.search || '',
    type: data.filters.type || '',
    location: data.filters.location || '',
    minPrice: data.filters.minPrice || '',
    maxPrice: data.filters.maxPrice || '',
    bedrooms: data.filters.bedrooms || '',
    bathrooms: data.filters.bathrooms || ''
  };

  let showFilters = false;

  // Handle filter form submission
  function handleFilterSubmit() {
    const params = new URLSearchParams();
    
    // Add non-empty filters to URL params
    Object.entries(searchForm).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        params.set(key, value.toString());
      }
    });

    // Reset to page 1 when filtering
    params.set('page', '1');

    // Navigate with new filters
    goto(`/listings?${params.toString()}`);
  }

  // Clear all filters
  function clearFilters() {
    searchForm = {
      search: '',
      type: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: ''
    };
    goto('/listings');
  }

  // Handle pagination
  function goToPage(pageNumber: number) {
    const params = new URLSearchParams($page.url.searchParams);
    params.set('page', pageNumber.toString());
    goto(`/listings?${params.toString()}`);
  }

  // Format price for display
  function formatPrice(price: string): string {
    if (!price) return '';
    const num = parseFloat(price);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num);
  }

  // Get active filter count
  $: activeFilterCount = Object.values(searchForm).filter(value => 
    value && value.toString().trim()
  ).length;
</script>

<svelte:head>
  <title>Property Listings - Realtor Service</title>
  <meta name="description" content="Browse our extensive collection of properties for sale. Find your dream home with advanced search filters and detailed property information." />
</svelte:head>

<div class="min-h-screen bg-gray-50 pt-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Page Header -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Property Listings
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover your perfect property from our curated collection of homes, condos, and commercial spaces.
        </p>
        <div class="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>{pagination.totalItems} Properties Available</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Updated Daily</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
      <!-- Quick Search Bar -->
      <div class="mb-6">
        <div class="relative max-w-2xl mx-auto">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            bind:value={searchForm.search}
            placeholder="Search by project name, address, or location..."
            class="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            on:keydown={(e) => e.key === 'Enter' && handleFilterSubmit()}
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <Button onclick={handleFilterSubmit} class_name="px-6 py-2">
              Search
            </Button>
          </div>
        </div>
      </div>

      <!-- Advanced Filters Toggle -->
      <div class="flex items-center justify-between">
        <button
          on:click={() => showFilters = !showFilters}
          class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
          </svg>
          <span class="font-medium">Advanced Filters</span>
          {#if activeFilterCount > 0}
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {activeFilterCount}
            </span>
          {/if}
          <svg class="w-4 h-4 transition-transform duration-200 {showFilters ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        {#if activeFilterCount > 0}
          <button
            on:click={clearFilters}
            class="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
          >
            Clear All Filters
          </button>
        {/if}
      </div>

      <!-- Advanced Filters Panel -->
      {#if showFilters}
        <div class="mt-6 pt-6 border-t border-gray-200">
          <form on:submit|preventDefault={handleFilterSubmit} class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- Property Type -->
              <div>
                <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  id="type"
                  bind:value={searchForm.type}
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  {#each filterOptions.propertyTypes as type}
                    <option value={type}>{type}</option>
                  {/each}
                </select>
              </div>

              <!-- Location -->
              <div>
                <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  id="location"
                  bind:value={searchForm.location}
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Locations</option>
                  {#each filterOptions.locations as location}
                    <option value={location}>{location}</option>
                  {/each}
                </select>
              </div>

              <!-- Bedrooms -->
              <div>
                <label for="bedrooms" class="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <select
                  id="bedrooms"
                  bind:value={searchForm.bedrooms}
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any</option>
                  {#each filterOptions.bedroomOptions as bedroom}
                    <option value={bedroom}>{bedroom}+ Bed{bedroom !== '1' ? 's' : ''}</option>
                  {/each}
                </select>
              </div>

              <!-- Bathrooms -->
              <div>
                <label for="bathrooms" class="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <select
                  id="bathrooms"
                  bind:value={searchForm.bathrooms}
                  class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any</option>
                  {#each filterOptions.bathroomOptions as bathroom}
                    <option value={bathroom}>{bathroom}+ Bath{bathroom !== '1' ? 's' : ''}</option>
                  {/each}
                </select>
              </div>
            </div>

            <!-- Price Range -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="minPrice" class="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Price
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="minPrice"
                    bind:value={searchForm.minPrice}
                    placeholder="0"
                    class="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label for="maxPrice" class="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Price
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="maxPrice"
                    bind:value={searchForm.maxPrice}
                    placeholder="No limit"
                    class="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <!-- Filter Actions -->
            <div class="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                on:click={clearFilters}
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                Clear
              </button>
              <Button type="submit" class_name="px-8">
                Apply Filters
              </Button>
            </div>
          </form>
        </div>
      {/if}
    </div>

    <!-- Results Summary -->
    <div class="flex items-center justify-between mb-6">
      <div class="text-gray-600">
        {#if pagination.totalItems === 0}
          <span class="text-lg">No properties found</span>
        {:else}
          <span class="text-lg">
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1}-{Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} 
            of {pagination.totalItems} properties
          </span>
        {/if}
        {#if activeFilterCount > 0}
          <span class="text-sm text-blue-600 ml-2">
            ({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied)
          </span>
        {/if}
      </div>

      <!-- Sort Options (Future Enhancement) -->
      <div class="hidden md:flex items-center space-x-2">
        <span class="text-sm text-gray-500">Sort by:</span>
        <select class="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Newest First</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Most Popular</option>
        </select>
      </div>
    </div>

    <!-- Listings Grid -->
    {#if pagination.totalItems === 0}
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <div class="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
        <p class="text-gray-600 mb-6">
          {#if activeFilterCount > 0}
            Try adjusting your search criteria or clearing some filters to see more results.
          {:else}
            We're currently updating our listings. Please check back soon for new properties.
          {/if}
        </p>
        {#if activeFilterCount > 0}
          <Button onclick={clearFilters} variant="secondary">
            Clear All Filters
          </Button>
        {/if}
      </div>
    {:else}
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <ListingList {listings} />
      </div>
    {/if}

    <!-- Pagination -->
    {#if pagination.totalPages > 1}
      <div class="mt-8 flex items-center justify-center">
        <nav class="flex items-center space-x-2">
          <!-- Previous Button -->
          <button
            on:click={() => goToPage(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>

          <!-- Page Numbers -->
          {#each Array.from({length: Math.min(5, pagination.totalPages)}, (_, i) => {
            const start = Math.max(1, pagination.currentPage - 2);
            const end = Math.min(pagination.totalPages, start + 4);
            return start + i;
          }).filter(page => page <= pagination.totalPages) as pageNum}
            <button
              on:click={() => goToPage(pageNum)}
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 {
                pageNum === pagination.currentPage
                  ? 'bg-primary text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }"
            >
              {pageNum}
            </button>
          {/each}

          <!-- Show ellipsis if there are more pages -->
          {#if pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2}
            <span class="px-2 py-2 text-sm text-gray-500">...</span>
            <button
              on:click={() => goToPage(pagination.totalPages)}
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {pagination.totalPages}
            </button>
          {/if}

          <!-- Next Button -->
          <button
            on:click={() => goToPage(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </nav>
      </div>

      <!-- Pagination Info -->
      <div class="mt-4 text-center text-sm text-gray-500">
        Page {pagination.currentPage} of {pagination.totalPages}
      </div>
    {/if}

    <!-- Call to Action -->
    <div class="mt-12 bg-primary rounded-2xl p-8 text-white text-center">
      <h2 class="text-2xl font-bold mb-4">
        Can't Find What You're Looking For?
      </h2>
      <p class="text-blue-100 mb-6 max-w-2xl mx-auto">
        Our experienced real estate professionals are here to help you find the perfect property. 
        Contact us for personalized assistance and exclusive listings.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="#contact"
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
        >
          Contact Our Team
        </a>
        <a
          href="/register"
          class="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-blue-600 transition-colors duration-200"
        >
          Join as Agent
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  /* Custom scrollbar for filter panel */
  :global(.filter-panel) {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
  }

  :global(.filter-panel::-webkit-scrollbar) {
    width: 6px;
  }

  :global(.filter-panel::-webkit-scrollbar-track) {
    background: #f1f5f9;
  }

  :global(.filter-panel::-webkit-scrollbar-thumb) {
    background-color: #cbd5e1;
    border-radius: 3px;
  }
</style>