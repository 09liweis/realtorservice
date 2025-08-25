<script lang="ts">
  import { fade, fly } from 'svelte/transition';
    import Button from './common/Button.svelte';
    import { LISTING_TYPES, PROPERTY_TYPES, ROOM_NUMS } from '$lib/types/constant';

  export let filters: {
    search: string;
    listing_type: string;
    property_type: string;
    location: string;
    minPrice: string;
    maxPrice: string;
    bedrooms: string;
    bathrooms: string;
    sortBy: string;
  };

  export let showFilters: boolean;
  const listingTypes = LISTING_TYPES;
  const propertyTypes = PROPERTY_TYPES;

  export let clearFilters: void;
  export let handleSearch: void;

  let debounceTimer:any;

  const handleAddressSearch = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      handleSearch();
    }, 300);
  }
</script>

<!-- Search and Filter Bar -->
<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8" in:fly={{ y: 20, duration: 600, delay: 400 }}>
  <!-- Main Search -->
  <div class="flex flex-col lg:flex-row gap-4 mb-6">
    <div class="flex-1">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input
          type="text"
          bind:value={filters.search}
          oninput={handleAddressSearch}
          placeholder="Search by project name, address, location, or developer..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
        />
      </div>
    </div>
    
    <!-- Quick Filters -->
    <div class="flex gap-3">
      <select
        onchange={handleSearch}
        bind:value={filters.listing_type}
        class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
      >
        <option value="">All Types</option>
        {#each listingTypes as type}
          <option value={type.toLowerCase()}>{type.split('_').join(' ')}</option>
        {/each}
      </select>
      
      <!-- <select
        bind:value={filters.sortBy}
        class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select> -->
      
      <button
        onclick={() => showFilters = !showFilters}
        class="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors duration-200 flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
        </svg>
        <span>Filters</span>
      </button>
    </div>
  </div>

  <!-- Advanced Filters (Collapsible) -->
  {#if showFilters}
    <div class="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center" in:fly={{ y: -20, duration: 300 }} out:fade={{ duration: 300 }} >
    <div class="border-t border-gray-200 pt-6 max-w-5xl w-full bg-white p-4 rounded relative">
      <button onclick={showFilters = false} class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-500 cursor-pointer">X</button>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <select
            bind:value={filters.property_type}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">All Types</option>
            {#each propertyTypes as type}
              <option value={type}>{type}</option>
            {/each}
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <select
            bind:value={filters.bedroom}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Any</option>
            {#each ROOM_NUMS as num}
            <option value={num}>{num}</option>
            {/each}
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
          <select
            bind:value={filters.bathroom}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Any</option>
            {#each ROOM_NUMS as num}
            <option value={num}>{num}</option>
            {/each}
          </select>
        </div>
      </div>
      
      <!-- Price Range -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
          <input
            type="number"
            bind:value={filters.minPrice}
            placeholder="No minimum"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
          <input
            type="number"
            bind:value={filters.maxPrice}
            placeholder="No maximum"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      
      <!-- Filter Actions -->
      <div class="flex justify-between items-center">
        <button
          onclick={()=>{
            showFilters = false;
            clearFilters();
          }}
          class="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Clear all filters
        </button>
        <Button onclick={()=>{
          showFilters = false;
          handleSearch(filters);
        }}>
          Search
        </Button>
      </div>
    </div>
    </div>
  {/if}
</div>