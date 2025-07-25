<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { VideoService } from '$lib/types/video';
  import { VIDEO_SERVICE_TYPES, VIDEO_SERVICE_ADDONS, calculateVideoServicePrice } from '$lib/types/video';
  import Link from '../Link.svelte';
  import { formatAmount, getStatusStyle } from '$lib/types/constant';
  import { formatDate } from '$lib/helper';
  import CardWrapper from "../common/CardWrapper.svelte";

  export let videoServices: VideoService[] = [];
  export let loading = false;

  const dispatch = createEventDispatcher();

  function handleEdit(videoService: VideoService) {
    dispatch('edit', videoService);
  }

  function handleDelete(videoService: VideoService) {
    dispatch('delete', videoService);
  }

  function getServiceTypeInfo(serviceType: string) {
    return VIDEO_SERVICE_TYPES.find(type => type.value === serviceType);
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
          <CardWrapper request={videoService}>
            <!-- Service Header -->
            <div class="px-4 py-3">
              <div class="flex items-center justify-between">
                <Link href={`/dashboard/video/${videoService.id}`} className="text-white">
                  Video Service Request
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
              <!-- Service Type and Status -->
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="font-medium text-gray-900 text-sm line-clamp-2">
                    {getServiceTypeInfo(videoService.service_type)?.label || videoService.service_type}
                  </div>
                </div>
              </div>

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
                    {videoService.price && videoService.price > 0 ? 'Final Price:' : 'Estimated Cost:'}
                  </span>
                  <span class="font-bold text-purple-600">
                    {getDisplayPrice(videoService)}
                  </span>
                </div>
                {#if getServiceTypeInfo(videoService.service_type)}
                  <div class="text-xs text-gray-500 mt-1">
                    Turnaround: {getServiceTypeInfo(videoService.service_type).turnaround}
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
                  <button
                    on:click={() => handleEdit(videoService)}
                    class="text-xs font-medium text-purple-600 hover:text-white hover:bg-purple-600 px-3 py-1.5 rounded-md transition-all duration-200 border border-purple-200 hover:border-purple-600"
                  >
                    Edit
                  </button>
                  <button
                    on:click={() => handleDelete(videoService)}
                    class="text-xs font-medium text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-md transition-all duration-200 border border-red-200 hover:border-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </CardWrapper>
        {/each}
      </div>
    </div>

    <!-- Summary Footer -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>
              <span class="font-medium text-gray-900">{videoServices.filter(v => v.status === 'pending').length}</span>
              Pending
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>
              <span class="font-medium text-gray-900">{videoServices.filter(v => v.status === 'quoted').length}</span>
              Quoted
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>
              <span class="font-medium text-gray-900">{videoServices.filter(v => v.status === 'completed').length}</span>
              Completed
            </span>
          </div>
        </div>
        <div>
          Total: <span class="font-medium text-gray-900">{videoServices.length}</span> requests
        </div>
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