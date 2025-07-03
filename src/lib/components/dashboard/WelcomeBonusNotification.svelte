<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';

  export let appliedCoupons: any[] = [];
  export let totalCredits: number = 0;
  export let show: boolean = false;

  const dispatch = createEventDispatcher();

  function handleClose() {
    dispatch('close');
  }

  function formatCredits(credits: number): string {
    return new Intl.NumberFormat('en-US').format(credits);
  }
</script>

{#if show && appliedCoupons.length > 0}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    in:fade={{ duration: 300 }}
    out:fade={{ duration: 200 }}
  >
    <div 
      class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      in:scale={{ duration: 400, start: 0.9, easing: elasticOut }}
      out:scale={{ duration: 200, start: 0.9 }}
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-black opacity-10"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span class="text-2xl">🎉</span>
              </div>
              <div>
                <h2 class="text-xl font-bold">Welcome Bonus!</h2>
                <p class="text-green-100 text-sm">You've received free credits</p>
              </div>
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
      <div class="p-6">
        <!-- Total Credits Display -->
        <div class="text-center mb-6">
          <div class="text-4xl font-bold text-green-600 mb-2">
            {formatCredits(totalCredits)}
          </div>
          <p class="text-gray-600">Credits Added to Your Account</p>
        </div>

        <!-- Applied Coupons List -->
        <div class="space-y-3 mb-6">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Applied Coupons:</h3>
          {#each appliedCoupons as coupon, index}
            <div 
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              in:fly={{ x: 20, duration: 300, delay: index * 100 }}
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-medium text-gray-900 text-sm">{coupon.name}</div>
                  {#if coupon.description}
                    <div class="text-xs text-gray-500">{coupon.description}</div>
                  {/if}
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold text-green-600">+{formatCredits(coupon.credits)}</div>
                <div class="text-xs text-gray-500">credits</div>
              </div>
            </div>
          {/each}
        </div>

        <!-- How to Use Credits -->
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
          <h4 class="text-sm font-semibold text-blue-800 mb-2">💡 How to Use Your Credits</h4>
          <ul class="text-xs text-blue-700 space-y-1">
            <li>• Use credits for premium staging services</li>
            <li>• Apply credits to cleaning service bookings</li>
            <li>• Access exclusive listing features</li>
            <li>• Credits never expire</li>
          </ul>
        </div>

        <!-- Action Button -->
        <button
          on:click={handleClose}
          class="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
        >
          Start Exploring
        </button>

        <!-- Footer Note -->
        <p class="text-center text-xs text-gray-500 mt-4">
          Welcome to our platform! Your credits are ready to use.
        </p>
      </div>
    </div>
  </div>
{/if}