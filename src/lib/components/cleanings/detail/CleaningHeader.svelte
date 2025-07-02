<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Cleaning, CleaningStatus } from '$lib/types/cleaning';
  import { formatAmount } from '$lib/types/constant';
  import { CLEANING_TYPES, CLEANING_FREQUENCIES } from '$lib/types/cleaning';
  import { user } from '$lib/stores/auth';

  export let cleaning: Cleaning;

  const dispatch = createEventDispatcher();

  // Get status badge style
  function getStatusStyle(status: CleaningStatus) {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  function getCleaningTypeLabel(type: string): string {
    return CLEANING_TYPES.find(t => t.value === type)?.label || type;
  }

  function getFrequencyLabel(frequency: string): string {
    return CLEANING_FREQUENCIES.find(f => f.value === frequency)?.label || frequency;
  }

  function handleEdit() {
    dispatch('edit');
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
  <!-- Header Background -->
  <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-white">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-3 mb-2">
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <span class="text-2xl">🧽</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold">Cleaning Request</h1>
            <p class="text-green-100">Professional Cleaning Service</p>
          </div>
        </div>
        
        <!-- Property Location -->
        <div class="flex items-center space-x-2 mt-4">
          <svg class="w-5 h-5 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span class="text-lg font-medium">{cleaning.location}</span>
        </div>
      </div>

      <!-- Status and Actions -->
      <div class="flex items-center space-x-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border {getStatusStyle(cleaning.status)}">
          {cleaning.status}
        </span>
        
        {#if !$user?.isAdmin}
          <button
            on:click={handleEdit}
            class="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit Request
          </button>
        {/if}
      </div>
    </div>
  </div>

  <!-- Quick Stats -->
  <div class="px-8 py-6 bg-gray-50 border-b border-gray-200">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          {cleaning.size ? `${cleaning.size} sq ft` : 'N/A'}
        </div>
        <div class="text-sm text-gray-600">Property Size</div>
      </div>
      
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          {getCleaningTypeLabel(cleaning.cleaning_type)}
        </div>
        <div class="text-sm text-gray-600">Cleaning Type</div>
      </div>
      
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          {getFrequencyLabel(cleaning.frequency)}
        </div>
        <div class="text-sm text-gray-600">Frequency</div>
      </div>
      
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">
          {cleaning.estimate_price ? formatAmount(cleaning.estimate_price) : 'Pending'}
        </div>
        <div class="text-sm text-gray-600">Estimated Cost</div>
      </div>
    </div>
  </div>
</div>