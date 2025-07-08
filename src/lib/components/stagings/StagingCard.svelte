<script lang="ts">
  import { user } from "$lib/stores/auth";
  import { formatAmount, getStatusStyle } from "$lib/types/constant";
  import type { Staging } from "$lib/types/staging";

  export let request:Staging;
  export let onEdit;
  export let onDelete;

    import Link from "../Link.svelte";

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
			<Link href={`/dashboard/stagings/${request.id}`} className="text-lg font-medium truncate">{request.location}</Link>
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
		<div class="flex justify-end space-x-3">
			<Link
				href={`/dashboard/stagings/${request.id}`}
			>
				View
			</Link>
			<!-- <button
				on:click={() => onEdit(request)}
				class="text-sm text-blue-600 hover:text-blue-900"
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
	{/if}
</div>