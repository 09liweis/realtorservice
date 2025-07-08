<script lang="ts">
  import type { Staging } from '$lib/types/staging';
  import { formatAmount } from '$lib/types/constant';
  import { calculateStagingFee } from '$lib/types/staging';

  export let staging: Staging;

  // Calculate staging fee breakdown
  $: stagingCalculation = calculateStagingFee(
    parseFloat(staging.size) || 0,
    parseFloat(staging.rooms) || 0,
    parseFloat(staging.length) || 1,
    staging.property_type || 'house'
  );
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200">
  <div class="px-6 py-4 border-b border-gray-200">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-900">Financial Information</h2>
    </div>
  </div>

  <div class="p-6">
    <!-- Price Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Estimated Price -->
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <span class="text-white text-xl">💡</span>
          </div>
          <span class="text-xs font-medium text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
            Estimated
          </span>
        </div>
        <div class="text-2xl font-bold text-blue-900 mb-1">
          {staging.estimate_price ? formatAmount(staging.estimate_price) : 'Calculating...'}
        </div>
        <div class="text-sm text-blue-700">System Calculated Price</div>
      </div>

      <!-- Quotation Price -->
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
            <span class="text-white text-xl">✅</span>
          </div>
          <span class="text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded-full">
            {staging.quotation_price ? 'Quoted' : 'Pending'}
          </span>
        </div>
        <div class="text-2xl font-bold text-green-900 mb-1">
          {staging.quotation_price ? formatAmount(staging.quotation_price) : 'Pending Quote'}
        </div>
        <div class="text-sm text-green-700">Final Quoted Price</div>
      </div>
    </div>

    <!-- Cost Breakdown -->
    {#if staging.size && staging.rooms && staging.length}
      <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          Cost Breakdown
        </h3>
        
        <div class="space-y-3">
          {#each stagingCalculation.breakdown as item}
            <div class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
              <span class="text-gray-700">{item.split(':')[0]}</span>
              <span class="font-medium text-gray-900">{item.split(':')[1]}</span>
            </div>
          {/each}
          
          {#if stagingCalculation.discount > 0}
            <div class="flex justify-between items-center py-2 text-green-600 bg-green-50 px-3 rounded-lg">
              <span class="font-medium">Term Discount</span>
              <span class="font-bold">-{formatAmount(stagingCalculation.discount)}</span>
            </div>
          {/if}
          
          <div class="flex justify-between items-center py-3 border-t-2 border-gray-300 text-lg font-bold">
            <span class="text-gray-900">Total Cost</span>
            <span class="text-green-600">{formatAmount(stagingCalculation.totalCost)}</span>
          </div>
        </div>
      </div>
    {/if}

    <!-- Additional Financial Details -->
    {#if staging.selling_price}
      <div class="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <span class="text-lg">🏷️</span>
          </div>
          <div>
            <div class="text-sm font-medium text-yellow-800">Expected Selling Price</div>
            <div class="text-lg font-bold text-yellow-900">
              {formatAmount(staging.selling_price)}
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>