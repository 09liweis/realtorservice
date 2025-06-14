<script>
	// 这里可以添加数据获取逻辑
	const stats = [
		{ 
			name: 'Active Listings', 
			value: '12', 
			change: '+2', 
			changeType: 'increase',
			icon: '🏠'
		},
		{ 
			name: 'Pending Offers', 
			value: '23', 
			change: '+4', 
			changeType: 'increase',
			icon: '📝'
		},
		{ 
			name: 'Upcoming Open Houses', 
			value: '8', 
			change: '-1', 
			changeType: 'decrease',
			icon: '🔍'
		},
		{ 
			name: 'Staging Requests', 
			value: '5', 
			change: '+2', 
			changeType: 'increase',
			icon: '🪑'
		}
	];

	const recentOpenHouses = [
		{
			address: '123 Main St',
			date: '2024-02-15',
			time: '2:00 PM - 4:00 PM',
			visitors: 12
		},
		{
			address: '456 Oak Ave',
			date: '2024-02-14',
			time: '1:00 PM - 3:00 PM',
			visitors: 8
		}
	];

	const recentOffers = [
		{
			property: '789 Pine St',
			amount: '$850,000',
			status: 'Pending',
			date: '2024-02-13'
		},
		{
			property: '321 Elm St',
			amount: '$725,000',
			status: 'Under Review',
			date: '2024-02-12'
		}
	];
	
	// 格式化日期的函数
	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
		<div class="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
			Last updated: {new Date().toLocaleString()}
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
		{#each stats as stat}
			<a
				href="/dashboard/{stat.name.toLowerCase().split(' ')[1]}"
				class="block bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
			>
				<div class="px-4 py-5 sm:p-6">
					<div class="flex items-center">
						<div class="flex-shrink-0 bg-blue-50 rounded-full p-3 mr-4 text-2xl">
							{stat.icon}
						</div>
						<div class="flex-1">
							<div class="text-sm font-medium text-gray-500 truncate">{stat.name}</div>
							<div class="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</div>
						</div>
						<div
							class={`flex items-center text-sm font-medium ${
								stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
							}`}
						>
							<span class="mr-1">{stat.changeType === 'increase' ? '↑' : '↓'}</span>
							{stat.change}
						</div>
					</div>
				</div>
			</a>
		{/each}
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Recent Open Houses -->
		<div class="bg-white shadow rounded-lg overflow-hidden">
			<div class="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center bg-gray-50">
				<div class="flex items-center">
					<span class="text-xl mr-2">🔍</span>
					<h2 class="text-lg font-medium text-gray-900">Recent Open Houses</h2>
				</div>
				<a href="/dashboard/openhouses" class="text-sm text-blue-600 hover:text-blue-900 flex items-center">
					View All
					<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</a>
			</div>
			<div class="px-4 py-3 sm:px-6">
				<div class="space-y-4">
					{#each recentOpenHouses as openHouse}
						<div class="p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150 flex items-center justify-between">
							<div>
								<div class="font-medium text-gray-900">{openHouse.address}</div>
								<div class="text-sm text-gray-500 flex items-center mt-1">
									<span class="text-blue-500 mr-1">📅</span>
									{formatDate(openHouse.date)} • {openHouse.time}
								</div>
							</div>
							<div class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
								{openHouse.visitors} visitors
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Recent Offers -->
		<div class="bg-white shadow rounded-lg overflow-hidden">
			<div class="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center bg-gray-50">
				<div class="flex items-center">
					<span class="text-xl mr-2">📝</span>
					<h2 class="text-lg font-medium text-gray-900">Recent Offers</h2>
				</div>
				<a href="/dashboard/offers" class="text-sm text-blue-600 hover:text-blue-900 flex items-center">
					View All
					<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</a>
			</div>
			<div class="px-4 py-3 sm:px-6">
				<div class="space-y-4">
					{#each recentOffers as offer}
						<div class="p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150 flex items-center justify-between">
							<div>
								<div class="font-medium text-gray-900">{offer.property}</div>
								<div class="text-sm text-gray-500 flex items-center mt-1">
									<span class="text-blue-500 mr-1">📅</span>
									{formatDate(offer.date)}
								</div>
							</div>
							<div class="text-right">
								<div class="font-medium text-gray-900">{offer.amount}</div>
								<div
									class="mt-1 px-2 py-1 rounded-full text-xs font-medium inline-block
									{offer.status === 'Pending'
										? 'bg-yellow-100 text-yellow-800'
										: 'bg-blue-100 text-blue-800'}"
								>
									{offer.status}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>