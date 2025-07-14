<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Coupon } from '$lib/types/coupon';
  import { COUPON_TYPES, EMPTY_COUPON } from '$lib/types/coupon';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/common/Input.svelte';
  import Select from '$lib/components/common/Select.svelte';
  import CheckBox from '$lib/components/common/CheckBox.svelte';

  export let coupon: Coupon = { ...EMPTY_COUPON };
  export let isEdit = false;
  export let loading = false;

  const dispatch = createEventDispatcher();

  // Form validation
  let errors: Record<string, string> = {};

  function validateForm(): boolean {
    errors = {};

    if (!coupon.name.trim()) {
      errors.name = 'Coupon name is required';
    }

    if (coupon.credits <= 0) {
      errors.credits = 'Credits must be greater than 0';
    }

    if (!coupon.tp) {
      errors.tp = 'Coupon type is required';
    }

    if (coupon.usage_limit && coupon.usage_limit <= 0) {
      errors.usage_limit = 'Usage limit must be greater than 0';
    }

    if (coupon.expires_at) {
      const expiryDate = new Date(coupon.expires_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expiryDate < today) {
        errors.expires_at = 'Expiry date cannot be in the past';
      }
    }

    return Object.keys(errors).length === 0;
  }

  function handleSubmit() {
    if (validateForm()) {
      dispatch('submit', coupon);
    }
  }

  function handleCancel() {
    dispatch('cancel');
  }

  // Generate coupon code suggestion
  function generateCouponCode() {
    const prefix = coupon.tp.toUpperCase().slice(0, 3);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    coupon.name = `${prefix}${random}`;
  }

  // Handle status change
  function handleStatusChange(event: CustomEvent) {
    coupon.active = event.detail.checked;
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-2xl mx-auto">
  <!-- Header -->
  <div class="bg-primary px-6 py-4 text-white">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">
        {isEdit ? 'Edit Coupon' : 'Create New Coupon'}
      </h2>
      <button
        on:click={handleCancel}
        class="text-white hover:text-gray-200 transition-colors duration-200 cursor-pointer"
        disabled={loading}
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <p class="text-blue-100 text-sm mt-1">
      {isEdit ? 'Update coupon details and settings' : 'Create a new coupon for users to redeem credits'}
    </p>
  </div>

  <!-- Form -->
  <form on:submit|preventDefault={handleSubmit} class="p-6 space-y-6">
    <!-- Coupon Name and Type -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div class="flex items-center justify-between mb-2">
          <label for="name" class="block text-sm font-medium text-gray-700">
            Coupon Code *
          </label>
          <button
            type="button"
            on:click={generateCouponCode}
            class="text-xs text-blue-600 hover:text-blue-700 font-medium"
            disabled={loading}
          >
            Generate Code
          </button>
        </div>
        <input
          type="text"
          id="name"
          bind:value={coupon.name}
          placeholder="e.g., STAGING50, WELCOME100"
          class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
          style="text-transform: uppercase"
          disabled={loading}
          required
        />
        {#if errors.name}
          <p class="mt-1 text-sm text-red-600">{errors.name}</p>
        {/if}
      </div>

      <div>
        <Select
          id="tp"
          label="Coupon Type *"
          bind:value={coupon.tp}
          options={COUPON_TYPES}
          disabled={loading}
        />
        {#if errors.tp}
          <p class="mt-1 text-sm text-red-600">{errors.tp}</p>
        {/if}
      </div>
    </div>

    <!-- Credits and Status -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Input
          id="credits"
          label="Credit Value *"
          type="number"
          bind:value={coupon.credits}
          min={1}
          step="1"
          placeholder="100"
          disabled={loading}
          required
        />
        {#if errors.credits}
          <p class="mt-1 text-sm text-red-600">{errors.credits}</p>
        {/if}
        <p class="text-xs text-gray-500 mt-1">Amount of credits this coupon provides</p>
      </div>

      <div>
        <CheckBox
          id="active"
          label="Active Status"
          bind:checked={coupon.active}
          variant="switch"
          disabled={loading}
          helpText="Toggle to activate or deactivate this coupon"
          on:change={handleStatusChange}
        />
      </div>
    </div>

    <!-- Description -->
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      <textarea
        id="description"
        bind:value={coupon.description}
        rows="3"
        placeholder="Optional description for this coupon..."
        class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={loading}
      ></textarea>
    </div>

    <!-- Usage Limit and Expiry -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Input
          id="usage_limit"
          label="Usage Limit"
          type="number"
          bind:value={coupon.usage_limit}
          min={1}
          step="1"
          placeholder="Leave empty for unlimited"
          disabled={loading}
        />
        {#if errors.usage_limit}
          <p class="mt-1 text-sm text-red-600">{errors.usage_limit}</p>
        {/if}
        <p class="text-xs text-gray-500 mt-1">Maximum number of times this coupon can be used</p>
      </div>

      <div>
        <Input
          id="expires_at"
          label="Expiry Date"
          type="date"
          bind:value={coupon.expires_at}
          disabled={loading}
        />
        {#if errors.expires_at}
          <p class="mt-1 text-sm text-red-600">{errors.expires_at}</p>
        {/if}
        <p class="text-xs text-gray-500 mt-1">Leave empty for no expiry</p>
      </div>
    </div>

    <!-- Preview -->
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
      <h4 class="text-sm font-medium text-gray-700 mb-2">Coupon Preview</h4>
      <div class="bg-white rounded-lg p-4 border-2 border-dashed border-blue-300">
        <div class="text-center">
          <div class="text-lg font-bold text-blue-600 mb-1">
            {coupon.name || 'COUPON_CODE'}
          </div>
          <div class="text-2xl font-bold text-gray-900 mb-1">
            {coupon.credits} Credits
          </div>
          <div class="text-sm text-gray-600 mb-2">
            {COUPON_TYPES.find(t => t.value === coupon.tp)?.label || 'General'}
          </div>
          {#if coupon.description}
            <div class="text-xs text-gray-500 italic">
              {coupon.description}
            </div>
          {/if}
          <div class="mt-2 flex items-center justify-center space-x-4 text-xs text-gray-500">
            {#if coupon.usage_limit}
              <span>Limit: {coupon.usage_limit} uses</span>
            {:else}
              <span>Unlimited uses</span>
            {/if}
            {#if coupon.expires_at}
              <span>Expires: {new Date(coupon.expires_at).toLocaleDateString()}</span>
            {:else}
              <span>No expiry</span>
            {/if}
          </div>
          <div class="mt-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {coupon.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
              {coupon.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
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
        {isEdit ? 'Update Coupon' : 'Create Coupon'}
      </Button>
    </div>
  </form>
</div>