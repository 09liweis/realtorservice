<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Staging } from '$lib/types/staging';
  import { user } from '$lib/stores/auth';
  import { upsertCreditRecord, calcUserCredits, upsertStaging, upsertCleaning } from '$lib/supabase';
  import type { CreditRecord } from '$lib/types/credit';
  import Button from '$lib/components/Button.svelte';
    import type { Cleaning } from '$lib/types/cleaning';
    import Input from '../Input.svelte';
    import type { StagingCleaningStatus } from '$lib/types/constant';
    import ConfirmPayModal from './ConfirmPayModal.svelte';


  export let request: Staging|Cleaning;
  export let tp:string = "staging";
  const quotation_price = request.quotation_price;

  const dispatch = createEventDispatcher();

  let showConfirmPayModal = false;
  let statusLoading = false;
  let paymentError = '';
  let paymentSuccess = false;

  const openPayModal = () => {
    showConfirmPayModal = true;
  }

  async function confirmPayment() {
    if (!$user || !quotation_price) return;
    
    statusLoading = true;
    paymentError = '';
    paymentSuccess = false;
    
    try {
      // Create credit record
      const creditRecord: CreditRecord = {
        amount: -quotation_price, // Negative amount for payment
        tp,
        tp_id: request.id,
        user_id: $user.id,
        status: 'done'
      };
      
      const { error: creditRecordError } = await upsertCreditRecord(creditRecord);
      if (creditRecordError) throw new Error(creditRecordError.message);
      
      // Update user credits
      const { error: updateCreditsError } = await calcUserCredits($user.id, -quotation_price);
      if (updateCreditsError) throw new Error(updateCreditsError.message);

      // Update staging status
      await updateStatus('paid');
      
      paymentSuccess = true;
    } catch (error: any) {
      console.error('Payment error:', error);
      paymentError = error.message || 'An error occurred during payment';
    } finally {
      statusLoading = false;
    }
  }

  async function updateStatus(status:string) {
    request.status = status as StagingCleaningStatus;
    if (tp === 'staging') {
      const { error: updateStagingError } = await upsertStaging(request);
      if (updateStagingError) throw new Error(updateStagingError.message);
    } else if (tp === 'cleaning') {
      const { error: updateStagingError } = await upsertCleaning(request);
      if (updateStagingError) throw new Error(updateStagingError.message);
    }
    dispatch('statusUpdate');
  }

  async function handleConfirmQuotation() {
    try {
      statusLoading = true;
      await updateStatus('confirmed');
    } catch (error:any) {
      paymentError = error.message || 'An error occurred during payment';
    } finally {
      statusLoading = false;
    }
  }

  // Get next action based on status
  $: nextAction = (() => {
    if ($user?.isAdmin) {
      switch (request.status) {
        case 'submitted':
          return { text: 'Confirm Quotation Price', action: 'confirmed', available: true };
        case 'confirmed':
          return { text: 'Awaiting Paid', action: 'wait', available: false };
        case 'paid':
          return { text: 'Schedule Staging', action: 'scheduled', available: true };
        case 'scheduled':
          return { text: 'Complete Staging', action: 'completed', available: true };
        case 'completed':
          return { text: 'Request Completed', action: '', available: false };
        default:
          return { text: 'No Action', action: 'none', available: false };
      }
    } else {
      switch (request.status) {
        case 'submitted':
          return { text: 'Awaiting Quote', action: 'wait', available: false };
        case 'confirmed':
          return { text: 'Pay Now', action: 'pay', available: !!quotation_price };
        case 'paid':
          return { text: 'Awaiting Scheduled', action: 'wait', available: false };
        case 'scheduled':
          return { text: 'Request Scheduled', available: false };
        case 'completed':
          return { text: 'Request Completed', available: false };
        default:
          return { text: 'No Action', action: 'none', available: false };
      }
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
            onclick={openPayModal}
            loading={statusLoading}
            disabled={statusLoading}
            class_name="w-full"
          >
            {statusLoading ? 'Processing Payment...' : `Pay ${quotation_price ? `$${quotation_price.toLocaleString()}` : ''}`}
          </Button>
        </div>
      {:else if nextAction.action === 'confirmed'}
        <Input
          label="Quotation Price"
          bind:value={request.quotation_price}
          type="number"
        />
        <Button loading={statusLoading} disabled={statusLoading} class_name="w-full" onclick={handleConfirmQuotation}>
          {statusLoading ? 'Confirming Quotation Price' : nextAction.text}
        </Button>
      {/if}
    {:else}
      <div class="text-center py-4">
        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span class="text-2xl">⏳</span>
        </div>
        <div class="text-sm font-medium text-gray-700">{nextAction.text}</div>
        <div class="text-xs text-gray-500 mt-1">
          {#if request.status === 'submitted'}
            Our team is reviewing your request
          {:else if request.status === 'paid'}
            We'll contact you to schedule staging
          {:else if request.status === 'scheduled'}
            Staging installation is scheduled
          {:else}
            Please wait for the next step
          {/if}
        </div>
      </div>
    {/if}

    <!-- Secondary Actions -->
    <div class="space-y-3 pt-4 border-t border-gray-200">
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
          <span class="font-mono">{request.id?.slice(-8) || 'N/A'}</span>
        </div>
        <div class="flex justify-between">
          <span>Created:</span>
          <span>{request.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div class="flex justify-between">
          <span>Last Updated:</span>
          <span>{request.updated_at ? new Date(request.updated_at).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>
    </div>
  </div>
</div>

<ConfirmPayModal
  amount={request.quotation_price}
  show={showConfirmPayModal}
  on:close={()=>showConfirmPayModal=false}
/>