<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { VideoService } from '$lib/types/video';
  import { VIDEO_SERVICE_ADDONS, calculateVideoServicePrice, getServiceTypeInfo } from '$lib/types/video';
  import Link from '../Link.svelte';
  import { DASHBOARD_VIDEO_SERVICES_URL, formatAmount, getStatusStyle } from '$lib/types/constant';
  import { formatDate } from '$lib/helper';
  import CardWrapper from "../common/CardWrapper.svelte";
  import { user } from '$lib/stores/auth';

  export let videoService: VideoService;

  const dispatch = createEventDispatcher();

  function handleEdit() {
    dispatch('edit', videoService);
  }

  function handleDelete() {
    dispatch('delete', videoService);
  }

  function getAddonInfo(addonType: string) {
    return VIDEO_SERVICE_ADDONS.find(addon => addon.value === addonType);
  }

  function getDisplayPrice(): string {
    // If there's a custom price set, use it
    if (videoService.estimate_price && videoService.estimate_price > 0) {
      return formatAmount(videoService.estimate_price);
    }

    // Otherwise calculate from service type and addons
    const serviceInfo = getServiceTypeInfo(videoService.service_type);
    if (serviceInfo?.isCustomQuote) {
      return 'Custom Quote';
    }

    const pricingInfo = calculateVideoServicePrice(
      videoService.service_type, 
      videoService.number_of_videos,
      videoService.addons || []
    );
    return pricingInfo.totalPrice > 0 ? formatAmount(pricingInfo.totalPrice) : 'Quote Pending';
  }
</script>

<CardWrapper request={videoService}>
  <!-- Service Header -->
  <div class="px-4 py-3">
    <div class="flex items-center justify-between">
      <Link href={`${DASHBOARD_VIDEO_SERVICES_URL}/${videoService.id}`} className="text-white">
        {getServiceTypeInfo(videoService.service_type)?.label || videoService.service_type}
      </Link>
      <div class="text-right">
        <div class="text-lg font-bold">
          {videoService.number_of_videos}
        </div>
        <div class="text-xs opacity-90">
          {videoService.number_of_videos === 1 ? 'Video' : 'Videos'}
        </div>
      </div>
    </div>
  </div>

  <!-- Service Body -->
  <div class="p-4 space-y-3">
    <div class="flex items-center justify-between">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize {getStatusStyle(videoService.status)}">
        {videoService.status}
      </span>
    </div>

    <!-- Add-ons Display -->
    {#if videoService.addons && videoService.addons.length > 0}
      <div class="bg-purple-50 rounded-lg p-3">
        <div class="text-xs font-medium text-purple-800 mb-2">Add-ons:</div>
        <div class="space-y-1">
          {#each videoService.addons as addonType}
            {@const addonInfo = getAddonInfo(addonType)}
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
          Estimated Cost:
        </span>
        <span class="font-bold text-purple-600">
          {getDisplayPrice()}
        </span>
      </div>
      {#if getServiceTypeInfo(videoService.service_type)}
        <div class="text-xs text-gray-500 mt-1">
          Turnaround: {getServiceTypeInfo(videoService.service_type)?.turnaround}
        </div>
      {/if}
    </div>

    <!-- Notes Preview -->
    {#if videoService.notes}
      <div class="text-xs text-gray-600 line-clamp-3">
        <span class="font-medium">Notes:</span> {videoService.notes}
      </div>
    {/if}

    <!-- Created Date -->
    {#if videoService.created_at}
      <div class="text-xs text-gray-400">
        Created: {formatDate(videoService.created_at)}
      </div>
    {/if}
  </div>

  <!-- Actions -->
  <div class="px-4 py-3 bg-gray-50 border-t border-gray-200">
    <div class="flex items-center justify-between">
      <div class="text-xs text-gray-500">
        ID: {videoService.id?.slice(-8) || 'N/A'}
      </div>

      <div class="flex items-center space-x-2">

        {#if ($user?.user_id === videoService.user_id && videoService.status === 'submitted')}
        <button
          on:click={handleEdit}
          class="text-xs font-medium text-purple-600 hover:text-white hover:bg-purple-600 px-3 py-1.5 rounded-md transition-all duration-200 border border-purple-200 hover:border-purple-600"
        >
          Edit
        </button>
        <button
          on:click={handleDelete}
          class="text-xs font-medium text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-md transition-all duration-200 border border-red-200 hover:border-red-600"
        >
          Delete
        </button>
        {/if}
      </div>
    </div>
  </div>
</CardWrapper>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>