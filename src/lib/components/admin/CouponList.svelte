<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Coupon } from '$lib/types/coupon';
  import { COUPON_TYPES } from '$lib/types/coupon';
  import { fade, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  export let coupons: Coupon[] = [];
  export let loading = false;

  const dispatch = createEventDispatcher();

  function handleEdit(coupon: Coupon) {
    dispatch('edit', coupon);
  }

  function handleDelete(coupon: Coupon) {
    dispatch('delete', coupon);
  }

  function handleToggleStatus(coupon: Coupon) {
    dispatch('toggleStatus', coupon);
  }

  function getCouponTypeLabel(type: string): string {
    return COUPON_TYPES.find(t => t.value === type)?.label || type;
  }

  function getStatusStyle(active: boolean): string {
    return active 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  }

  function formatDate(dateString: string): string {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function isExpired(dateString: string): boolean {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  }

  function getUsagePercentage(used: number, limit: number): number {
    if (!limit) return 0;
    return Math.min((used / limit) * 100, 100);
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
  <!-- Header -->
  <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">
        Coupon Management
      </h3>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {coupons.length} {coupons.length === 1 ? 'Coupon' : 'Coupons'}
      </span>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  {:else if coupons.length === 0}
    <!-- Empty State -->
    <div class="text-center py-12 px-6">
      <div class="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No coupons found</h3>
      <p class="text-gray-500 text-sm">
        Create your first coupon to start offering credit rewards to users.
      </p>
    </div>
  {:else}
    <!-- Coupon Cards Grid -->
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each coupons as coupon (coupon.id)}
          <div 
            class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 {isExpired(coupon.expires_at) ? 'opacity-75' : ''}"
            in:fly={{ y: 20, duration: 300, delay: 50 }}
            out:fade={{ duration: 200 }}
            animate:flip={{ duration: 300 }}
          >
            <!-- Coupon Header -->
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-white">
              <div class="flex items-center justify-between">
                <div class="font-mono text-lg font-bold">
                  {coupon.name}
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold">
                    {coupon.credits}
                  </div>
                  <div class="text-xs opacity-90">Credits</div>
                </div>
              </div>
            </div>

            <!-- Coupon Body -->
            <div class="p-4 space-y-3">
              <!-- Type and Status -->
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getCouponTypeLabel(coupon.tp)}
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {getStatusStyle(coupon.active)}">
                  {coupon.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <!-- Description -->
              {#if coupon.description}
                <p class="text-sm text-gray-600 line-clamp-2">
                  {coupon.description}
                </p>
              {/if}

              <!-- Usage Stats -->
              {#if coupon.usage_limit}
                <div>
                  <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Usage</span>
                    <span>{coupon.used_count || 0} / {coupon.usage_limit}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style="width: {getUsagePercentage(coupon.used_count || 0, coupon.usage_limit)}%"
                    ></div>
                  </div>
                </div>
              {:else}
                <div class="text-xs text-gray-500">
                  Used: {coupon.used_count || 0} times (Unlimited)
                </div>
              {/if}

              <!-- Expiry -->
              <div class="text-xs text-gray-500">
                <span class="font-medium">Expires:</span>
                <span class="{isExpired(coupon.expires_at) ? 'text-red-600 font-medium' : ''}">
                  {formatDate(coupon.expires_at)}
                </span>
                {#if isExpired(coupon.expires_at)}
                  <span class="text-red-600 font-medium ml-1">(Expired)</span>
                {/if}
              </div>

              <!-- Created Date -->
              {#if coupon.created_at}
                <div class="text-xs text-gray-400">
                  Created: {new Date(coupon.created_at).toLocaleDateString()}
                </div>
              {/if}
            </div>

            <!-- Actions -->
            <div class="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <button
                  on:click={() => handleToggleStatus(coupon)}
                  class="text-xs font-medium px-3 py-1.5 rounded-md transition-colors duration-200 {
                    coupon.active 
                      ? 'text-red-600 hover:bg-red-50 border border-red-200' 
                      : 'text-green-600 hover:bg-green-50 border border-green-200'
                  }"
                >
                  {coupon.active ? 'Deactivate' : 'Activate'}
                </button>

                <div class="flex items-center space-x-2">
                  <button
                    on:click={() => handleEdit(coupon)}
                    class="text-xs font-medium text-blue-600 hover:text-white hover:bg-blue-600 px-3 py-1.5 rounded-md transition-all duration-200 border border-blue-200 hover:border-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    on:click={() => handleDelete(coupon)}
                    class="text-xs font-medium text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-md transition-all duration-200 border border-red-200 hover:border-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Summary Footer -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>
              <span class="font-medium text-gray-900">{coupons.filter(c => c.active).length}</span>
              Active Coupons
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>
              <span class="font-medium text-gray-900">{coupons.filter(c => !c.active).length}</span>
              Inactive Coupons
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>
              <span class="font-medium text-gray-900">{coupons.filter(c => isExpired(c.expires_at)).length}</span>
              Expired
            </span>
          </div>
        </div>
        <div>
          Total: <span class="font-medium text-gray-900">{coupons.length}</span> coupons
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
</style>