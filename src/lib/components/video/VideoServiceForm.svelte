<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { VideoService } from '$lib/types/video';
  import { VIDEO_SERVICE_TYPES, EMPTY_VIDEO_SERVICE, calculateVideoServicePrice } from '$lib/types/video';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';
  import Select from '$lib/components/Select.svelte';
  import { user } from '$lib/stores/auth';

  export let videoService: VideoService = { ...EMPTY_VIDEO_SERVICE };
  export let isEdit = false;
  export let loading = false;

  const dispatch = createEventDispatcher();

  // Form validation
  let errors: Record<string, string> = {};

  // Calculate pricing
  $: pricingInfo = calculateVideoServicePrice(
    videoService.service_type, 
    videoService.number_of_videos, 
    videoService.price
  );

  // Service type options for select
  const serviceTypeOptions = VIDEO_SERVICE_TYPES.map(type => ({
    value: type.value,
    label: `${type.label} - $${type.price}${type.isCustomQuote ? ' (Custom Quote)' : ''}`
  }));

  function validateForm(): boolean {
    errors = {};

    if (!videoService.service_type) {
      errors.service_type = 'Please select a service type';
    }

    if (!videoService.number_of_videos || videoService.number_of_videos < 1) {
      errors.number_of_videos = 'Number of videos must be at least 1';
    }

    if (videoService.price !== undefined && videoService.price < 0) {
      errors.price = 'Price cannot be negative';
    }

    return Object.keys(errors).length === 0;
  }

  function handleSubmit() {
    if (validateForm()) {
      // Set the calculated price if not custom
      if (!pricingInfo.isCustomPrice && pricingInfo.totalPrice > 0) {
        videoService.price = pricingInfo.totalPrice;
      }
      dispatch('submit', videoService);
    }
  }

  function handleCancel() {
    dispatch('cancel');
  }

  // Format currency
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl mx-auto">
  <!-- Header -->
  <div class="bg-primary px-6 py-4 text-white">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">
        {isEdit ? 'Edit Video Service Request' : 'New Video Service Request'}
      </h2>
      <button
        on:click={handleCancel}
        class="text-white hover:text-gray-200 transition-colors duration-200"
        disabled={loading}
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <p class="text-blue-100 text-sm mt-1">
      {isEdit ? 'Update your video editing request' : 'Request professional video editing services'}
    </p>
  </div>

  <!-- Form -->
  <form on:submit|preventDefault={handleSubmit} class="p-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column - Form Fields -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Service Type -->
        <div>
          <Select
            id="service_type"
            label="Service Type *"
            bind:value={videoService.service_type}
            options={serviceTypeOptions}
            disabled={loading}
          />
          {#if errors.service_type}
            <p class="mt-1 text-sm text-red-600">{errors.service_type}</p>
          {/if}
          {#if pricingInfo.serviceInfo}
            <p class="text-xs text-gray-500 mt-1">{pricingInfo.serviceInfo.description}</p>
          {/if}
        </div>

        <!-- Number of Videos -->
        <div>
          <Input
            id="number_of_videos"
            label="Number of Videos *"
            type="number"
            bind:value={videoService.number_of_videos}
            min="1"
            step="1"
            placeholder="1"
            disabled={loading}
            required
          />
          {#if errors.number_of_videos}
            <p class="mt-1 text-sm text-red-600">{errors.number_of_videos}</p>
          {/if}
          <p class="text-xs text-gray-500 mt-1">How many videos do you need edited?</p>
        </div>

        <!-- Custom Price (Admin Only) -->
        {#if $user?.isAdmin}
          <div>
            <Input
              id="price"
              label="Custom Price (CAD)"
              type="number"
              bind:value={videoService.price}
              min="0"
              step="0.01"
              placeholder="Leave empty for standard pricing"
              disabled={loading}
            />
            {#if errors.price}
              <p class="mt-1 text-sm text-red-600">{errors.price}</p>
            {/if}
            <p class="text-xs text-gray-500 mt-1">
              Override standard pricing. Leave empty to use calculated price.
            </p>
          </div>
        {/if}

        <!-- Notes -->
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
            Project Details & Requirements
          </label>
          <textarea
            id="notes"
            bind:value={videoService.notes}
            rows="6"
            placeholder="Please describe your video editing requirements, style preferences, deadlines, and any specific instructions..."
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Include details about video content, desired style, music preferences, branding requirements, etc.
          </p>
        </div>
      </div>

      <!-- Right Column - Pricing Calculator -->
      <div class="lg:col-span-1">
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 sticky top-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Video Service Quote
          </h3>
          
          {#if pricingInfo.serviceInfo}
            <div class="space-y-4">
              <!-- Service Details -->
              <div class="bg-white rounded-lg p-4 border border-purple-300">
                <div class="text-center">
                  <div class="text-sm text-gray-600 mb-1">Selected Service</div>
                  <div class="text-lg font-bold text-purple-600 mb-2">
                    {pricingInfo.serviceInfo.label}
                  </div>
                  <div class="text-xs text-gray-500">
                    Turnaround: {pricingInfo.serviceInfo.turnaround}
                  </div>
                </div>
              </div>

              <!-- Pricing Breakdown -->
              <div class="space-y-3">
                <h4 class="text-sm font-semibold text-gray-700">Pricing Breakdown:</h4>
                
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Price per video:</span>
                  <span class="font-medium">
                    {#if pricingInfo.serviceInfo.isCustomQuote && !pricingInfo.isCustomPrice}
                      Custom Quote
                    {:else}
                      {formatCurrency(pricingInfo.basePrice)}
                      {#if pricingInfo.isCustomPrice}
                        <span class="text-xs text-purple-600">(Custom)</span>
                      {/if}
                    {/if}
                  </span>
                </div>
                
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Number of videos:</span>
                  <span class="font-medium">{videoService.number_of_videos}</span>
                </div>
                
                <div class="border-t border-purple-200 pt-2">
                  <div class="flex justify-between text-base font-semibold">
                    <span>Total Cost:</span>
                    <span class="text-purple-600">
                      {#if pricingInfo.serviceInfo.isCustomQuote && !pricingInfo.isCustomPrice}
                        Contact for Quote
                      {:else}
                        {formatCurrency(pricingInfo.totalPrice)}
                        {#if pricingInfo.isCustomPrice}
                          <span class="text-xs text-purple-600">(Custom)</span>
                        {/if}
                      {/if}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Service Features -->
              <div class="bg-purple-100 rounded-lg p-3 text-xs text-purple-800">
                <div class="font-medium mb-1">🎬 What's Included:</div>
                <ul class="space-y-1 text-purple-700">
                  <li>• Professional video editing</li>
                  <li>• Color correction & grading</li>
                  <li>• Audio enhancement</li>
                  <li>• Transitions & effects</li>
                  <li>• Multiple format delivery</li>
                  <li>• 2 rounds of revisions</li>
                </ul>
              </div>

              {#if pricingInfo.serviceInfo.isAddon}
                <div class="bg-blue-100 rounded-lg p-3 text-xs text-blue-800">
                  <div class="font-medium mb-1">ℹ️ Add-on Service</div>
                  <div class="text-blue-700">
                    This is an add-on service that requires a base video editing service.
                  </div>
                </div>
              {/if}

              {#if videoService.number_of_videos >= 5}
                <div class="bg-green-100 rounded-lg p-3 text-xs text-green-800">
                  <div class="font-medium mb-1">💰 Bulk Discount Available!</div>
                  <div class="text-green-700">
                    Consider our bulk package for 5+ videos with priority turnaround and custom pricing.
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            <div class="text-center py-8">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              <p class="text-sm text-gray-600 mb-2">Select a service type to see pricing</p>
              <p class="text-xs text-gray-500">
                Choose from our professional video editing services
              </p>
            </div>
          {/if}

          <!-- Contact Info -->
          <div class="mt-4 pt-4 border-t border-purple-200">
            <div class="text-xs text-gray-600 space-y-1">
              <div class="font-medium text-gray-700">📞 Need Help?</div>
              <div>• Custom quotes available</div>
              <div>• Rush delivery options</div>
              <div>• Bulk pricing discounts</div>
              <div>• All prices in CAD</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
      <Button
        type="button"
        variant="secondary"
        onclick={handleCancel}
        disabled={loading}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        loading={loading}
        disabled={loading}
      >
        {isEdit ? 'Update Request' : 'Submit Request'}
        {#if pricingInfo.totalPrice > 0}
          <span class="ml-2 text-sm opacity-75">
            ({formatCurrency(pricingInfo.totalPrice)})
          </span>
        {/if}
      </Button>
    </div>
  </form>
</div>