<script lang="ts">
  import { user } from "$lib/stores/auth";
  import { formatAmount } from "$lib/types/constant";
  import type { Staging } from "$lib/types/staging";
  import { upsertCreditRecord, calcUserCredits, upsertStaging } from "$lib/supabase";
  import type { CreditRecord } from "$lib/types/credit";

  export let request:Staging;
  export let onView;
  export let onEdit;
  export let onDelete;

  import type { StagingStatus } from "$lib/types/staging";
	
  let isPaying = false;
  let paymentError = '';
  let paymentSuccess = false;
	
  async function handlePaid() {
    if (!$user) return;
		
    isPaying = true;
    paymentError = '';
    paymentSuccess = false;
		
    try {
      // Create credit record
      const creditRecord: CreditRecord = {
        amount: -request.quotation_price, // Negative amount for payment
        tp: 'staging',
        tp_id: request.id,
        user_id: $user.id,
        status: 'done'
      };
			
      const { error: creditRecordError } = await upsertCreditRecord(creditRecord);
      if (creditRecordError) throw new Error(creditRecordError.message);
			
      // Update user credits
      const { error: updateCreditsError } = await calcUserCredits($user.id, -request.quotation_price);
      if (updateCreditsError) throw new Error(updateCreditsError.message);

			request.status = 'paid';
			const { error: updateStagingError } = await upsertStaging(request);
      if (updateStagingError) throw new Error(updateStagingError.message);
			
      paymentSuccess = true;
      // Refresh the page after successful payment
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Payment error:', error);
      paymentError = error.message || 'An error occurred during payment';
    } finally {
      isPaying = false;
    }
  }

	// 获取状态标签的样式
	function getStatusStyle(status: StagingStatus) {
		switch (status) {
			case 'draft':
				return 'bg-gray-100 text-gray-800';
			case 'submitted':
				return 'bg-yellow-100 text-yellow-800';
			case 'confirmed':
				return 'bg-blue-100 text-blue-800';
			case 'paid':
				return 'bg-green-100 text-green-800';
			case 'schedule':
				return 'bg-purple-100 text-purple-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
	{#if request.user_profiles}
		<div class="px-6 py-3 bg-blue-50 border-b border-blue-100">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-3">
					<p class="text-sm font-medium text-blue-800">
						{request.user_profiles.first_name} {request.user_profiles.last_name}
					</p>
					{#if request.user_profiles.brokerage}
						<p class="text-xs text-blue-600">
							{request.user_profiles.brokerage}
						</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}
	<div class="px-6 py-5 border-b border-gray-200">
		<div class="flex justify-between items-center">
			<h3 class="text-lg font-medium text-gray-900 truncate">{request.location}</h3>
			<span
				class={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusStyle(
					request.status
				)}`}
			>
				{request.status}
			</span>
		</div>
	</div>
	<div class="px-6 py-4">
		<div class="space-y-3">
			<div class="flex justify-between">
				<span class="text-sm text-gray-500">Property Type</span>
				<span class="text-sm text-gray-900 capitalize">{request.property_type}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-sm text-gray-500">Size</span>
				<span class="text-sm text-gray-900">{request.size ? `${request.size} sq ft` : 'Not specified'}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-sm text-gray-500">Status</span>
				<span class="text-sm text-gray-900 capitalize">{request.occupation_status || 'Not specified'}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-sm text-gray-500">Selling Price</span>
				<span class="text-sm font-medium text-gray-900">
					{formatAmount(request.selling_price)}
				</span>
			</div>
			<div class="flex justify-between">
				<span class="text-sm text-gray-500">Timeline</span>
				<span class="text-sm text-gray-900">
					{request.timeline || 'Not specified'}
				</span>
			</div>
			<div class="flex justify-between">
				<span class="text-sm text-gray-500">Length</span>
				<span class="text-sm text-gray-900">{request.length + ' Month' || 'Not specified'}</span>
			</div>
      <div class="flex justify-between">
				<span class="text-sm text-gray-500">Estimate Staging Price</span>
				<span class="text-sm font-medium text-gray-900">
					{formatAmount(request.estimate_price)}
				</span>
			</div>
      <div class="flex justify-between">
				<span class="text-sm text-gray-500">Quotation Price</span>
				<span class="text-sm font-medium text-gray-900">
					{formatAmount(request.quotation_price)}
				</span>
			</div>
		</div>
	</div>

	{#if request.status !== 'paid'}
	<div class="px-6 py-3 bg-gray-50">
		{#if paymentError}
			<div class="mb-3 text-sm text-red-600">{paymentError}</div>
		{/if}
		{#if paymentSuccess}
			<div class="mb-3 text-sm text-green-600">Payment processed successfully!</div>
		{/if}
		<div class="flex justify-end space-x-3">
			<button
				on:click={() => onView(request)}
				class="text-sm text-blue-600 hover:text-blue-900"
			>
				View
			</button>
			<button
				on:click={() => onEdit(request)}
				class="text-sm text-blue-600 hover:text-blue-900"
			>
				Edit
			</button>
			{#if request.status === 'confirmed' && !$user?.isAdmin}
				<button
					on:click={handlePaid}
					disabled={isPaying}
					class="text-sm text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isPaying}
						Processing...
					{:else}
						Paid
					{/if}
				</button>
			{/if}
			{#if !$user?.isAdmin}
				<button
					on:click={() => onDelete(request.id)}
					class="text-sm text-red-600 hover:text-red-900"
				>
					Delete
				</button>
			{/if}
		</div>
	</div>
	{/if}
</div>