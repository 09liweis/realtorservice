<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { VideoService } from '$lib/types/video';
  import { VIDEO_SERVICE_ADDONS, calculateVideoServicePrice, getServiceTypeInfo } from '$lib/types/video';
  import Link from '../Link.svelte';
  import { formatAmount, getStatusStyle } from '$lib/types/constant';
  import { formatDate } from '$lib/helper';
  import CardWrapper from "../common/CardWrapper.svelte";
  import VideoServiceCard from './VideoServiceCard.svelte';

  export let videoServices: VideoService[] = [];
  export let loading = false;

  const dispatch = createEventDispatcher();

  function handleEdit(videoService: VideoService) {
    dispatch('edit', videoService);
  }

  function handleDelete(videoService: VideoService) {
    dispatch('delete', videoService);
  }

  function getAddonInfo(addonType: string) {
    return VIDEO_SERVICE_ADDONS.find(addon => addon.value === addonType);
  }

  function getDisplayPrice(videoService: VideoService): string {
    // If there's a custom price set, use it
    if (videoService.price && videoService.price > 0) {
      return formatAmount(videoService.price);
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

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
  <!-- Header -->
  <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">
        Video Service Requests
      </h3>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        {videoServices.length} {videoServices.length === 1 ? 'Request' : 'Requests'}
      </span>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
  {:else if videoServices.length === 0}
    <!-- Empty State -->
    <div class="text-center py-12 px-6">
      <div class="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No video service requests</h3>
      <p class="text-gray-500 text-sm">
        Create your first video editing request to get started with professional video services.
      </p>
    </div>
  {:else}
    <!-- Video Service Cards Grid -->
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each videoServices as videoService, index (videoService.id)}
          <VideoServiceCard {videoService} on:edit on:delete />
        {/each}
      </div>
    </div>
  {/if}
</div>

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