<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { user } from '$lib/stores/auth';
  import { getUserCredits, redeemCoupon, getUserCoupons } from '$lib/supabase';
  import Button from '$lib/components/Button.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';
    import type { Coupon } from '$lib/types/coupon';

  export let show = false;
  export let amount = 0;
  export let tp;

  const dispatch = createEventDispatcher();

  // Component state
  let userCredits = 0;
  let availableCoupons: Coupon[] = [];
  let selectedCoupon: Coupon ;
  let loading = false;
  let loadingCredits = false;
  let loadingCoupons = false;
  let couponCode = '';
  let couponError = '';
  let couponSuccess = '';

  // Calculated values
  $: finalAmount = selectedCoupon ? Math.max(0, amount - selectedCoupon.credits) : amount;
  $: canAfford = userCredits >= finalAmount;
  $: savings = selectedCoupon ? Math.min(amount, selectedCoupon.credits) : 0;

  onMount(() => {
    if (show) {
      loadUserData();
    }
  });

  $: if (show) {
    loadUserData();
  }

  async function loadUserData() {
    await Promise.all([loadUserCredits(), loadAvailableCoupons()]);
  }

  async function loadUserCredits() {
    if (!$user) return;
    
    try {
      loadingCredits = true;
      const { data, error } = await getUserCredits($user.id);
      if (error) throw error;
      userCredits = data || 0;
    } catch (err) {
      console.error('Error loading credits:', err);
    } finally {
      loadingCredits = false;
    }
  }

  async function loadAvailableCoupons() {
    if (!$user?.id) return;
    try {
      loadingCoupons = true;
      const { data, error } = await getUserCoupons($user?.id);
      if (error) throw error;
      availableCoupons = data || [];
    } catch (err) {
      console.error('Error loading coupons:', err);
    } finally {
      loadingCoupons = false;
    }
  }

  async function handleRedeemCoupon() {
    if (!couponCode.trim() || !$user) return;

    try {
      loading = true;
      couponError = '';
      couponSuccess = '';

      const { data, error } = await redeemCoupon(couponCode.trim(), $user.id);
      
      if (error) {
        couponError = error.message;
        return;
      }

      if (data?.coupon) {
        selectedCoupon = data.coupon;
        couponSuccess = `Coupon applied! You saved ${data.credits} credits.`;
        couponCode = '';
        await loadUserCredits(); // Refresh credits
      }
    } catch (err: any) {
      couponError = err.message || 'Failed to redeem coupon';
    } finally {
      loading = false;
    }
  }

  function selectCoupon(coupon: any) {
    selectedCoupon = coupon;
    couponCode = '';
    couponError = '';
    couponSuccess = '';
  }

  function removeCoupon() {
    selectedCoupon = null;
    couponSuccess = '';
  }

  function handleConfirm() {
    dispatch('confirm', {
      amount: finalAmount,
      coupon: selectedCoupon,
      savings
    });
  }

  function handleClose() {
    dispatch('close');
  }

  function formatCredits(credits: number): string {
    return new Intl.NumberFormat('en-US').format(credits);
  }
</script>

