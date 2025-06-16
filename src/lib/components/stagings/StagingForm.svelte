<script>
	import { createEventDispatcher } from 'svelte';

	export let isEdit = false;
	export let request = {
		id: '',
		location: '',
		size: '',
		occupation_status: 'Vacant',
		property_type: 'House',
		rooms: '',
		selling_price: 0,
		timeline: '',
		length: '',
		status: 'Pending',
		contactPerson: '',
		contactEmail: '',
		contactPhone: '',
		notes: ''
	};

	const dispatch = createEventDispatcher();

	// 属性类型选项
	const propertyTypeOptions = ['House', 'Condo', 'Townhouse', 'Apartment', 'Other'];
	
	// 占用状态选项
	const occupationStatusOptions = ['Vacant', 'Occupied'];
	
	// 状态选项
	const statusOptions = ['Pending', 'Scheduled', 'Completed', 'Cancelled'];

	// 处理表单提交
	function handleSubmit() {
		// 验证表单
		if (!request.location) {
			alert('Property location is required');
			return;
		}

		if (!request.contactPerson) {
			alert('Contact person is required');
			return;
		}

		if (!request.contactEmail && !request.contactPhone) {
			alert('Either email or phone is required');
			return;
		}

		// 提交表单
		dispatch('submit', { ...request });
	}

	// 处理取消
	function handleCancel() {
		dispatch('cancel');
	}
</script>

<div class="bg-white shadow rounded-lg p-6">
	<h2 class="text-lg font-medium text-gray-900 mb-6">
		{isEdit ? 'Edit Staging Request' : 'New Staging Request'}
	</h2>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<!-- 属性位置 -->
		<div>
			<label for="location" class="block text-sm font-medium text-gray-700 mb-1">
				Property Location*
			</label>
			<input
				type="text"
				id="location"
				bind:value={request.location}
				required
				placeholder="Address, City, Postal Code"
				class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
			/>
		</div>

		<!-- 属性类型和大小 -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label for="property_type" class="block text-sm font-medium text-gray-700 mb-1">
					Property Type
				</label>
				<select
					id="property_type"
					bind:value={request.property_type}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				>
					{#each propertyTypeOptions as type}
						<option value={type}>{type}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="size" class="block text-sm font-medium text-gray-700 mb-1">
					Size (sq ft)
				</label>
				<input
					type="number"
					id="size"
					bind:value={request.size}
					min="0"
					placeholder="Property square footage"
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				/>
			</div>
		</div>

		<!-- 占用状态和房间 -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label for="occupation_status" class="block text-sm font-medium text-gray-700 mb-1">
					Occupation Status
				</label>
				<select
					id="occupation_status"
					bind:value={request.occupation_status}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				>
					{#each occupationStatusOptions as status}
						<option value={status}>{status}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="rooms" class="block text-sm font-medium text-gray-700 mb-1">
					Rooms to be Staged
				</label>
				<input
					type="text"
					id="rooms"
					bind:value={request.rooms}
					placeholder="e.g. Living room, Master bedroom"
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				/>
			</div>
		</div>

		<!-- 售价和时间线 -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label for="selling_price" class="block text-sm font-medium text-gray-700 mb-1">
					Approximate Selling Price ($)
				</label>
				<input
					type="number"
					id="selling_price"
					bind:value={request.selling_price}
					min="0"
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				/>
			</div>

			<div>
				<label for="timeline" class="block text-sm font-medium text-gray-700 mb-1">
					Desired Timeline
				</label>
				<input
					type="text"
					id="timeline"
					bind:value={request.timeline}
					placeholder="e.g. By June 15th"
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				/>
			</div>
		</div>

		<!-- 时长和状态 -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label for="length" class="block text-sm font-medium text-gray-700 mb-1">
					Length of Staging
				</label>
				<input
					type="text"
					id="length"
					bind:value={request.length}
					placeholder="e.g. 30 days, 2 months"
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				/>
			</div>

			{#if isEdit}
				<div>
					<label for="status" class="block text-sm font-medium text-gray-700 mb-1">
						Status
					</label>
					<select
						id="status"
						bind:value={request.status}
						class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					>
						{#each statusOptions as status}
							<option value={status}>{status}</option>
						{/each}
					</select>
				</div>
			{/if}
		</div>

		<!-- 联系人信息 -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div>
				<label for="contactPerson" class="block text-sm font-medium text-gray-700 mb-1">
					Contact Person*
				</label>
				<input
					type="text"
					id="contactPerson"
					bind:value={request.contactPerson}
					required
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				/>
			</div>

			<div>
				<label for="contactEmail" class="block text-sm font-medium text-gray-700 mb-1">
					Email
				</label>
				<input
					type="email"
					id="contactEmail"
					bind:value={request.contactEmail}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				/>
			</div>

			<div>
				<label for="contactPhone" class="block text-sm font-medium text-gray-700 mb-1">
					Phone
				</label>
				<input
					type="tel"
					id="contactPhone"
					bind:value={request.contactPhone}
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				/>
			</div>
		</div>

		<!-- 备注 -->
		<div>
			<label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
				Notes
			</label>
			<textarea
				id="notes"
				bind:value={request.notes}
				rows="4"
				class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
			></textarea>
		</div>

		<!-- 按钮 -->
		<div class="flex justify-end space-x-3">
			<button
				type="button"
				on:click={handleCancel}
				class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			>
				Cancel
			</button>
			<button
				type="submit"
				class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			>
				{isEdit ? 'Update' : 'Create'}
			</button>
		</div>
	</form>
</div>