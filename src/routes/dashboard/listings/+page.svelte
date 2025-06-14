<script lang="ts">
	// 模拟数据 - 在实际应用中，这些数据会从API获取
	let listings = [
		{
			id: 1,
			address: '123 Main St, Anytown, CA',
			price: 850000,
			bedrooms: 3,
			bathrooms: 2,
			sqft: 1800,
			status: 'Active',
			listedDate: '2024-02-01',
			description:
				'Beautiful 3 bedroom house with modern amenities. Open floor plan, updated kitchen, and spacious backyard.',
			features: ['Garage', 'Fireplace', 'Central AC', 'Hardwood Floors'],
			images: ['house1.jpg', 'house1-kitchen.jpg', 'house1-backyard.jpg']
		},
		{
			id: 2,
			address: '456 Oak Ave, Somewhere, CA',
			price: 725000,
			bedrooms: 2,
			bathrooms: 2,
			sqft: 1200,
			status: 'Pending',
			listedDate: '2024-01-15',
			description:
				'Charming 2 bedroom condo in downtown. Walking distance to shops and restaurants. Recently renovated.',
			features: ['In-unit Laundry', 'Balcony', 'Gym Access', 'Parking Space'],
			images: ['condo1.jpg', 'condo1-living.jpg', 'condo1-view.jpg']
		},
		{
			id: 3,
			address: '789 Pine St, Nowhere, CA',
			price: 1250000,
			bedrooms: 4,
			bathrooms: 3.5,
			sqft: 2800,
			status: 'Active',
			listedDate: '2024-02-10',
			description:
				'Spacious 4 bedroom family home with large backyard. Perfect for entertaining. Top-rated school district.',
			features: ['Pool', 'Home Office', 'Smart Home', 'Gourmet Kitchen'],
			images: ['house2.jpg', 'house2-pool.jpg', 'house2-office.jpg']
		},
		{
			id: 4,
			address: '321 Elm St, Elsewhere, CA',
			price: 675000,
			bedrooms: 3,
			bathrooms: 2.5,
			sqft: 1600,
			status: 'Sold',
			listedDate: '2024-01-05',
			soldDate: '2024-02-08',
			soldPrice: 695000,
			description:
				'Modern 3 bedroom townhouse with garage. Energy efficient appliances and close to public transportation.',
			features: ['Garage', 'Patio', 'Energy Star Appliances', 'Community Park'],
			images: ['townhouse1.jpg', 'townhouse1-kitchen.jpg', 'townhouse1-patio.jpg']
		}
	];

	// 状态变量
	let showAddForm = false;
	let searchQuery = '';
	let statusFilter = 'All';
	let editingId = null;
	let showDetailsModal = false;
	let selectedListing = null;

	// 新房源的表单数据
	let newListing = {
		address: '',
		price: '',
		bedrooms: '',
		bathrooms: '',
		sqft: '',
		status: 'Active',
		description: '',
		features: []
	};

	// 所有可能的状态
	const statuses = ['Active', 'Pending', 'Sold', 'Off Market'];

	// 过滤房源
	$: filteredListings = listings.filter((listing) => {
		const matchesSearch = listing.address.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === 'All' || listing.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	// 添加新房源
	function addListing() {
		const id = listings.length > 0 ? Math.max(...listings.map((l) => l.id)) + 1 : 1;
		listings = [
			...listings,
			{
				...newListing,
				id,
				listedDate: new Date().toISOString().split('T')[0],
				images: []
			}
		];
		resetForm();
		showAddForm = false;
	}

	// 开始编辑房源
	function startEdit(listing) {
		editingId = listing.id;
		newListing = { ...listing };
		showAddForm = true;
	}

	// 更新房源
	function updateListing() {
		listings = listings.map((listing) =>
			listing.id === editingId ? { ...newListing, id: editingId } : listing
		);
		resetForm();
		showAddForm = false;
	}

	// 查看房源详情
	function viewDetails(listing) {
		selectedListing = { ...listing };
		showDetailsModal = true;
	}

	// 删除房源
	function deleteListing(id) {
		if (confirm('Are you sure you want to delete this listing?')) {
			listings = listings.filter((listing) => listing.id !== id);
		}
	}

	// 重置表单
	function resetForm() {
		newListing = {
			address: '',
			price: '',
			bedrooms: '',
			bathrooms: '',
			sqft: '',
			status: 'Active',
			description: '',
			features: []
		};
		editingId = null;
	}

	// 取消表单
	function cancelForm() {
		resetForm();
		showAddForm = false;
	}

	// 格式化金额
	function formatPrice(price) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(price);
	}

	// 获取状态标签的样式
	function getStatusStyle(status) {
		switch (status) {
			case 'Active':
				return 'bg-green-100 text-green-800';
			case 'Pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'Sold':
				return 'bg-blue-100 text-blue-800';
			case 'Off Market':
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	// 添加或删除特性
	function toggleFeature(feature) {
		if (newListing.features.includes(feature)) {
			newListing.features = newListing.features.filter((f) => f !== feature);
		} else {
			newListing.features = [...newListing.features, feature];
		}
	}

	// 常见特性列表
	const commonFeatures = [
		'Garage',
		'Fireplace',
		'Central AC',
		'Hardwood Floors',
		'Pool',
		'Patio/Deck',
		'Smart Home',
		'Energy Efficient',
		'In-unit Laundry',
		'Balcony',
		'Home Office',
		'Gourmet Kitchen'
	];
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Listings Management</h1>
		<button
			on:click={() => {
				showAddForm = true;
				resetForm();
			}}
			class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
		>
			Add New Listing
		</button>
	</div>

	<!-- Filters -->
	<div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
		<div class="flex-1">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search by address..."
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
				{editingId ? 'Edit Listing' : 'Add New Listing'}
			</h2>
			<form
				on:submit|preventDefault={editingId ? updateListing : addListing}
				class="space-y-4"
			>
				<div>
					<label for="address" class="block text-sm font-medium text-gray-700">Address</label>
					<input
						type="text"
						id="address"
						bind:value={newListing.address}
						required
						class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label for="price" class="block text-sm font-medium text-gray-700">Price ($)</label>
						<input
							type="number"
							id="price"
							bind:value={newListing.price}
							min="0"
							step="1000"
							required
							class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="status" class="block text-sm font-medium text-gray-700">Status</label>
						<select
							id="status"
							bind:value={newListing.status}
							class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
						>
							{#each statuses as status}
								<option value={status}>{status}</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div>
						<label for="bedrooms" class="block text-sm font-medium text-gray-700">Bedrooms</label>
						<input
							type="number"
							id="bedrooms"
							bind:value={newListing.bedrooms}
							min="0"
							required
							class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="bathrooms" class="block text-sm font-medium text-gray-700">Bathrooms</label>
						<input
							type="number"
							id="bathrooms"
							bind:value={newListing.bathrooms}
							min="0"
							step="0.5"
							required
							class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="sqft" class="block text-sm font-medium text-gray-700">Square Feet</label>
						<input
							type="number"
							id="sqft"
							bind:value={newListing.sqft}
							min="0"
							required
							class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</div>
				<div>
					<label for="description" class="block text-sm font-medium text-gray-700"
						>Description</label
					>
					<textarea
						id="description"
						bind:value={newListing.description}
						rows="3"
						class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					></textarea>
				</div>
				<div>
					<span class="block text-sm font-medium text-gray-700">Features</span>
					<div class="grid grid-cols-2 gap-2 mt-2 sm:grid-cols-3 md:grid-cols-4">
						{#each commonFeatures as feature}
							<label class="inline-flex items-center">
								<input
									type="checkbox"
									checked={newListing.features?.includes(feature)}
									on:change={() => toggleFeature(feature)}
									class="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								/>
								<span class="ml-2 text-sm text-gray-700">{feature}</span>
							</label>
						{/each}
					</div>
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

	<!-- Listings Grid -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each filteredListings as listing (listing.id)}
			<div class="overflow-hidden bg-white rounded-lg shadow">
				<div class="h-48 bg-gray-200">
					<!-- 在实际应用中，这里会显示房源的第一张图片 -->
					<div class="flex items-center justify-center h-full text-gray-500">
						<span>Property Image</span>
					</div>
				</div>
				<div class="p-4">
					<div class="flex items-center justify-between">
						<h3 class="text-lg font-medium text-gray-900 truncate">{listing.address}</h3>
						<span class={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(listing.status)}`}>
							{listing.status}
						</span>
					</div>
					<p class="mt-1 text-xl font-semibold text-gray-900">{formatPrice(listing.price)}</p>
					<div class="mt-2 text-sm text-gray-500">
						{listing.bedrooms} bd | {listing.bathrooms} ba | {listing.sqft.toLocaleString()} sqft
					</div>
					<p class="mt-2 text-sm text-gray-500 line-clamp-2">{listing.description}</p>
					<div class="flex flex-wrap gap-2 mt-3">
						{#each listing.features.slice(0, 3) as feature}
							<span class="px-2 py-1 text-xs bg-gray-100 rounded-full">{feature}</span>
						{/each}
						{#if listing.features.length > 3}
							<span class="px-2 py-1 text-xs bg-gray-100 rounded-full">
								+{listing.features.length - 3} more
							</span>
						{/if}
					</div>
					<div class="flex justify-end mt-4 space-x-3">
						<button
							on:click={() => viewDetails(listing)}
							class="text-sm font-medium text-blue-600 hover:text-blue-900"
						>
							View Details
						</button>
						<button
							on:click={() => startEdit(listing)}
							class="text-sm font-medium text-blue-600 hover:text-blue-900"
						>
							Edit
						</button>
						<button
							on:click={() => deleteListing(listing.id)}
							class="text-sm font-medium text-red-600 hover:text-red-900"
						>
							Delete
						</button>
					</div>
				</div>
			</div>
		{:else}
			<div class="col-span-full text-center text-gray-500">No listings found</div>
		{/each}
	</div>
</div>

<!-- Details Modal -->
{#if showDetailsModal && selectedListing}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
			<!-- Modal panel -->
			<div
				class="inline-block static z-10 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
			>
				<!-- Header with title and close button -->
				<div class="flex items-center justify-between px-6 pt-6 pb-3 border-b border-gray-200">
					<h3 class="text-xl font-semibold leading-6 text-gray-900">Property Details</h3>
					<button
						type="button"
						on:click={() => (showDetailsModal = false)}
						class="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						<span class="sr-only">Close</span>
						<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- Modal content -->
				<div class="px-6 py-4">
					<div class="w-full">
						<div class="space-y-6">
							<!-- Main property info with highlight -->
							<div class="p-4 mb-6 bg-blue-50 rounded-lg">
								<h4 class="text-sm font-medium text-gray-500">Address</h4>
								<p class="mt-1 text-lg font-medium text-gray-900">{selectedListing.address}</p>
								
								<div class="grid grid-cols-2 gap-6 mt-4">
									<div>
										<h4 class="text-sm font-medium text-gray-500">Price</h4>
										<p class="mt-1 text-xl font-bold text-blue-600">{formatPrice(selectedListing.price)}</p>
									</div>
									<div>
										<h4 class="text-sm font-medium text-gray-500">Status</h4>
										<p class="mt-1">
											<span
												class={`px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle(
													selectedListing.status
												)}`}
											>
												{selectedListing.status}
											</span>
										</p>
									</div>
								</div>
							</div>
							
							<!-- Property specifications -->
							<div class="p-4 mb-6 border border-gray-200 rounded-lg">
								<h4 class="mb-4 text-base font-medium text-gray-700">Property Specifications</h4>
								<div class="grid grid-cols-3 gap-6">
									<div class="text-center">
										<div class="text-2xl font-bold text-gray-900">{selectedListing.bedrooms}</div>
										<p class="text-sm text-gray-500">Bedrooms</p>
									</div>
									<div class="text-center">
										<div class="text-2xl font-bold text-gray-900">{selectedListing.bathrooms}</div>
										<p class="text-sm text-gray-500">Bathrooms</p>
									</div>
									<div class="text-center">
										<div class="text-2xl font-bold text-gray-900">{selectedListing.sqft.toLocaleString()}</div>
										<p class="text-sm text-gray-500">Square Feet</p>
									</div>
								</div>
							</div>
							
							<!-- Description -->
							<div class="mb-6">
								<h4 class="mb-2 text-base font-medium text-gray-700">Description</h4>
								<p class="text-gray-700">{selectedListing.description}</p>
							</div>
							
							<!-- Features -->
							<div class="mb-6">
								<h4 class="mb-2 text-base font-medium text-gray-700">Features</h4>
								<div class="flex flex-wrap gap-2">
									{#each selectedListing.features as feature}
										<span class="px-3 py-1 text-sm bg-gray-100 rounded-full">{feature}</span>
									{/each}
								</div>
							</div>
							
							<!-- Dates and additional info -->
							<div class="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
								<div>
									<h4 class="text-sm font-medium text-gray-500">Listed Date</h4>
									<p class="mt-1 font-medium text-gray-900">
										{new Date(selectedListing.listedDate).toLocaleDateString()}
									</p>
								</div>
								{#if selectedListing.status === 'Sold'}
									<div>
										<h4 class="text-sm font-medium text-gray-500">Sold Date</h4>
										<p class="mt-1 font-medium text-gray-900">
											{new Date(selectedListing.soldDate).toLocaleDateString()}
										</p>
									</div>
								{/if}
								
								{#if selectedListing.status === 'Sold' && selectedListing.soldPrice}
									<div class="col-span-2">
										<h4 class="text-sm font-medium text-gray-500">Sold Price</h4>
										<p class="mt-1 text-lg font-bold text-green-600">{formatPrice(selectedListing.soldPrice)}</p>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
				
				<!-- Footer with action buttons -->
				<div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
					<div class="flex justify-end">
						<button
							type="button"
							on:click={() => (showDetailsModal = false)}
							class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}