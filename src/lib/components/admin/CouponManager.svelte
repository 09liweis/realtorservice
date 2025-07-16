<script lang="ts">
  import { onMount } from 'svelte';
  import type { Coupon } from '$lib/types/coupon';
  import { EMPTY_COUPON } from '$lib/types/coupon';
  import { getCoupons, upsertCoupon, deleteCoupon, toggleCouponStatus } from '$lib/supabase';
  import CouponForm from './CouponForm.svelte';
  import CouponList from './CouponList.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';

  let coupons: Coupon[] = [];
  let loading = false;
  let error: string | null = null;
  let showForm = false;
  let editingCoupon: Coupon | null = null;
  let formLoading = false;
  let showDeleteConfirm = false;
  let couponToDelete: Coupon | null = null;

  onMount(() => {
    loadCoupons();
  });

  async function loadCoupons() {
    try {
      loading = true;
      error = null;
      const { data, error: fetchError } = await getCoupons();
      if (fetchError) throw fetchError;
      coupons = data || [];
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load coupons';
      console.error('Error loading coupons:', err);
    } finally {
      loading = false;
    }
  }

  function handleCreateNew() {
    editingCoupon = null;
    showForm = true;
  }

  function handleEdit(event: CustomEvent<Coupon>) {
    editingCoupon = { ...event.detail };
    showForm = true;
  }

  function handleDelete(event: CustomEvent<Coupon>) {
    couponToDelete = event.detail;
    showDeleteConfirm = true;
  }

  async function confirmDelete() {
    if (!couponToDelete?.id) return;

    try {
      formLoading = true;
      const { error: deleteError } = await deleteCoupon(couponToDelete.id);
      if (deleteError) throw deleteError;
      
      await loadCoupons();
      showDeleteConfirm = false;
      couponToDelete = null;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to delete coupon';
      console.error('Error deleting coupon:', err);
    } finally {
      formLoading = false;
    }
  }

  async function handleToggleStatus(event: CustomEvent<Coupon>) {
    const coupon = event.detail;
    if (!coupon.id) return;

    try {
      const { error: toggleError } = await toggleCouponStatus(coupon.id, !coupon.active);
      if (toggleError) throw toggleError;
      
      await loadCoupons();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to update coupon status';
      console.error('Error toggling coupon status:', err);
    }
  }

  async function handleFormSubmit(event: CustomEvent<Coupon>) {
    const couponData = event.detail;

    try {
      formLoading = true;
      error = null;

      const { error: saveError } = await upsertCoupon(couponData);
      if (saveError) throw saveError;

      await loadCoupons();
      showForm = false;
      editingCoupon = null;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to save coupon';
      console.error('Error saving coupon:', err);
    } finally {
      formLoading = false;
    }
  }

  function handleFormCancel() {
    showForm = false;
    editingCoupon = null;
  }

  function cancelDelete() {
    showDeleteConfirm = false;
    couponToDelete = null;
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Coupon Management</h2>
      <p class="text-gray-600 mt-1">Create and manage discount coupons for users</p>
    </div>
    <Button onclick={handleCreateNew}>
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
      Create Coupon
    </Button>
  </div>

  <!-- Error Message -->
  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        {error}
      </div>
    </div>
  {/if}

  <!-- Coupon List -->
  <CouponList 
    {coupons} 
    {loading}
    on:edit={handleEdit}
    on:delete={handleDelete}
    on:toggleStatus={handleToggleStatus}
  />
</div>

<!-- Create/Edit Form Modal -->
{#if showForm}
  <FormBackdrop handleClose={handleFormCancel}>
    <CouponForm
      coupon={editingCoupon || { ...EMPTY_COUPON }}
      isEdit={!!editingCoupon}
      loading={formLoading}
      on:submit={handleFormSubmit}
      on:cancel={handleFormCancel}
    />
  </FormBackdrop>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm && couponToDelete}
  <FormBackdrop handleClose={cancelDelete}>
    <div class="bg-white rounded-xl shadow-lg max-w-md mx-auto p-6">
      <div class="flex items-center mb-4">
        <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900">Delete Coupon</h3>
      </div>
      
      <p class="text-gray-600 mb-6">
        Are you sure you want to delete the coupon <strong>"{couponToDelete.name}"</strong>? 
        This action cannot be undone and will affect any users who have this coupon.
      </p>
      
      <div class="flex items-center justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onclick={cancelDelete}
          disabled={formLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onclick={confirmDelete}
          loading={formLoading}
          disabled={formLoading}
          class_name="bg-red-600 hover:bg-red-700 text-white"
        >
          Delete Coupon
        </Button>
      </div>
    </div>
  </FormBackdrop>
{/if}