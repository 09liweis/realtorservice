<script lang="ts">
  import { page } from '$app/stores';
  import type { Listing } from '$lib/types/listing';
  import { getPageTitle } from '$lib/types/constant';
  import { fade, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
    import { sendRequest } from '$lib/helper';
    import ListingsGrid from '$lib/components/home/ListingsGrid.svelte';
    import SearchFilterBar from '$lib/components/SearchFilterBar.svelte';
    import { goto } from '$app/navigation';

  let listings:Listing[] = [];
  let filteredListings: Listing[] = [];
  let loading = true;
  let error = '';

  const EMPTY_FILTERS = {
    search: '',
    listing_type: '',
    property_type: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    bedroom: '',
    bathroom: '',
    sortBy: 'newest'
  };

  // Filter and search state
  let filters = {...EMPTY_FILTERS};
  let showFilters = false;

  // Pagination
  let currentPage = 1;
  let itemsPerPage = 12;
  let totalPages = 1;

  const getQuerySearchFromFilter = () => {
    let querySearchArray = [];
    for (const [key, value] of Object.entries(filters)) {
      const filterValue = value;
      if (filterValue) {
        querySearchArray.push(`${key}=${encodeURIComponent(filterValue)}`);
      }
    }
    const querySearch = querySearchArray.join('&');
    return querySearch;
  }

  const fetchListings = async() => {
    loading = true;
    let baseAPI = '/api/listings?isPublic=1&' + $page.url.search.replace('?','');
    const {data: {listings:listingsData, error}} = await sendRequest({
      url: baseAPI,
      method: 'GET'
    });
    loading = false;
    if (error) throw error;
    listings = listingsData || [];
  }

  function setFiltersFromQueryString(queryString:string) {
    const querySearchObject:any = {};
    if (!queryString) return filters;

    // Remove the leading '?' if present
    const query = queryString.startsWith('?') ? queryString.substring(1) : queryString;

    // Split into key-value pairs
    const pairs = query.split('&');
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) {
        // Decode URI components and assign to object
        querySearchObject[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });

    filters = {...querySearchObject,...filters};

  }

  // Apply filters and search
  function applyFilters() {
    // Sort listings
    fetchListings();

    
    listings.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return (parseFloat(a.asking_price) || 0) - (parseFloat(b.asking_price) || 0);
        case 'price-high':
          return (parseFloat(b.asking_price) || 0) - (parseFloat(a.asking_price) || 0);
        case 'oldest':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case 'newest':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });
    totalPages = Math.ceil(listings.length / itemsPerPage);
    currentPage = 1;
  }

  const handleSearch = () => {
    const querySearch = getQuerySearchFromFilter();
    const newUrl = `${$page.url.pathname}?${querySearch}`;
    goto(newUrl);
  }

  // Clear all filters
  function clearFilters() {
    filters = {...EMPTY_FILTERS};
    goto('/listings');
  }

  // Handle page change
  function goToPage(page: number) {
    currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Watch for URL or filter changes
  $: {
    // Only apply filters if either URL or filters have changed
    if (typeof window !== 'undefined') {
      setFiltersFromQueryString($page.url.search);
      applyFilters();
    }
  }
</script>

<svelte:head>
  <title>{getPageTitle('Property Listings')}</title>
  <meta name="description" content="Browse assignment sales and coming soon property listings. Find your next investment opportunity with detailed property information and professional real estate services." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-primary text-white py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center" in:fade={{ duration: 600, delay: 200 }}>
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        Property Listings
      </h1>
      <p class="text-xl text-blue-100 max-w-3xl mx-auto mb-4">
        Discover assignment sales and coming soon properties with professional real estate services
      </p>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div class="bg-primary rounded-lg p-4">
          <div class="text-2xl font-bold">{listings.length}</div>
          <div class="text-blue-100 text-sm">Total Listings</div>
        </div>
        <div class="bg-primary rounded-lg p-4">
          <div class="text-2xl font-bold">{listings.filter(l => l.listing_type === 'Assignment Sale').length}</div>
          <div class="text-blue-100 text-sm">Assignment Sales</div>
        </div>
        <div class="bg-primary rounded-lg p-4">
          <div class="text-2xl font-bold">{listings.filter(l => l.listing_type === 'Coming Soon').length}</div>
          <div class="text-blue-100 text-sm">Coming Soon</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Main Content -->
<section class="py-12 bg-gray-50 min-h-screen">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Search and Filter Bar -->
    <SearchFilterBar
      bind:filters
      bind:showFilters
      {clearFilters}
      {handleSearch}
    />

    <!-- Results Header -->
    <div class="flex items-center justify-between mb-8" in:fly={{ y: 20, duration: 600, delay: 600 }}>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          {listings.length} Properties Found
        </h2>
        <p class="text-gray-600 mt-1">
          {#if filters.listing_type}
            Showing {filters.listing_type} listings
          {:else}
            Showing all available listings
          {/if}
        </p>
      </div>
      
      <!-- View Toggle -->
      <!-- <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">View:</span>
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button class="px-3 py-1 bg-white text-gray-900 rounded-md shadow-sm text-sm font-medium">
            Grid
          </button>
          <button class="px-3 py-1 text-gray-600 text-sm font-medium hover:text-gray-900">
            List
          </button>
        </div>
      </div> -->
    </div>

    <!-- Loading State -->
    {#if loading}
      <div class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    {:else if error}
      <!-- Error State -->
      <div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          {error}
        </div>
      </div>
    {:else if listings.length === 0}
      <!-- Empty State -->
      <div class="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200" in:fade={{ duration: 600, delay: 400 }}>
        <div class="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
        <p class="text-gray-600 mb-6">
          Try adjusting your search criteria or clearing filters to see more results.
        </p>
        <button
          on:click={clearFilters}
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors duration-200"
        >
          Clear Filters
        </button>
      </div>
    {:else}
      <!-- Listings Grid -->
      <ListingsGrid {listings} showTitle={false} />

      <!-- Pagination -->
      {#if totalPages > 1}
        <div class="flex items-center justify-center space-x-2" in:fade={{ duration: 400, delay: 800 }}>
          <!-- Previous Button -->
          <button
            on:click={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <!-- Page Numbers -->
          {#each Array(Math.min(totalPages, 7)) as _, i}
            {@const pageNum = i + 1}
            <button
              on:click={() => goToPage(pageNum)}
              class="px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 {
                currentPage === pageNum
                  ? 'bg-primary text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }"
            >
              {pageNum}
            </button>
          {/each}

          <!-- Next Button -->
          <button
            on:click={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <!-- Pagination Info -->
        <div class="text-center mt-4 text-sm text-gray-600">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredListings.length)} of {filteredListings.length} properties
        </div>
      {/if}
    {/if}
  </div>
</section>

<!-- Call to Action -->
<section class="py-16 bg-primary">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div in:fade={{ duration: 600, delay: 200 }}>
      <h2 class="text-3xl font-bold text-white mb-4">
        Ready to List Your Property?
      </h2>
      <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
        Join our platform and showcase your properties to qualified buyers with our professional services.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="/register"
          class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-primary bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
          </svg>
          Get Started Today
        </a>
        <a
          href="/dashboard"
          class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-semibold rounded-xl text-white hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"></path>
          </svg>
          Access Dashboard
        </a>
      </div>
    </div>
  </div>
</section>