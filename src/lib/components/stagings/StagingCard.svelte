<script lang="ts">
    import { formatAmount } from "$lib/types/constant";
    import type { Staging } from "$lib/types/staging";

	export let request:Staging;
	export let onView;
	export let onEdit;
	export let onDelete;

	// 获取状态标签的样式
	function getStatusStyle(status:String) {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'scheduled':
				return 'bg-blue-100 text-blue-800';
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
	<div class="px-6 py-5 border-b border-gray-200">
		<div class="flex justify-between items-center">
			<h3 class="text-lg font-medium text-gray-900 truncate">{request.location || request.property}</h3>
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
				<span class="text-sm text-gray-900 capitalize">{request.property_type || request.type}</span>
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
				<span class="text-sm text-gray-500">Estimate Quotation Price</span>
				<span class="text-sm font-medium text-gray-900">
					{formatAmount(request.estimate_price)}
				</span>
			</div>
			<div class="flex justify-between">
				<span class="text-sm text-gray-500">Timeline</span>
				<span class="text-sm text-gray-900">
					{request.timeline || (request.scheduledDate
						? new Date(request.scheduledDate).toLocaleDateString()
						: 'Not scheduled')}
				</span>
			</div>
			<div class="flex justify-between">
				<span class="text-sm text-gray-500">Length</span>
				<span class="text-sm text-gray-900">{request.length + ' Month' || 'Not specified'}</span>
			</div>
		</div>
		
		{#if request.notes}
			<div class="mt-4">
				<p class="text-sm text-gray-500 line-clamp-2">{request.notes}</p>
			</div>
		{/if}
	</div>
	<div class="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
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
		<button
			on:click={() => onDelete(request.id)}
			class="text-sm text-red-600 hover:text-red-900"
		>
			Delete
		</button>
	</div>
</div>