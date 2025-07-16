<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { getActiveCoupons } from '$lib/supabase';
  import type { Coupon } from '$lib/types/coupon';
  import { COUPON_TYPES } from '$lib/types/coupon';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';
    import { formatDate } from '$lib/helper';

  export let show = false;

  const dispatch = createEventDispatcher();

  let coupons: Coupon[] = [];
  let loading = true;
  let error = '';

  onMount(() => {
    if (show) {
      loadActiveCoupons();
    }
  });

  $: if (show) {
    loadActiveCoupons();
  }

  async function loadActiveCoupons() {
    try {
      loading = true;
      error = '';
      const { data, error: fetchError } = await getActiveCoupons();
      if (fetchError) throw fetchError;
      coupons = data || [];
    } catch (err) {
      console.error('Error loading coupons:', err);
      error = 'Failed to load available coupons';
    } finally {
      loading = false;
    }
  }

  function handleClose() {
    dispatch('close');
  }

  function getCouponTypeLabel(type: string): string {
    return COUPON_TYPES.find(t => t.value === type)?.label || type;
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log('Coupon code copied to clipboard');
    });
  }
</script>

{#if show}
  <FormBackdrop handleClose={handleClose}>
    <div 
      class="bg-white rounded-2xl shadow-2xl max-w-4xl mx-auto overflow-hidden"
      in:scale={{ duration: 400, start: 0.9, easing: elasticOut }}
      out:fade={{ duration: 200 }}
    >
      <!-- Header -->
      <div class="bg-primary p-4 text-white relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-3xl font-bold mb-2">🎉 Welcome Bonus Coupons!</h2>
              <p class="text-blue-100 text-lg">Get started with free credits for our premium services</p>
            </div>
            <button
              on:click={handleClose}
              class="text-white hover:text-gray-200 transition-colors duration-200 cursor-pointer p-2 cursor-pointer hover:bg-opacity-20 rounded-full"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
      </div>

      <!-- Content -->
      <div class="p-8">
        {#if loading}
          <div class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        {:else if error}
          <div class="text-center py-12">
            <div class="text-red-600 mb-4">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-lg font-medium">{error}</p>
            </div>
          </div>
        {:else if coupons.length === 0}
          <div class="text-center py-12">
            <div class="text-gray-400 mb-6">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              <p class="text-lg font-medium text-gray-600">No active coupons available</p>
              <p class="text-gray-500">Check back later for new offers!</p>
            </div>
          </div>
        {:else}
          <!-- Coupons Grid -->
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-6 text-center">
              Available Welcome Coupons
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {#each coupons as coupon, index (coupon.id)}
                <div 
                  class="relative group"
                  in:fly={{ y: 30, duration: 400, delay: index * 100 }}
                >
                  <!-- Coupon Card -->
                  <div class="bg-primary rounded-xl p-3 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <!-- Coupon Header -->
                    <div class="text-center mb-4">
                      <div class="text-sm font-medium opacity-90 mb-1">
                        {getCouponTypeLabel(coupon.tp)}
                      </div>
                      <div class="text-3xl font-bold mb-2">
                        {coupon.credits} Credits
                      </div>
                    </div>

                    <!-- Description -->
                    {#if coupon.description}
                      <p class="text-sm opacity-90 text-center mb-2 line-clamp-2">
                        {coupon.description}
                      </p>
                    {/if}

                    <!-- Details -->
                    <div class="space-y-2 text-xs opacity-80">
                      {#if coupon.usage_limit}
                        <div class="flex items-center justify-between">
                          <span>Limit:</span>
                          <span>{coupon.usage_limit - (coupon.used_count || 0)} uses left</span>
                        </div>
                      {:else}
                        <div class="text-center">
                          <span>Unlimited uses</span>
                        </div>
                      {/if}
                      
                      {#if coupon.expires_at}
                        <div class="flex items-center justify-between">
                          <span>Expires:</span>
                          <span>{formatDate(coupon.expires_at)}</span>
                        </div>
                      {:else}
                        <div class="text-center">
                          <span>No expiry date</span>
                        </div>
                      {/if}
                    </div>

                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Call to Action -->
        <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 text-center border border-blue-100">
          <div class="max-w-2xl mx-auto">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p class="text-gray-600 mb-6 text-lg">
              Join thousands of real estate professionals who trust our platform for their business needs. 
              Register now and redeem these exclusive coupons!
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/register"
                class="inline-flex items-center justify-center p-3 border border-transparent text-lg font-medium rounded-xl text-white bg-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
                Create Free Account
              </a>
              
              <div class="text-sm text-gray-500">
                Already have an account? 
                <a href="/login" class="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </a>
              </div>
            </div>

            <!-- Benefits -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div class="flex items-center justify-center space-x-2 text-gray-600">
                <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Free to join</span>
              </div>
              <div class="flex items-center justify-center space-x-2 text-gray-600">
                <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Instant access</span>
              </div>
              <div class="flex items-center justify-center space-x-2 text-gray-600">
                <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Professional tools</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Note -->
        <div class="mt-6 text-center text-xs text-gray-500">
          <p>
            * Coupons can be redeemed after registration. Terms and conditions apply. 
            Each coupon can only be used once per account.
          </p>
        </div>
      </div>
    </div>
  </FormBackdrop>
{/if}

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>