<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Staging } from '$lib/types/staging';
  import { user } from '$lib/stores/auth';
  import Button from '$lib/components/common/Button.svelte';
    import type { Cleaning } from '$lib/types/cleaning';
    import Input from '$lib/components/common/Input.svelte';
    import type { ProjectStatus } from '$lib/types/constant';
    import ConfirmPayModal from './ConfirmPayModal.svelte';
    import type { VideoService } from '$lib/types/video';
    import type { SocialMediaService } from '$lib/types/social';
    import { sendRequest } from '$lib/helper';


  export let request: Staging|Cleaning|VideoService|SocialMediaService|null;
  export let tp:string = "stagings";
  let note = '';
  $: quotation_price = request?.quotation_price;

  const dispatch = createEventDispatcher();

  let showConfirmPayModal = false;
  let statusLoading = false;
  let paymentError = '';
  let paymentSuccess = false;

  const openPayModal = () => {
    showConfirmPayModal = true;
  }

  async function confirmPayment(event:any) {
    const { amount, coupon, savings } = event.detail;
    if (!$user || !amount) return;
    
    statusLoading = true;
    paymentError = '';
    paymentSuccess = false;
    
    try {
      const {data:{error, credits}} = await sendRequest({
        url: '/api/credit-record',
        body: {
          amount,
          tp,
          tp_id: request?.id,
          coupon_id: coupon?.id
        }
      });

      if (error) {
        throw error
      }

      showConfirmPayModal = false;
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

  const UPDATE_TP_API:{[key:string]:string} = {
    stagings: '/api/stagings',
    cleanings: '/api/cleanings',
    social_media_services: '/api/socials',
    video_services: '/api/videos',
  }

  const handleStatusUpdate = () => {
    updateStatus(nextAction.action as ProjectStatus);
  }

  async function updateStatus(status:ProjectStatus) {
    if (!request) return;
    const oldStatus = request?.status;
    request.status = status as ProjectStatus;
    request?.history?.push({status, note:request.notes, date: new Date()});
    const {data:{error:updateError}} = await sendRequest({
      url: `${UPDATE_TP_API[tp]}/${request?.id}`,
      body: request,
      method: 'PUT'
    })
    
    if (updateError) throw new Error(updateError.message);

    // Send status change email
    try {
      const {response} = await sendRequest({
        url: '/api/send-status-email',
        body: {
          tp,
          id: request.id,
          oldStatus,
        }
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Email API error:', error);
      }
      
      dispatch('statusUpdate');
      note = '';
    } catch (error) {
      console.error('Failed to send status email:', error);
    }
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
      switch (request?.status) {
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
      switch (request?.status) {
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
  <h2 class="px-6 py-4 border-b border-gray-200 text-xl font-semibold text-gray-900">Quick Actions</h2>

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
        <Input
          label="Note"
          bind:value={note}
          type="text"
        />
        <Button loading={statusLoading} disabled={statusLoading} class_name="w-full" onclick={handleConfirmQuotation}>
          {statusLoading ? 'Confirming Quotation Price' : nextAction.text}
        </Button>
      {:else}
        <Input
          label="Note"
          bind:value={note}
          type="text"
        />
        <Button loading={statusLoading} disabled={statusLoading} class_name="w-full" onclick={handleStatusUpdate}>
          {statusLoading ? 'Processing' : nextAction.text}
        </Button>
      {/if}
    {:else}
      <div class="text-center py-4">
        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span class="text-2xl">{request?.status === 'completed' ? '✅' : '⏳'}</span>
        </div>
        <div class="text-sm font-medium text-gray-700">{nextAction.text}</div>
        <div class="text-xs text-gray-500 mt-1">
          {#if request?.status === 'submitted'}
            Our team is reviewing your request
          {:else if request?.status === 'paid'}
            We'll schedule the service soon
          {:else if request?.status === 'scheduled'}
            Service is scheduled
          {:else if request?.status === 'completed'}
            Service is completed
          {:else}
            Please wait for the next step
          {/if}
        </div>
      </div>
    {/if}

    <!-- Status Information -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-sm font-medium text-gray-700 mb-3">Request Information</h3>
      <div class="space-y-2 text-xs text-gray-600">
        <div class="flex justify-between">
          <span>Request ID:</span>
          <span class="font-mono">{request?.id?.slice(-8) || 'N/A'}</span>
        </div>
        <div class="flex justify-between">
          <span>Created:</span>
          <span>{request?.created_at ? new Date(request?.created_at).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div class="flex justify-between">
          <span>Last Updated:</span>
          <span>{request?.updated_at ? new Date(request?.updated_at).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>
    </div>
  </div>
</div>

<ConfirmPayModal
  {tp}
  amount={request?.quotation_price}
  show={showConfirmPayModal}
  on:confirm={confirmPayment}
  on:close={()=>showConfirmPayModal=false}
/>