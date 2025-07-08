<script lang="ts">
  import type { Staging } from '$lib/types/staging';
  import { formatAmount, getStatusStyle } from '$lib/types/constant';
    import { CLEANING_FREQUENCIES, CLEANING_TYPES, type Cleaning } from '$lib/types/cleaning';

  export let request: Staging|Cleaning;
  export let tp: string = "staging";

  function getCleaningTypeLabel(type: string): string {
    return CLEANING_TYPES.find(t => t.value === type)?.label || type;
  }

  function getFrequencyLabel(frequency: string): string {
    return CLEANING_FREQUENCIES.find(f => f.value === frequency)?.label || frequency;
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
  <!-- Header Background -->
  <div class="bg-primary px-8 py-6 text-white">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-3 mb-2">
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <span class="text-2xl">✨</span>
          </div>
          <div class="capitalize">
            <h1 class="text-2xl font-bold">{tp} Request</h1>
            <p class="text-pink-100">Professional Property {tp}</p>
          </div>
        </div>
        
        <!-- Property Location -->
        <div class="flex items-center space-x-2 mt-4">
          <svg class="w-5 h-5 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span class="text-lg font-medium">{request.location}</span>
        </div>
      </div>

      <!-- Status and Actions -->
      <div class="flex items-center space-x-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border capitalize {getStatusStyle(request.status)}">
          {request.status}
        </span>
      </div>
    </div>
  </div>

  <!-- Quick Stats -->
  <div class="px-8 py-6 bg-gray-50 border-b border-gray-200">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          {request.size ? `${request.size} sq ft` : 'N/A'}
        </div>
        <div class="text-sm text-gray-600">Property Size</div>
      </div>
      
      {#if tp === 'staging'}
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          {request.rooms || 'N/A'}
        </div>
        <div class="text-sm text-gray-600">Rooms to Stage</div>
      </div>
      
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          {request.length ? `${request.length} month${request.length !== '1' ? 's' : ''}` : 'N/A'}
        </div>
        <div class="text-sm text-gray-600">Duration</div>
      </div>
      {:else if (tp === 'cleaning')}
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          {getCleaningTypeLabel(request.cleaning_type)}
        </div>
        <div class="text-sm text-gray-600">Cleaning Type</div>
      </div>
      
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          {getFrequencyLabel(request.frequency)}
        </div>
        <div class="text-sm text-gray-600">Frequency</div>
      </div>
      {/if}
      
      <div class="text-center">
        <div class="text-2xl font-bold text-pink-600">
          {request.estimate_price ? formatAmount(request.estimate_price) : 'Pending'}
        </div>
        <div class="text-sm text-gray-600">Estimated Cost</div>
      </div>
    </div>
  </div>
</div>