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
  import { formatAmount, getStatusStyle } from '$lib/types/constant';
  import { formatDate } from '$lib/helper';
  import CardWrapper from "../common/CardWrapper.svelte";
  import Link from '../Link.svelte';
  import { user } from '$lib/stores/auth';

  export let service: SocialMediaService;

  const dispatch = createEventDispatcher();

  function handleEdit() {
    dispatch('edit', service);
  }

  function handleDelete() {
    dispatch('delete', service);
  }

  function getDisplayPrice(): string {
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

<CardWrapper request={service}>
  <!-- Service Header -->
  <div class="px-4 py-3">
    <div class="flex items-center justify-between">
      <div class="text-lg font-bold">
        <Link href="/dashboard/social_media_services/{service.id}">
          Social Media Service
        </Link>
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
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize {getStatusStyle(service.status)}">
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
          {getDisplayPrice()}
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

    <!-- End Date -->
    {#if service.subscription_type}
      <div class="text-xs text-gray-400">
        End Date: {formatDate(service.end_date)}
      </div>
    {/if}
  </div>

  <!-- Actions -->
  <div class="px-4 py-3 bg-gray-50 border-t border-gray-200">
    <div class="flex items-center justify-between">
      <div class="text-xs text-gray-500">
        ID: {service.id?.slice(-8) || 'N/A'}
      </div>

      {#if ($user?.user_id === service.user_id && service.status === 'submitted')}
      <div class="flex items-center space-x-2">
        <button
          on:click={handleEdit}
          class="text-xs font-medium text-pink-600 hover:text-white hover:bg-pink-600 px-3 py-1.5 rounded-md transition-all duration-200 border border-pink-200 hover:border-pink-600"
        >
          Edit
        </button>
        <button
          on:click={handleDelete}
          class="text-xs font-medium text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-md transition-all duration-200 border border-red-200 hover:border-red-600"
        >
          Delete
        </button>
      </div>
      {/if}

      
    </div>
  </div>
</CardWrapper>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>