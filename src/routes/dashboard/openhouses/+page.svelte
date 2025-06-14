<script>
	// 模拟数据 - 在实际应用中，这些数据会从API获取
	let openHouses = [
		{
			id: 1,
			address: '123 Main St, Anytown, CA',
			date: '2024-02-15',
			startTime: '14:00',
			endTime: '16:00',
			description: 'Beautiful 3 bedroom house with modern amenities',
			status: 'Upcoming'
		},
		{
			id: 2,
			address: '456 Oak Ave, Somewhere, CA',
			date: '2024-02-14',
			startTime: '13:00',
			endTime: '15:00',
			description: 'Charming 2 bedroom condo in downtown',
			status: 'Upcoming'
		},
		{
			id: 3,
			address: '789 Pine St, Nowhere, CA',
			date: '2024-02-10',
			startTime: '12:00',
			endTime: '14:00',
			description: 'Spacious 4 bedroom family home with large backyard',
			status: 'Completed'
		},
		{
			id: 4,
			address: '321 Elm St, Elsewhere, CA',
			date: '2024-02-08',
			startTime: '15:00',
			endTime: '17:00',
			description: 'Modern 3 bedroom townhouse with garage',
			status: 'Completed'
		}
	];

	// 状态变量
	let showAddForm = false;
	let searchQuery = '';
	let statusFilter = 'All';
	let editingId = null;

	// 新开放看房的表单数据
	let newOpenHouse = {
		address: '',
		date: '',
		startTime: '',
		endTime: '',
		description: ''
	};

	// 过滤开放看房
	$: filteredOpenHouses = openHouses.filter((house) => {
		const matchesSearch = house.address.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === 'All' || house.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	// 添加新开放看房
	function addOpenHouse() {
		const id = openHouses.length > 0 ? Math.max(...openHouses.map((h) => h.id)) + 1 : 1;
		openHouses = [
			...openHouses,
			{
				...newOpenHouse,
				id,
				status: 'Upcoming'
			}
		];
		resetForm();
		showAddForm = false;
	}

	// 开始编辑开放看房
	function startEdit(house) {
		editingId = house.id;
		newOpenHouse = { ...house };
		showAddForm = true;
	}

	// 更新开放看房
	function updateOpenHouse() {
		openHouses = openHouses.map((house) =>
			house.id === editingId ? { ...newOpenHouse, id: editingId } : house
		);
		resetForm();
		showAddForm = false;
	}

	// 删除开放看房
	function deleteOpenHouse(id) {
		if (confirm('Are you sure you want to delete this open house?')) {
			openHouses = openHouses.filter((house) => house.id !== id);
		}
	}

	// 重置表单
	function resetForm() {
		newOpenHouse = {
			address: '',
			date: '',
			startTime: '',
			endTime: '',
			description: ''
		};
		editingId = null;
	}

	// 取消表单
	function cancelForm() {
		resetForm();
		showAddForm = false;
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Open Houses Management</h1>
		<button
			on:click={() => {
				showAddForm = true;
				resetForm();
			}}
			class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
		>
			Add Open House
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
				<option value="Upcoming">Upcoming</option>
				<option value="Completed">Completed</option>
			</select>
		</div>
	</div>

	<!-- Add/Edit Form -->
	{#if showAddForm}
		<div class="p-6 bg-white rounded-lg shadow">
			<h2 class="mb-4 text-lg font-medium text-gray-900">
				{editingId ? 'Edit Open House' : 'Add New Open House'}
			</h2>
			<form
				on:submit|preventDefault={editingId ? updateOpenHouse : addOpenHouse}
				class="space-y-4"
			>
				<div>
					<label for="address" class="block text-sm font-medium text-gray-700">Address</label>
					<input
						type="text"
						id="address"
						bind:value={newOpenHouse.address}
						required
						class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div>
						<label for="date" class="block text-sm font-medium text-gray-700">Date</label>
						<input
							type="date"
							id="date"
							bind:value={newOpenHouse.date}
							required
							class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="startTime" class="block text-sm font-medium text-gray-700">Start Time</label>
						<input
							type="time"
							id="startTime"
							bind:value={newOpenHouse.startTime}
							required
							class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="endTime" class="block text-sm font-medium text-gray-700">End Time</label>
						<input
							type="time"
							id="endTime"
							bind:value={newOpenHouse.endTime}
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
						bind:value={newOpenHouse.description}
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

	<!-- Open Houses Grid -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each filteredOpenHouses as house (house.id)}
			<div class="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
				<div class="p-4 border-b border-gray-200 bg-gray-50">
					<div class="flex items-center justify-between">
						<h3 class="text-lg font-medium text-gray-900 truncate">{house.address}</h3>
						<span
							class={`px-2 py-1 text-xs font-medium rounded-full ${
								house.status === 'Upcoming'
									? 'bg-green-100 text-green-800'
									: 'bg-gray-100 text-gray-800'
							}`}
						>
							{house.status}
						</span>
					</div>
				</div>
				
				<div class="p-4">
					<div class="flex items-center mb-3">
						<div class="flex-shrink-0 text-blue-500 mr-2">
							📅
						</div>
						<div>
							<p class="text-sm font-medium text-gray-900">
								{new Date(house.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
							</p>
							<p class="text-xs text-gray-500">{house.startTime} - {house.endTime}</p>
						</div>
					</div>
					
					<div class="mt-3">
						<p class="text-sm text-gray-500">{house.description}</p>
					</div>
				</div>
				
				<div class="px-4 py-3 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
					<button
						on:click={() => startEdit(house)}
						class="text-sm text-blue-600 hover:text-blue-900 flex items-center"
					>
						<span class="mr-1">✏️</span> Edit
					</button>
					<button
						on:click={() => deleteOpenHouse(house.id)}
						class="text-sm text-red-600 hover:text-red-900 flex items-center"
					>
						<span class="mr-1">🗑️</span> Delete
					</button>
				</div>
			</div>
		{:else}
			<div class="col-span-full text-center py-12 bg-white rounded-lg">
				<p class="text-gray-500">No open houses found</p>
			</div>
		{/each}
	</div>
</div>