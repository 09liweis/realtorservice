<script lang="ts">
  import { user } from "$lib/stores/auth";
  import { formatAmount, type ProjectStatus } from "$lib/types/constant";
  import type { Cleaning } from "$lib/types/cleaning";
  import { CLEANING_TYPES, CLEANING_FREQUENCIES } from "$lib/types/cleaning";
  import { upsertCreditRecord, calcUserCredits, upsertCleaning } from "$lib/supabase";
  import type { CreditRecord } from "$lib/types/credit";

  export let request: Cleaning;
  export let onEdit;
  export let onDelete;

    import Link from "../Link.svelte";

	// Get status badge style
	function getStatusStyle(status: ProjectStatus) {
		switch (status) {
			case 'draft':
				return 'bg-gray-100 text-gray-800';
			case 'submitted':
				return 'bg-yellow-100 text-yellow-800';
			case 'confirmed':
				return 'bg-blue-100 text-blue-800';
			case 'paid':
				return 'bg-green-100 text-green-800';
			case 'scheduled':
				return 'bg-purple-100 text-purple-800';
			case 'completed':
				return 'bg-emerald-100 text-emerald-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

  function getCleaningTypeLabel(type: string): string {
    return CLEANING_TYPES.find(t => t.value === type)?.label || type;
  }

  function getFrequencyLabel(frequency: string): string {
    return CLEANING_FREQUENCIES.find(f => f.value === frequency)?.label || frequency;
  }
</script>

<div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
	{#if request.user_profiles}
		<div class="px-6 py-3 bg-green-50 border-b border-green-100">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-3">
					<p class="text-sm font-medium text-green-800">
						{request.user_profiles.first_name} {request.user_profiles.last_name}
					</p>
					{#if request.user_profiles.brokerage}
						<p class="text-xs text-green-600">
							{request.user_profiles.brokerage}
						</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}
	<div class="px-6 py-5 border-b border-gray-200">
		<div class="flex justify-between items-center">
			<Link href={`/dashboard/cleanings/${request.id}`} className="text-lg font-medium text-gray-900 truncate">{request.location}</Link>
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
				<span class="text-sm text-gray-500">Rooms</span>
				<span class="text-sm text-gray-900">{request.rooms || 'Not specified'}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-sm text-gray-500">Bathrooms</span>
				<span class="text-sm text-gray-900">{request.bathrooms || 'Not specified'}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-sm text-gray-500">Cleaning Type</span>
				<span class="text-sm text-gray-900">{getCleaningTypeLabel(request.cleaning_type)}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-sm text-gray-500">Frequency</span>
				<span class="text-sm text-gray-900">{getFrequencyLabel(request.frequency)}</span>
			</div>
			{#if request.scheduled_date}
				<div class="flex justify-between">
					<span class="text-sm text-gray-500">Scheduled Date</span>
					<span class="text-sm text-gray-900">{new Date(request.scheduled_date).toLocaleDateString()}</span>
				</div>
			{/if}
			<div class="flex justify-between">
				<span class="text-sm text-gray-500">Estimate Price</span>
				<span class="text-sm font-medium text-gray-900">
					{formatAmount(request.estimate_price)}
				</span>
			</div>
			{#if request.quotation_price}
				<div class="flex justify-between">
					<span class="text-sm text-gray-500">Quotation Price</span>
					<span class="text-sm font-medium text-gray-900">
						{formatAmount(request.quotation_price)}
					</span>
				</div>
			{/if}
		</div>
	</div>

	<div class="px-6 py-3 bg-gray-50">
		<div class="flex justify-end space-x-3">
			<Link
				href={`/dashboard/cleanings/${request.id}`}
			>
				View
			</Link>
			<!-- <button
				on:click={() => onEdit(request)}
				class="text-sm text-green-600 hover:text-green-900"
			>
				Edit
			</button> -->
			<!-- {#if !$user?.isAdmin}
				<button
					on:click={() => onDelete(request.id)}
					class="text-sm text-red-600 hover:text-red-900"
				>
					Delete
				</button>
			{/if} -->
		</div>
	</div>
</div>