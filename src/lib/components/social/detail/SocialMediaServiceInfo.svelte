<script lang="ts">
  import { formatAmount } from '$lib/types/constant';
  import type { SocialMediaService } from '$lib/types/social';
  import { POSTING_FREQUENCIES, SUBSCRIPTION_TYPES } from '$lib/types/social';

  export let socialMediaService: SocialMediaService;
  export let platformInfo: any[];
  export let addonInfo: any[];

  function getPostingFrequencyLabel(frequency: string): string {
    return POSTING_FREQUENCIES.find(f => f.value === frequency)?.label || frequency;
  }

  function getSubscriptionTypeLabel(type: string): string {
    return SUBSCRIPTION_TYPES.find(t => t.value === type)?.label || type;
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200">
  <div class="px-6 py-4 border-b border-gray-200">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-900">Service Details</h2>
    </div>
  </div>

  <div class="p-6">
    <!-- Service Plan Information -->
    <div class="bg-pink-50 rounded-xl p-6 border border-pink-200 mb-6">
      <div class="flex items-start space-x-4">
        <div class="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
          <span class="text-2xl">📊</span>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-pink-900 mb-2">
            Social Media Management Plan
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-pink-700">
                <strong>Frequency:</strong> {getPostingFrequencyLabel(socialMediaService.posting_frequency)}
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span class="text-pink-700">
                <strong>Plan:</strong> {getSubscriptionTypeLabel(socialMediaService.subscription_type)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Social Media Platforms -->
    {#if platformInfo.length > 0}
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Selected Platforms</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          {#each platformInfo as platform}
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
              <div class="font-medium text-gray-900 mb-1">{platform.label}</div>
              <div class="text-xs text-gray-500">Social Platform</div>
            </div>
          {/each}
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
                  <div class="font-bold text-pink-600">+{formatAmount(addon.price)}</div>
                  <div class="text-xs text-gray-500">{addon.unit}</div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Project Notes -->
    {#if socialMediaService.notes}
      <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <div class="flex items-start space-x-3">
          <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-lg">📝</span>
          </div>
          <div>
            <div class="text-sm font-medium text-yellow-800 mb-1">Project Requirements</div>
            <div class="text-sm text-yellow-900 leading-relaxed whitespace-pre-line">
              {socialMediaService.notes}
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>