{#if show}
  <FormBackdrop handleClose={handleClose}>
    <div 
      class="bg-white rounded-2xl shadow-2xl w-full overflow-hidden"
      in:scale={{ duration: 400, start: 0.9, easing: elasticOut }}
      out:fade={{ duration: 200 }}
    >
      <!-- Header -->
      <div class="bg-primary px-6 py-4 text-white relative overflow-hidden">
        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold mb-1">Confirm Payment</h2>
              <p class="text-blue-100 text-sm">{tp}</p>
            </div>
            <button
              on:click={handleClose}
              class="text-white hover:text-gray-200 transition-colors duration-200 p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="space-y-6">
        <!-- Service Details -->
        <div class="text-center">
          <div class="text-3xl font-bold text-gray-900 mb-1">
            {formatCredits(amount)} Credits
          </div>
        </div>

        <!-- Current Credits -->
        <div class="bg-gray-50 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-700">Your Credits</div>
                <div class="text-lg font-bold text-gray-900">
                  {#if loadingCredits}
                    <div class="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                  {:else}
                    {formatCredits(userCredits)}
                  {/if}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-500">Available</div>
              <div class="text-sm font-medium {canAfford ? 'text-green-600' : 'text-red-600'}">
                {canAfford ? '✓ Sufficient' : '✗ Insufficient'}
              </div>
            </div>
          </div>
        </div>

        <!-- Coupon Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900">Apply Coupon</h3>
          
          <!-- Selected Coupon -->
          {#if selectedCoupon}
            <div class="bg-green-50 border border-green-200 rounded-lg p-4" in:fly={{ y: 20, duration: 300 }}>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-green-800">{selectedCoupon.name}</div>
                    <div class="text-sm text-green-600">-{formatCredits(selectedCoupon.credits)} credits</div>
                  </div>
                </div>
                <button
                  on:click={removeCoupon}
                  class="text-green-600 hover:text-green-700 p-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          {:else}
            <!-- Coupon Input -->
            <div class="space-y-3">
              <!-- <div class="flex space-x-2">
                <input
                  type="text"
                  bind:value={couponCode}
                  placeholder="Enter coupon code"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                  style="text-transform: uppercase"
                  disabled={loading}
                />
                <Button
                  onclick={handleRedeemCoupon}
                  disabled={!couponCode.trim() || loading}
                  loading={loading}
                  class_name="px-4 py-2 text-sm"
                >
                  Apply
                </Button>
              </div> -->

              {#if couponError}
                <p class="text-sm text-red-600">{couponError}</p>
              {/if}

              {#if couponSuccess}
                <p class="text-sm text-green-600">{couponSuccess}</p>
              {/if}
            </div>

            <!-- Available Coupons -->
            {#if availableCoupons.length > 0}
              <div class="space-y-2">
                <div class="text-sm font-medium text-gray-700">Available Coupons:</div>
                <div class="space-y-2 max-h-32 overflow-y-auto">
                  {#each availableCoupons.slice(0, 3) as coupon}
                    <button
                      on:click={() => selectCoupon(coupon)}
                      class={`w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${tp !== coupon.tp ? 'cursor-not-allowed':''}`}
                      disabled={loading || tp !== coupon.tp}
                    >
                      <div class="flex items-center justify-between">
                        <div class="text-gray-500">{coupon.description || 'No description'}</div>
                        <div class="text-sm font-bold text-blue-600">
                          {formatCredits(coupon.credits)}
                        </div>
                      </div>
                    </button>
                  {/each}
                </div>
              </div>
            {/if}
          {/if}
        </div>
        </div>

        <div class="space-y-6">
        <!-- Payment Summary -->
        <div class="bg-gray-50 rounded-xl p-4 space-y-3">
          <h4 class="font-semibold text-gray-900">Payment Summary</h4>
          
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Service Cost</span>
              <span class="font-medium">{formatCredits(amount)} credits</span>
            </div>
            
            {#if selectedCoupon}
              <div class="flex justify-between text-green-600">
                <span>Coupon Discount</span>
                <span class="font-medium">-{formatCredits(savings)} credits</span>
              </div>
            {/if}
            
            <div class="border-t border-gray-200 pt-2">
              <div class="flex justify-between text-base font-semibold">
                <span>Total Cost</span>
                <span class="{finalAmount === 0 ? 'text-green-600' : 'text-gray-900'}">
                  {formatCredits(finalAmount)} credits
                </span>
              </div>
            </div>
            
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Remaining Credits</span>
              <span class="font-medium {(userCredits - finalAmount) >= 0 ? 'text-green-600' : 'text-red-600'}">
                {formatCredits(userCredits - finalAmount)}
              </span>
            </div>
          </div>
        </div>

        <!-- Insufficient Credits Warning -->
        {#if !canAfford}
          <div class="bg-red-50 border border-red-200 rounded-lg p-4" in:fly={{ y: 20, duration: 300 }}>
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h4 class="text-sm font-medium text-red-800">Insufficient Credits</h4>
                <p class="text-sm text-red-700 mt-1">
                  You need {formatCredits(finalAmount - userCredits)} more credits to complete this payment.
                </p>
              </div>
            </div>
          </div>
        {/if}

        <!-- Action Buttons -->
        <div class="flex flex-col space-y-3">
          <Button
            onclick={handleConfirm}
            disabled={!canAfford || loading}
            class_name="w-full"
          >
            {finalAmount === 0 ? 'Redeem for Free' : `Pay ${formatCredits(finalAmount)} Credits`}
          </Button>
          
          {#if !canAfford}
            <Button
              variant="secondary"
              onclick={() => dispatch('addCredits')}
              class_name="w-full"
            >
              Add More Credits
            </Button>
          {/if}
          
          <Button
            variant="secondary"
            onclick={handleClose}
            disabled={loading}
            class_name="w-full"
          >
            Cancel
          </Button>
        </div>
        
        </div>
      </div>
    </div>
  </FormBackdrop>
{/if}