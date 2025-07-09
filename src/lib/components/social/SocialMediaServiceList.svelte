<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { SocialMediaService } from '$lib/types/social';
  import { 
    SOCIAL_MEDIA_PLATFORMS, 
    SUBSCRIPTION_TYPES, 
    POSTING_FREQUENCIES, 
    SOCIAL_MEDIA_ADDONS,
    calculateSocialMediaPrice
  } from '$lib/types/social';
  import { fade, fly, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
    import { formatAmount, getStatusStyle } from '$lib/types/constant';
    import { formatDate } from '$lib/helper';

  export let socialMediaServices: SocialMediaService[] = [];
  export let loading = false;

  const dispatch = createEventDispatcher();

  function handleEdit(service: SocialMediaService) {
    dispatch('edit', service);
  }

  function handleDelete(service: SocialMediaService) {
    dispatch('delete', service);
  }


  function getDisplayPrice(service: SocialMediaService): string {
    // If there's a custom price set, use it
    if (service.quotation_price && service.quotation_price > 0) {
      return formatAmount(service.quotation_price);
    }

    // Otherwise calculate from service details
    const pricingInfo = calculateSocialMediaPrice(
      service.posting_frequency,
      service.subscription_type,
      service.addons || []
    );
    return pricingInfo.totalPrice > 0 ? formatAmount(pricingInfo.totalPrice) : 'Quote Pending';
  }

</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
  <!-- Header -->
  <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">
        Social Media Services
      </h3>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
        {socialMediaServices.length} {socialMediaServices.length === 1 ? 'Service' : 'Services'}
      </span>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
    </div>
  {:else if socialMediaServices.length === 0}
    <!-- Empty State -->
    <div class="text-center py-12 px-6">
      <div class="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002 2V8M7 8h10M9 12h6m-6 4h6"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No social media services</h3>
      <p class="text-gray-500 text-sm">
        Create your first social media management service to boost your online presence.
      </p>
    </div>
  {:else}
    <!-- Service Cards Grid -->
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each socialMediaServices as service, index (service.id)}
          <div 
            class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
            in:fly={{ y: 20, duration: 300, delay: index * 50 }}
            out:fade={{ duration: 200 }}
            animate:flip={{ duration: 300 }}
          >
            <!-- Service Header -->
            <div class="bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-3 text-white">
              <div class="flex items-center justify-between">
                <div class="text-lg font-bold">
                  <a href="/dashboard/social/{service.id}" class="text-white">
                    Social Media Service
                  </a>
                </div>
                <div class="text-right">
                  <div class="text-lg font-bold">
                    {service.platforms?.length || 0}
                  </div>
                  <div class="text-xs opacity-90">
                    {service.platforms?.length === 1 ? 'Platform' : 'Platforms'}
                  </div>
                </div>
              </div>
            </div>

            <!-- Service Body -->
            <div class="p-4 space-y-3">
              <!-- Platforms Display -->
              {#if service.platforms && service.platforms.length > 0}
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="text-xs font-medium text-gray-700 mb-2">Platforms:</div>
                  <div class="flex flex-wrap gap-1">
                    {#each service.platforms as platform}
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
                        {SOCIAL_MEDIA_PLATFORMS.find(p => p.value === platform)?.label || platform}
                      </span>
                    {/each}
                  </div>
                </div>
              {/if}

              <!-- Service Details -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Frequency:</span>
                  <span class="font-medium">
                    {POSTING_FREQUENCIES.find(f => f.value === service.posting_frequency)?.label || service.posting_frequency}
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Plan:</span>
                  <span class="font-medium">
                    {SUBSCRIPTION_TYPES.find(s => s.value === service.subscription_type)?.label || service.subscription_type}
                  </span>
                </div>
              </div>

              <!-- Status -->
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {getStatusStyle(service.status)}">
                  {service.status}
                </span>
              </div>

              <!-- Add-ons Display -->
              {#if service.addons && service.addons.length > 0}
                <div class="bg-purple-50 rounded-lg p-3">
                  <div class="text-xs font-medium text-purple-800 mb-2">Add-ons:</div>
                  <div class="space-y-1">
                    {#each service.addons as addonType}
                      {@const addonInfo = SOCIAL_MEDIA_ADDONS.find(addon => addon.value === addonType)}
                      {#if addonInfo}
                        <div class="flex justify-between text-xs text-purple-700">
                          <span>{addonInfo.label}</span>
                          <span>+{formatAmount(addonInfo.price)}</span>
                        </div>
                      {/if}
                    {/each}
                  </div>
                </div>
              {/if}

              <!-- Pricing Info -->
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">
                    {service.quotation_price && service.quotation_price > 0 ? 'Final Price:' : 'Estimated Cost:'}
                  </span>
                  <span class="font-bold text-pink-600">
                    {getDisplayPrice(service)}
                  </span>
                </div>
              </div>

              <!-- Notes Preview -->
              {#if service.notes}
                <div class="text-xs text-gray-600 line-clamp-3">
                  <span class="font-medium">Notes:</span> {service.notes}
                </div>
              {/if}

              <!-- Created Date -->
              {#if service.created_at}
                <div class="text-xs text-gray-400">
                  Created: {formatDate(service.created_at)}
                </div>
              {/if}
            </div>

            <!-- Actions -->
            <div class="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500">
                  ID: {service.id?.slice(-8) || 'N/A'}
                </div>

                <div class="flex items-center space-x-2">
                  <button
                    on:click={() => handleEdit(service)}
                    class="text-xs font-medium text-pink-600 hover:text-white hover:bg-pink-600 px-3 py-1.5 rounded-md transition-all duration-200 border border-pink-200 hover:border-pink-600"
                  >
                    Edit
                  </button>
                  <button
                    on:click={() => handleDelete(service)}
                    class="text-xs font-medium text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-md transition-all duration-200 border border-red-200 hover:border-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>