<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { SocialMediaService } from '$lib/types/social';
  import { 
    SOCIAL_MEDIA_PLATFORMS, 
    SUBSCRIPTION_TYPES, 
    POSTING_FREQUENCIES, 
    SOCIAL_MEDIA_ADDONS,
    EMPTY_SOCIAL_MEDIA_SERVICE,
    calculateSocialMediaPrice
  } from '$lib/types/social';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';
  import Select from '$lib/components/Select.svelte';
  import CheckBox from '$lib/components/common/CheckBox.svelte';
  import { user } from '$lib/stores/auth';
    import { formatAmount } from '$lib/types/constant';

  export let socialMediaService: SocialMediaService = { ...EMPTY_SOCIAL_MEDIA_SERVICE };
  export let isEdit = false;
  export let loading = false;

  const dispatch = createEventDispatcher();

  // Form validation
  let errors: Record<string, string> = {};

  // Initialize platforms and addons if not present
  if (!socialMediaService.platforms) {
    socialMediaService.platforms = [];
  }
  if (!socialMediaService.addons) {
    socialMediaService.addons = [];
  }

  // Calculate pricing
  $: pricingInfo = calculateSocialMediaPrice(
    socialMediaService.posting_frequency,
    socialMediaService.subscription_type,
    socialMediaService.addons || [],
    socialMediaService.quotation_price
  );

  // Update estimate_price when calculation changes
  $: {
    if (!pricingInfo.isCustomPrice) {
      socialMediaService.estimate_price = pricingInfo.totalPrice;
    }
  }

  function validateForm(): boolean {
    errors = {};

    if (!socialMediaService.platforms || socialMediaService.platforms.length === 0) {
      errors.platforms = 'Please select at least one social media platform';
    }

    if (!socialMediaService.posting_frequency) {
      errors.posting_frequency = 'Please select a posting frequency';
    }

    if (!socialMediaService.subscription_type) {
      errors.subscription_type = 'Please select a subscription type';
    }

    if (socialMediaService.quotation_price !== undefined && socialMediaService.quotation_price < 0) {
      errors.quotation_price = 'Price cannot be negative';
    }

    return Object.keys(errors).length === 0;
  }

  function handleSubmit() {
    if (validateForm()) {
      // Set the calculated price if not custom
      if (!pricingInfo.isCustomPrice && pricingInfo.totalPrice > 0) {
        socialMediaService.estimate_price = pricingInfo.totalPrice;
      }
      dispatch('submit', socialMediaService);
    }
  }

  function handleCancel() {
    dispatch('cancel');
  }

  function handlePlatformChange(platform: string, checked: boolean) {
    if (!socialMediaService.platforms) {
      socialMediaService.platforms = [];
    }
    
    if (checked) {
      if (!socialMediaService.platforms.includes(platform)) {
        socialMediaService.platforms = [...socialMediaService.platforms, platform];
      }
    } else {
      socialMediaService.platforms = socialMediaService.platforms.filter(p => p !== platform);
    }
  }

  function handleAddonChange(addonValue: string, checked: boolean) {
    if (!socialMediaService.addons) {
      socialMediaService.addons = [];
    }
    
    if (checked) {
      if (!socialMediaService.addons.includes(addonValue)) {
        socialMediaService.addons = [...socialMediaService.addons, addonValue];
      }
    } else {
      socialMediaService.addons = socialMediaService.addons.filter(addon => addon !== addonValue);
    }
  }

  // Get discount percentage
  function getDiscountPercentage(frequency: string, subscription: string): number {
    if (subscription === 'Monthly') return 0;
    
    const pricing = {
      Weekly: { Monthly: 480, 'Semi-Annual': 2580, Annual: 4800 },
      'Bi-Weekly': { Monthly: 280, 'Semi-Annual': 1500, Annual: 2800 },
      Monthly: { Monthly: 160, 'Semi-Annual': 870, Annual: 1600 }
    };

    const monthlyPrice = pricing[frequency]?.Monthly || 0;
    const subscriptionPrice = pricing[frequency]?.[subscription] || 0;
    const months = subscription === 'Semi-Annual' ? 6 : 12;
    
    if (monthlyPrice === 0 || subscriptionPrice === 0) return 0;
    
    const fullPrice = monthlyPrice * months;
    return Math.round(((fullPrice - subscriptionPrice) / fullPrice) * 100);
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto">
  <!-- Header -->
  <div class="bg-primary px-6 py-4 text-white">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">
        {isEdit ? 'Edit Social Media Service' : 'New Social Media Service'}
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
    <p class="text-pink-100 text-sm mt-1">
      {isEdit ? 'Update your social media service request' : 'Request professional social media management services'}
    </p>
  </div>

  <!-- Form -->
  <form on:submit|preventDefault={handleSubmit} class="p-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column - Form Fields -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Social Media Platforms -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Social Media Platforms *
          </label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            {#each SOCIAL_MEDIA_PLATFORMS as platform}
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <CheckBox
                  id="platform_{platform.value}"
                  label={platform.label}
                  checked={socialMediaService.platforms?.includes(platform.value) || false}
                  disabled={loading}
                  on:change={(e) => handlePlatformChange(platform.value, e.detail.checked)}
                />
              </div>
            {/each}
          </div>
          {#if errors.platforms}
            <p class="mt-1 text-sm text-red-600">{errors.platforms}</p>
          {/if}
          <p class="text-xs text-gray-500 mt-2">
            Select the social media platforms you want us to manage
          </p>
        </div>

        <!-- Posting Frequency and Subscription Type -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Select
              id="posting_frequency"
              label="Posting Frequency *"
              bind:value={socialMediaService.posting_frequency}
              options={POSTING_FREQUENCIES}
              disabled={loading}
            />
            {#if errors.posting_frequency}
              <p class="mt-1 text-sm text-red-600">{errors.posting_frequency}</p>
            {/if}
          </div>

          <div>
            <Select
              id="subscription_type"
              label="Subscription Type *"
              bind:value={socialMediaService.subscription_type}
              options={SUBSCRIPTION_TYPES}
              disabled={loading}
            />
            {#if errors.subscription_type}
              <p class="mt-1 text-sm text-red-600">{errors.subscription_type}</p>
            {/if}
          </div>
        </div>

        <!-- Add-on Services -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Add-on Services (Optional)
          </label>
          <div class="space-y-3">
            {#each SOCIAL_MEDIA_ADDONS as addon}
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <CheckBox
                  id="addon_{addon.value}"
                  label="{addon.label} - {formatAmount(addon.price)}/{addon.unit}"
                  checked={socialMediaService.addons?.includes(addon.value) || false}
                  disabled={loading}
                  on:change={(e) => handleAddonChange(addon.value, e.detail.checked)}
                />
                <p class="text-xs text-gray-500 mt-1 ml-6">
                  {addon.description}
                </p>
              </div>
            {/each}
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Select additional services to enhance your social media package
          </p>
        </div>

        <!-- Custom Price (Admin Only) -->
        {#if $user?.isAdmin}
          <div>
            <Input
              id="quotation_price"
              label="Custom Quote Price (CAD)"
              type="number"
              bind:value={socialMediaService.quotation_price}
              min="0"
              step="0.01"
              placeholder="Leave empty for standard pricing"
              disabled={loading}
            />
            {#if errors.quotation_price}
              <p class="mt-1 text-sm text-red-600">{errors.quotation_price}</p>
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
            bind:value={socialMediaService.notes}
            rows="6"
            placeholder="Please describe your social media goals, target audience, brand guidelines, content preferences, and any specific requirements..."
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            disabled={loading}
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Include details about your brand, target audience, content style, posting times, etc.
          </p>
        </div>
      </div>

      <!-- Right Column - Pricing Calculator -->
      <div class="lg:col-span-1">
        <div class="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200 sticky top-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 text-pink-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002 2V8M7 8h10M9 12h6m-6 4h6"></path>
            </svg>
            Social Media Service Quote
          </h3>
          
          {#if socialMediaService.posting_frequency && socialMediaService.subscription_type}
            <div class="space-y-4">
              <!-- Service Details -->
              <div class="bg-white rounded-lg p-4 border border-pink-300">
                <div class="text-center">
                  <div class="text-sm text-gray-600 mb-1">Selected Plan</div>
                  <div class="text-lg font-bold text-pink-600 mb-2">
                    {POSTING_FREQUENCIES.find(f => f.value === socialMediaService.posting_frequency)?.label}
                  </div>
                  <div class="text-sm text-gray-600 mb-2">
                    {SUBSCRIPTION_TYPES.find(s => s.value === socialMediaService.subscription_type)?.label}
                  </div>
                  {#if pricingInfo.savings > 0}
                    <div class="text-xs text-green-600 font-medium">
                      Save {getDiscountPercentage(socialMediaService.posting_frequency, socialMediaService.subscription_type)}%
                    </div>
                  {/if}
                </div>
              </div>

              <!-- Pricing Breakdown -->
              <div class="space-y-3">
                <h4 class="text-sm font-semibold text-gray-700">Pricing Breakdown:</h4>
                
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Base service price:</span>
                  <span class="font-medium">
                    {formatAmount(pricingInfo.basePrice)}
                    {#if pricingInfo.isCustomPrice}
                      <span class="text-xs text-pink-600">(Custom)</span>
                    {/if}
                  </span>
                </div>

                {#if socialMediaService.subscription_type !== 'Monthly'}
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Monthly equivalent:</span>
                    <span>{formatAmount(pricingInfo.monthlyEquivalent)}/month</span>
                  </div>
                {/if}

                <!-- Add-ons breakdown -->
                {#if pricingInfo.addonInfo.length > 0}
                  <div class="border-t border-pink-200 pt-2">
                    <div class="text-sm font-medium text-gray-700 mb-2">Add-ons:</div>
                    {#each pricingInfo.addonInfo as addon}
                      <div class="flex justify-between text-sm text-pink-600">
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
                  <div class="border-t border-pink-200 pt-2">
                    <div class="flex justify-between text-sm text-green-600 font-medium">
                      <span>You save:</span>
                      <span>{formatAmount(pricingInfo.savings)}</span>
                    </div>
                  </div>
                {/if}
                
                <div class="border-t border-pink-200 pt-2">
                  <div class="flex justify-between text-base font-semibold">
                    <span>Total Cost:</span>
                    <span class="text-pink-600">
                      {formatAmount(pricingInfo.totalPrice)}
                      {#if pricingInfo.isCustomPrice}
                        <span class="text-xs text-pink-600">(Custom)</span>
                      {/if}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Service Features -->
              <div class="bg-pink-100 rounded-lg p-3 text-xs text-pink-800">
                <div class="font-medium mb-1">📱 What's Included:</div>
                <ul class="space-y-1 text-pink-700">
                  <li>• Content creation & curation</li>
                  <li>• Professional graphic design</li>
                  <li>• Hashtag research & optimization</li>
                  <li>• Community management</li>
                  <li>• Monthly analytics reports</li>
                  <li>• Brand consistency maintenance</li>
                </ul>
              </div>

              {#if socialMediaService.platforms && socialMediaService.platforms.length >= 3}
                <div class="bg-green-100 rounded-lg p-3 text-xs text-green-800">
                  <div class="font-medium mb-1">🎯 Multi-Platform Advantage!</div>
                  <div class="text-green-700">
                    Managing {socialMediaService.platforms.length} platforms provides better reach and engagement across your target audience.
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            <div class="text-center py-8">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002 2V8M7 8h10M9 12h6m-6 4h6"></path>
              </svg>
              <p class="text-sm text-gray-600 mb-2">Select frequency and subscription to see pricing</p>
              <p class="text-xs text-gray-500">
                Choose your posting schedule and plan duration
              </p>
            </div>
          {/if}

          <!-- Contact Info -->
          <div class="mt-4 pt-4 border-t border-pink-200">
            <div class="text-xs text-gray-600 space-y-1">
              <div class="font-medium text-gray-700">📞 Need Help?</div>
              <div>• Custom content strategies</div>
              <div>• Multi-platform management</div>
              <div>• Performance optimization</div>
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
        {isEdit ? 'Update Service' : 'Request Service'}
        {#if pricingInfo.totalPrice > 0}
          <span class="ml-2 text-sm opacity-75">
            ({formatAmount(pricingInfo.totalPrice)})
          </span>
        {/if}
      </Button>
    </div>
  </form>
</div>