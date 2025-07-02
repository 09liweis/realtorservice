<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Staging } from '$lib/types/staging';
  import { user } from '$lib/stores/auth';
  import { upsertCreditRecord, calcUserCredits, upsertStaging } from '$lib/supabase';
  import type { CreditRecord } from '$lib/types/credit';
  import Button from '$lib/components/Button.svelte';

  export let staging: Staging;

  const dispatch = createEventDispatcher();

  let isPaying = false;
  let paymentError = '';
  let paymentSuccess = false;

  async function handlePaid() {
    if (!$user || !staging.quotation_price) return;
    
    isPaying = true;
    paymentError = '';
    paymentSuccess = false;
    
    try {
      // Create credit record
      const creditRecord: CreditRecord = {
        amount: -staging.quotation_price, // Negative amount for payment
        tp: 'staging',
        tp_id: staging.id,
        user_id: $user.id,
        status: 'done'
      };
      
      const { error: creditRecordError } = await upsertCreditRecord(creditRecord);
      if (creditRecordError) throw new Error(creditRecordError.message);
      
      // Update user credits
      const { error: updateCreditsError } = await calcUserCredits($user.id, -staging.quotation_price);
      if (updateCreditsError) throw new Error(updateCreditsError.message);

      // Update staging status
      const updatedStaging = { ...staging, status: 'paid' as const };
      const { error: updateStagingError } = await upsertStaging(updatedStaging);
      if (updateStagingError) throw new Error(updateStagingError.message);
      
      paymentSuccess = true;
      dispatch('statusUpdate');
      
      // Refresh the page after successful payment
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Payment error:', error);
      paymentError = error.message || 'An error occurred during payment';
    } finally {
      isPaying = false;
    }
  }

  function handleEdit() {
    dispatch('edit');
  }

  // Get next action based on status
  $: nextAction = (() => {
    switch (staging.status) {
      case 'draft':
        return { text: 'Submit Request', action: 'submit', available: true };
      case 'submitted':
        return { text: 'Awaiting Quote', action: 'wait', available: false };
      case 'confirmed':
        return { text: 'Pay Now', action: 'pay', available: !!staging.quotation_price };
      case 'paid':
        return { text: 'Payment Complete', action: 'complete', available: false };
      case 'schedule':
        return { text: 'Scheduled', action: 'scheduled', available: false };
      default:
        return { text: 'No Action', action: 'none', available: false };
    }
  })();
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
  <div class="px-6 py-4 border-b border-gray-200">
    <h2 class="text-xl font-semibold text-gray-900">Quick Actions</h2>
  </div>

  <div class="p-6 space-y-4">
    <!-- Primary Action -->
    {#if nextAction.available}
      {#if nextAction.action === 'pay'}
        <div class="space-y-3">
          {#if paymentError}
            <div class="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {paymentError}
            </div>
          {/if}
          {#if paymentSuccess}
            <div class="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
              Payment processed successfully!
            </div>
          {/if}
          <Button
            onclick={handlePaid}
            loading={isPaying}
            disabled={isPaying}
            class_name="w-full"
          >
            {isPaying ? 'Processing Payment...' : `Pay ${staging.quotation_price ? `$${staging.quotation_price.toLocaleString()}` : ''}`}
          </Button>
        </div>
      {:else}
        <Button class_name="w-full" disabled>
          {nextAction.text}
        </Button>
      {/if}
    {:else}
      <div class="text-center py-4">
        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span class="text-2xl">⏳</span>
        </div>
        <div class="text-sm font-medium text-gray-700">{nextAction.text}</div>
        <div class="text-xs text-gray-500 mt-1">
          {#if staging.status === 'submitted'}
            Our team is reviewing your request
          {:else if staging.status === 'paid'}
            We'll contact you to schedule staging
          {:else if staging.status === 'schedule'}
            Staging installation is scheduled
          {:else}
            Please wait for the next step
          {/if}
        </div>
      </div>
    {/if}

    <!-- Secondary Actions -->
    <div class="space-y-3 pt-4 border-t border-gray-200">
      {#if !$user?.isAdmin && staging.status !== 'paid'}
        <Button
          variant="secondary"
          onclick={handleEdit}
          class_name="w-full"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Edit Request
        </Button>
      {/if}

      <button class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        Contact Support
      </button>
    </div>

    <!-- Status Information -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-sm font-medium text-gray-700 mb-3">Request Information</h3>
      <div class="space-y-2 text-xs text-gray-600">
        <div class="flex justify-between">
          <span>Request ID:</span>
          <span class="font-mono">{staging.id?.slice(-8) || 'N/A'}</span>
        </div>
        <div class="flex justify-between">
          <span>Created:</span>
          <span>{staging.created_at ? new Date(staging.created_at).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div class="flex justify-between">
          <span>Last Updated:</span>
          <span>{staging.updated_at ? new Date(staging.updated_at).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>
    </div>
  </div>
</div>