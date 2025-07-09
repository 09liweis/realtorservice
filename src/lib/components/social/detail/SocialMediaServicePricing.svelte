<script lang="ts">
  import { formatAmount } from '$lib/types/constant';
  import type { SocialMediaService } from '$lib/types/social';

  export let socialMediaService: SocialMediaService;
  export let pricingInfo: any;
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200">
  <div class="px-6 py-4 border-b border-gray-200">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-900">Pricing Information</h2>
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
            {pricingInfo.isCustomPrice ? 'Custom' : 'Standard'}
          </span>
        </div>
        <div class="text-2xl font-bold text-blue-900 mb-1">
          {formatAmount(pricingInfo.totalPrice)}
        </div>
        <div class="text-sm text-blue-700">
          {pricingInfo.isCustomPrice ? 'Custom Quoted Price' : 'Calculated Price'}
        </div>
      </div>

      <!-- Final Price -->
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
            <span class="text-white text-xl">✅</span>
          </div>
          <span class="text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded-full">
            {socialMediaService.quotation_price ? 'Final' : 'Pending'}
          </span>
        </div>
        <div class="text-2xl font-bold text-green-900 mb-1">
          {socialMediaService.quotation_price ? formatAmount(socialMediaService.quotation_price) : 'Pending Quote'}
        </div>
        <div class="text-sm text-green-700">Final Quoted Price</div>
      </div>
    </div>

    <!-- Cost Breakdown -->
    {#if !pricingInfo.isCustomPrice}
      <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          Cost Breakdown
        </h3>
        
        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-gray-200">
            <span class="text-gray-700">Base service price:</span>
            <span class="font-medium text-gray-900">
              {formatAmount(pricingInfo.basePrice)}
            </span>
          </div>

          {#if socialMediaService.subscription_type !== 'Monthly'}
            <div class="flex justify-between items-center py-2 border-b border-gray-200">
              <span class="text-gray-700">Monthly equivalent:</span>
              <span class="font-medium text-gray-900">{formatAmount(pricingInfo.monthlyEquivalent)}/month</span>
            </div>
          {/if}

          <!-- Add-ons breakdown -->
          {#if pricingInfo.addonInfo.length > 0}
            <div class="border-t border-gray-300 pt-2">
              <div class="text-sm font-medium text-gray-700 mb-2">Add-ons:</div>
              {#each pricingInfo.addonInfo as addon}
                <div class="flex justify-between text-sm text-pink-600 py-1">
                  <span>{addon.label}:</span>
                  <span>+{formatAmount(addon.price)}/{addon.unit}</span>
                </div>
              {/each}
              <div class="flex justify-between text-sm font-medium text-pink-700 mt-1 pt-1 border-t border-pink-100">
                <span>Add-ons total:</span>
                <span>+{formatAmount(pricingInfo.addonPrice)}</span>
              </div>
            </div>
          {/if}

          {#if pricingInfo.savings > 0}
            <div class="border-t border-gray-300 pt-2">
              <div class="flex justify-between text-sm text-green-600 font-medium">
                <span>You save:</span>
                <span>{formatAmount(pricingInfo.savings)}</span>
              </div>
            </div>
          {/if}
          
          <div class="flex justify-between items-center py-3 border-t-2 border-gray-300 text-lg font-bold">
            <span class="text-gray-900">Total Cost:</span>
            <span class="text-pink-600">{formatAmount(pricingInfo.totalPrice)}</span>
          </div>
        </div>
      </div>
    {/if}

    <!-- Service Features -->
    <div class="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
      <h4 class="text-sm font-medium text-pink-800 mb-2">📱 What's Included:</h4>
      <ul class="space-y-1 text-sm text-pink-700">
        <li>• Content creation & curation</li>
        <li>• Professional graphic design</li>
        <li>• Hashtag research & optimization</li>
        <li>• Community management</li>
        <li>• Monthly analytics reports</li>
        <li>• Brand consistency maintenance</li>
      </ul>
    </div>
  </div>
</div>