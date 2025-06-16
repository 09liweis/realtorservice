<script lang="ts">
import Button from '$lib/components/Button.svelte';
    import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
	// 模拟数据 - 在实际应用中，这些数据会从API获取
	let offers = [
		{
			id: 1,
			property: '123 Main St, Anytown, CA',
			buyer: 'John Smith',
			amount: 850000,
			status: 'Pending',
			submittedDate: '2024-02-13',
			notes: 'Conventional loan, 20% down payment',
			conditions: ['Inspection', 'Appraisal'],
			expirationDate: '2024-02-20'
		},
		{
			id: 2,
			property: '456 Oak Ave, Somewhere, CA',
			buyer: 'Jane Doe',
			amount: 725000,
			status: 'Under Review',
			submittedDate: '2024-02-12',
			notes: 'FHA loan, 3.5% down payment',
			conditions: ['Inspection', 'Appraisal', 'Loan Approval'],
			expirationDate: '2024-02-19'
		},
		{
			id: 3,
			property: '789 Pine St, Nowhere, CA',
			buyer: 'Bob Johnson',
			amount: 925000,
			status: 'Accepted',
			submittedDate: '2024-02-10',
			notes: 'Cash offer',
			conditions: ['Inspection'],
			expirationDate: '2024-02-17'
		},
		{
			id: 4,
			property: '321 Elm St, Elsewhere, CA',
			buyer: 'Mary Williams',
			amount: 675000,
			status: 'Rejected',
			submittedDate: '2024-02-08',
			notes: 'Conventional loan, 10% down payment',
			conditions: ['Inspection', 'Appraisal', 'Home Sale Contingency'],
			expirationDate: '2024-02-15'
		}
	];

	// 状态变量
	let searchQuery = '';
	let statusFilter = 'All';
	let selectedOffer = null;
	let showDetailsModal = false;
	let newNote = '';

	// 所有可能的状态
	const statuses = ['Pending', 'Under Review', 'Accepted', 'Rejected', 'Withdrawn'];

	// 过滤报价
	$: filteredOffers = offers.filter((offer) => {
		const matchesSearch =
			offer.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
			offer.buyer.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === 'All' || offer.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	// 格式化金额
	function formatAmount(amount) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(amount);
	}

	// 查看报价详情
	function viewDetails(offer) {
		selectedOffer = { ...offer };
		showDetailsModal = true;
	}

	// 更新报价状态
	function updateStatus(offerId, newStatus) {
		offers = offers.map((offer) =>
			offer.id === offerId ? { ...offer, status: newStatus } : offer
		);
		if (selectedOffer?.id === offerId) {
			selectedOffer = { ...selectedOffer, status: newStatus };
		}
	}

	// 添加备注
	function addNote() {
		if (!newNote.trim()) return;

		const timestamp = new Date().toLocaleString();
		const note = `${timestamp}: ${newNote}`;

		offers = offers.map((offer) =>
			offer.id === selectedOffer.id
				? {
						...offer,
						notes: offer.notes ? `${offer.notes}\n${note}` : note
				  }
				: offer
		);

		selectedOffer = {
			...selectedOffer,
			notes: selectedOffer.notes ? `${selectedOffer.notes}\n${note}` : note
		};

		newNote = '';
	}

	// 获取状态标签的样式
	function getStatusStyle(status) {
		switch (status) {
			case 'Pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'Under Review':
				return 'bg-blue-100 text-blue-800';
			case 'Accepted':
				return 'bg-green-100 text-green-800';
			case 'Rejected':
				return 'bg-red-100 text-red-800';
			case 'Withdrawn':
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Offers Management</h1>
	</div>

	<!-- Filters -->
	<div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
		<div class="flex-1">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search by property or buyer..."
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

	<!-- Offers Grid -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each filteredOffers as offer (offer.id)}
			<div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
				<div class="p-6">
					<div class="flex justify-between items-start mb-4">
						<div class="flex-1">
							<h3 class="text-lg font-medium text-gray-900 truncate">{offer.property}</h3>
							<p class="mt-1 text-sm text-gray-500">{offer.buyer}</p>
						</div>
						<span
							class={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(
								offer.status
							)}`}
						>
							{offer.status}
						</span>
					</div>
					
					<div class="mt-4 space-y-3">
						<div class="flex justify-between">
							<span class="text-sm text-gray-500">Amount</span>
							<span class="text-sm font-medium text-gray-900">{formatAmount(offer.amount)}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-sm text-gray-500">Submitted</span>
							<span class="text-sm text-gray-900">{new Date(offer.submittedDate).toLocaleDateString()}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-sm text-gray-500">Expires</span>
							<span class="text-sm text-gray-900">{new Date(offer.expirationDate).toLocaleDateString()}</span>
						</div>
					</div>

					<div class="mt-4 flex flex-wrap gap-2">
						{#each offer.conditions as condition}
							<span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
								{condition}
							</span>
						{/each}
					</div>

					<div class="mt-6 text-right">
						<Button
							onclick={() => viewDetails(offer)}
						>
							View Details
							<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
							</svg>
						</Button>
					</div>
				</div>
			</div>
		{:else}
			<div class="col-span-full text-center py-12 bg-white rounded-lg">
				<p class="text-gray-500">No offers found</p>
			</div>
		{/each}
	</div>
</div>

<!-- Details Modal -->
{#if showDetailsModal && selectedOffer}
  <FormBackdrop handleClose={() => (showDetailsModal = false)}>
    <div class="w-full mt-3">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Offer Details</h3>
      <div class="mt-4 space-y-4">
        <div>
          <h4 class="text-sm font-medium text-gray-500">Property</h4>
          <p class="mt-1 text-sm text-gray-900">{selectedOffer.property}</p>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Buyer</h4>
          <p class="mt-1 text-sm text-gray-900">{selectedOffer.buyer}</p>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Amount</h4>
          <p class="mt-1 text-sm text-gray-900">{formatAmount(selectedOffer.amount)}</p>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Status</h4>
          <div class="mt-1">
            <select
              bind:value={selectedOffer.status}
              on:change={() => updateStatus(selectedOffer.id, selectedOffer.status)}
              class="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {#each statuses as status}
                <option value={status}>{status}</option>
              {/each}
            </select>
          </div>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Conditions</h4>
          <ul class="mt-1 space-y-1">
            {#each selectedOffer.conditions as condition}
              <li class="text-sm text-gray-900">• {condition}</li>
            {/each}
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Notes</h4>
          <div class="mt-1">
            <textarea
              bind:value={newNote}
              rows="2"
              class="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Add a note..."
            ></textarea>
            <button
              on:click={addNote}
              class="mt-2 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Note
            </button>
          </div>
          <div class="mt-2 p-2 max-h-40 overflow-y-auto bg-gray-50 rounded-md">
            <pre class="text-sm text-gray-900 whitespace-pre-wrap">{selectedOffer.notes}</pre>
          </div>
        </div>
      </div>
    </div>
  </FormBackdrop>
    
{/if}