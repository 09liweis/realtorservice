<script>
	// 模拟数据 - 在实际应用中，这些数据会从API获取
	let stagingRequests = [
		{
			id: 1,
			property: '123 Main St, Anytown, CA',
			requestDate: '2024-02-13',
			scheduledDate: '2024-02-20',
			status: 'Scheduled',
			type: 'Full Home',
			notes: 'Modern style preferred. Need to highlight open floor plan.',
			budget: 2500,
			contactPerson: 'John Smith',
			contactPhone: '555-123-4567'
		},
		{
			id: 2,
			property: '456 Oak Ave, Somewhere, CA',
			requestDate: '2024-02-12',
			scheduledDate: null,
			status: 'Pending',
			type: 'Partial (Living Room, Kitchen)',
			notes: 'Targeting young professionals. Contemporary style.',
			budget: 1500,
			contactPerson: 'Jane Doe',
			contactPhone: '555-987-6543'
		},
		{
			id: 3,
			property: '789 Pine St, Nowhere, CA',
			requestDate: '2024-02-10',
			scheduledDate: '2024-02-15',
			status: 'Completed',
			type: 'Full Home',
			notes: 'Family-friendly staging. Emphasize space and storage.',
			budget: 3000,
			contactPerson: 'Bob Johnson',
			contactPhone: '555-456-7890'
		},
		{
			id: 4,
			property: '321 Elm St, Elsewhere, CA',
			requestDate: '2024-02-08',
			scheduledDate: null,
			status: 'Cancelled',
			type: 'Partial (Master Bedroom, Living Room)',
			notes: 'Luxury appeal. High-end furniture requested.',
			budget: 2000,
			contactPerson: 'Mary Williams',
			contactPhone: '555-789-0123'
		}
	];

	// 状态变量
	let showAddForm = false;
	let searchQuery = '';
	let statusFilter = 'All';
	let editingId = null;
	let showDetailsModal = false;
	let selectedRequest = null;

	// 新请求的表单数据
	let newRequest = {
		property: '',
		type: 'Full Home',
		scheduledDate: '',
		notes: '',
		budget: '',
		contactPerson: '',
		contactPhone: ''
	};

	// 所有可能的状态
	const statuses = ['Pending', 'Scheduled', 'Completed', 'Cancelled'];

	// 所有可能的类型
	const types = ['Full Home', 'Partial (Living Room, Kitchen)', 'Partial (Master Bedroom, Living Room)', 'Other'];

	// 过滤请求
	$: filteredRequests = stagingRequests.filter((request) => {
		const matchesSearch = request.property.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	// 添加新请求
	function addRequest() {
		const id = stagingRequests.length > 0 ? Math.max(...stagingRequests.map((r) => r.id)) + 1 : 1;
		stagingRequests = [
			...stagingRequests,
			{
				...newRequest,
				id,
				requestDate: new Date().toISOString().split('T')[0],
				status: 'Pending'
			}
		];
		resetForm();
		showAddForm = false;
	}

	// 开始编辑请求
	function startEdit(request) {
		editingId = request.id;
		newRequest = { ...request };
		showAddForm = true;
	}

	// 更新请求
	function updateRequest() {
		stagingRequests = stagingRequests.map((request) =>
			request.id === editingId ? { ...newRequest, id: editingId } : request
		);
		resetForm();
		showAddForm = false;
	}

	// 查看请求详情
	function viewDetails(request) {
		selectedRequest = { ...request };
		showDetailsModal = true;
	}

	// 更新请求状态
	function updateStatus(requestId, newStatus) {
		stagingRequests = stagingRequests.map((request) =>
			request.id === requestId ? { ...request, status: newStatus } : request
		);
		if (selectedRequest?.id === requestId) {
			selectedRequest = { ...selectedRequest, status: newStatus };
		}
	}

	// 删除请求
	function deleteRequest(id) {
		if (confirm('Are you sure you want to delete this staging request?')) {
			stagingRequests = stagingRequests.filter((request) => request.id !== id);
		}
	}

	// 重置表单
	function resetForm() {
		newRequest = {
			property: '',
			type: 'Full Home',
			scheduledDate: '',
			notes: '',
			budget: '',
			contactPerson: '',
			contactPhone: ''
		};
		editingId = null;
	}

	// 取消表单
	function cancelForm() {
		resetForm();
		showAddForm = false;
	}

	// 获取状态标签的样式
	function getStatusStyle(status) {
		switch (status) {
			case 'Pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'Scheduled':
				return 'bg-blue-100 text-blue-800';
			case 'Completed':
				return 'bg-green-100 text-green-800';
			case 'Cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	// 格式化金额
	function formatAmount(amount) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(amount);
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Staging Requests</h1>
		<button
			on:click={() => {
				showAddForm = true;
				resetForm();
			}}
			class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
		>
			New Staging Request
		</button>
	</div>

	<!-- Filters -->
	<div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
		<div class="flex-1">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search by property..."
				class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>
		<div class="w-full md:w-48">
			<select
				bind:value={statusFilter}
				class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
			>
				<option value="All">All Status</option>
				{#each statuses as status}
					<option value={status}>{status}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Add/Edit Form -->
	{#if showAddForm}
		<div class="p-6 bg-white rounded-lg shadow">
			<h2 class="mb-4 text-lg font-medium text-gray-900">
				{editingId ? 'Edit Staging Request' : 'New Staging Request'}
			</h2>
			<form
				on:submit|preventDefault={editingId ? updateRequest : addRequest}
				class="space-y-4"
			>
				<div>
					<label for="property" class="block text-sm font-medium text-gray-700">Property</label>
					<input
						type="text"
						id="property"
						bind:value={newRequest.property}
						required
						class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label for="type" class="block text-sm font-medium text-gray-700">Type</label>
						<select
							id="type"
							bind:value={newRequest.type}
							class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
						>
							{#each types as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</div>
					<div>
						<label for="scheduledDate" class="block text-sm font-medium text-gray-700"
							>Scheduled Date</label
						>
						<input
							type="date"
							id="scheduledDate"
							bind:value={newRequest.scheduledDate}
							class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div>
						<label for="budget" class="block text-sm font-medium text-gray-700">Budget ($)</label>
						<input
							type="number"
							id="budget"
							bind:value={newRequest.budget}
							min="0"
							step="100"
							class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="contactPerson" class="block text-sm font-medium text-gray-700"
							>Contact Person</label
						>
						<input
							type="text"
							id="contactPerson"
							bind:value={newRequest.contactPerson}
							class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="contactPhone" class="block text-sm font-medium text-gray-700"
							>Contact Phone</label
						>
						<input
							type="tel"
							id="contactPhone"
							bind:value={newRequest.contactPhone}
							class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</div>
				<div>
					<label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
					<textarea
						id="notes"
						bind:value={newRequest.notes}
						rows="3"
						class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					></textarea>
				</div>
				<div class="flex justify-end space-x-3">
					<button
						type="button"
						on:click={cancelForm}
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						{editingId ? 'Update' : 'Save'}
					</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Staging Requests Grid -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each filteredRequests as request (request.id)}
			<div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
				<div class="px-6 py-5 border-b border-gray-200">
					<div class="flex justify-between items-center">
						<h3 class="text-lg font-medium text-gray-900 truncate">{request.property}</h3>
						<span
							class={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(
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
							<span class="text-sm text-gray-500">Type</span>
							<span class="text-sm text-gray-900">{request.type}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-sm text-gray-500">Budget</span>
							<span class="text-sm font-medium text-gray-900">{formatAmount(request.budget)}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-sm text-gray-500">Scheduled</span>
							<span class="text-sm text-gray-900">
								{request.scheduledDate
									? new Date(request.scheduledDate).toLocaleDateString()
									: 'Not scheduled'}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-sm text-gray-500">Contact</span>
							<span class="text-sm text-gray-900">{request.contactPerson}</span>
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
						on:click={() => viewDetails(request)}
						class="text-sm text-blue-600 hover:text-blue-900"
					>
						View
					</button>
					<button
						on:click={() => startEdit(request)}
						class="text-sm text-blue-600 hover:text-blue-900"
					>
						Edit
					</button>
					<button
						on:click={() => deleteRequest(request.id)}
						class="text-sm text-red-600 hover:text-red-900"
					>
						Delete
					</button>
				</div>
			</div>
		{:else}
			<div class="col-span-full text-center py-12 bg-white rounded-lg">
				<p class="text-gray-500">No staging requests found</p>
			</div>
		{/each}
	</div>
</div>

<!-- Details Modal -->
{#if showDetailsModal && selectedRequest}
	<div class="fixed inset-0 z-10 overflow-y-auto">
		<div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
			<div class="fixed inset-0 transition-opacity" aria-hidden="true">
				<div class="absolute inset-0 bg-gray-500 opacity-75"></div>
			</div>

			<div
				class="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
			>
				<div class="absolute top-0 right-0 pt-4 pr-4">
					<button
						type="button"
						on:click={() => (showDetailsModal = false)}
						class="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						<span class="sr-only">Close</span>
						❌
					</button>
				</div>

				<div class="sm:flex sm:items-start">
					<div class="w-full mt-3 text-center sm:mt-0 sm:text-left">
						<h3 class="text-lg font-medium leading-6 text-gray-900">Staging Request Details</h3>
						<div class="mt-4 space-y-4">
							<div>
								<h4 class="text-sm font-medium text-gray-500">Property</h4>
								<p class="mt-1 text-sm text-gray-900">{selectedRequest.property}</p>
							</div>
							<div>
								<h4 class="text-sm font-medium text-gray-500">Type</h4>
								<p class="mt-1 text-sm text-gray-900">{selectedRequest.type}</p>
							</div>
							<div>
								<h4 class="text-sm font-medium text-gray-500">Status</h4>
								<div class="mt-1">
									<select
										bind:value={selectedRequest.status}
										on:change={() => updateStatus(selectedRequest.id, selectedRequest.status)}
										class="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									>
										{#each statuses as status}
											<option value={status}>{status}</option>
										{/each}
									</select>
								</div>
							</div>
							<div>
								<h4 class="text-sm font-medium text-gray-500">Budget</h4>
								<p class="mt-1 text-sm text-gray-900">{formatAmount(selectedRequest.budget)}</p>
							</div>
							<div>
								<h4 class="text-sm font-medium text-gray-500">Contact Information</h4>
								<p class="mt-1 text-sm text-gray-900">
									{selectedRequest.contactPerson} • {selectedRequest.contactPhone}
								</p>
							</div>
							<div>
								<h4 class="text-sm font-medium text-gray-500">Request Date</h4>
								<p class="mt-1 text-sm text-gray-900">
									{new Date(selectedRequest.requestDate).toLocaleDateString()}
								</p>
							</div>
							<div>
								<h4 class="text-sm font-medium text-gray-500">Scheduled Date</h4>
								<p class="mt-1 text-sm text-gray-900">
									{selectedRequest.scheduledDate
										? new Date(selectedRequest.scheduledDate).toLocaleDateString()
										: 'Not scheduled'}
								</p>
							</div>
							<div>
								<h4 class="text-sm font-medium text-gray-500">Notes</h4>
								<p class="mt-1 text-sm text-gray-900">{selectedRequest.notes}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}