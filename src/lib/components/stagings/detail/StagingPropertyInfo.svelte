<script lang="ts">
  import type { Staging } from '$lib/types/staging';

  export let staging: Staging;

  // Property details with icons
  const propertyDetails = [
    {
      label: 'Property Type',
      value: staging.property_type || 'Not specified',
      icon: '🏠'
    },
    {
      label: 'Size',
      value: staging.size ? `${staging.size} sq ft` : 'Not specified',
      icon: '📐'
    },
    {
      label: 'Occupation Status',
      value: staging.occupation_status || 'Not specified',
      icon: '🔑'
    },
    {
      label: 'Rooms to Stage',
      value: staging.rooms || 'Not specified',
      icon: '🛏️'
    },
    {
      label: 'Selling Price',
      value: staging.selling_price ? `$${staging.selling_price.toLocaleString()}` : 'Not specified',
      icon: '💰'
    }
  ];
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200">
  <div class="px-6 py-4 border-b border-gray-200">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-900">Property Information</h2>
    </div>
  </div>

  <div class="p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each propertyDetails as detail}
        <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <span class="text-lg">{detail.icon}</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-600 mb-1">{detail.label}</div>
            <div class="text-base font-semibold text-gray-900 truncate">{detail.value}</div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Property Location -->
    <div class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <div>
          <div class="text-sm font-medium text-blue-800">Property Address</div>
          <div class="text-lg font-semibold text-blue-900">{staging.location}</div>
        </div>
      </div>
    </div>
  </div>
</div>