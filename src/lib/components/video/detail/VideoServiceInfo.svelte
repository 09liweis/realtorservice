<script lang="ts">
    import { formatAmount } from '$lib/types/constant';
  import type { VideoService } from '$lib/types/video';

  export let videoService: VideoService;
  export let serviceTypeInfo: any;
  export let addonInfo: any[];
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200">
  <div class="px-6 py-4 border-b border-gray-200">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-900">Service Details</h2>
    </div>
  </div>

  <div class="p-6">
    <!-- Service Type Information -->
    {#if serviceTypeInfo}
      <div class="bg-purple-50 rounded-xl p-6 border border-purple-200 mb-6">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <span class="text-2xl">🎥</span>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-purple-900 mb-2">
              {serviceTypeInfo.label}
            </h3>
            <p class="text-purple-700 mb-3">
              {serviceTypeInfo.description}
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                <span class="text-purple-700">
                  {serviceTypeInfo.isCustomQuote ? 'Custom Quote' : formatAmount(serviceTypeInfo.price)}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-purple-700">{serviceTypeInfo.turnaround}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Add-on Services -->
    {#if addonInfo.length > 0}
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add-on Services</h3>
        <div class="space-y-3">
          {#each addonInfo as addon}
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{addon.label}</h4>
                  <p class="text-sm text-gray-600 mt-1">{addon.description}</p>
                </div>
                <div class="text-right">
                  <div class="font-bold text-purple-600">+{formatAmount(addon.price)}</div>
                  <div class="text-xs text-gray-500">{addon.turnaround}</div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Project Notes -->
    {#if videoService?.notes}
      <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <div class="flex items-start space-x-3">
          <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-lg">📝</span>
          </div>
          <div>
            <div class="text-sm font-medium text-yellow-800 mb-1">Project Requirements</div>
            <div class="text-sm text-yellow-900 leading-relaxed whitespace-pre-line">
              {videoService?.notes}
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>