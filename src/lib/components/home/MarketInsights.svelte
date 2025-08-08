<script>
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';

	let visible = false;
	let insightsVisible = false;
	
	onMount(() => {
		visible = true;
		setTimeout(() => {
			insightsVisible = true;
		}, 600);
	});

	// Market insights data
	const marketInsights = [
		{
			id: 1,
			title: 'Bank of Canada Policy Rate',
			currentRate: '4.25%',
			change: '-0.25%',
			changeType: 'decrease',
			description: 'Recent rate cut signals economic adjustment',
			icon: '🏦',
			color: 'blue',
			bgColor: 'from-blue-50 to-blue-100',
			borderColor: 'border-blue-200',
			lastUpdated: '2 days ago'
		},
		{
			id: 2,
			title: 'Average Mortgage Rate',
			currentRate: '5.89%',
			change: '+0.15%',
			changeType: 'increase',
			description: '5-year fixed rate trending upward',
			icon: '🏠',
			color: 'green',
			bgColor: 'from-green-50 to-green-100',
			borderColor: 'border-green-200',
			lastUpdated: '1 day ago'
		},
		{
			id: 3,
			title: 'Toronto Market Stats',
			currentRate: '12.5%',
			change: '+2.1%',
			changeType: 'increase',
			description: 'Year-over-year price growth in GTA',
			icon: '📈',
			color: 'purple',
			bgColor: 'from-purple-50 to-purple-100',
			borderColor: 'border-purple-200',
			lastUpdated: '3 hours ago'
		},
		{
			id: 4,
			title: 'Policy Updates',
			currentRate: 'New',
			change: 'Updated',
			changeType: 'neutral',
			description: 'Foreign buyer tax adjustments announced',
			icon: '📋',
			color: 'orange',
			bgColor: 'from-orange-50 to-orange-100',
			borderColor: 'border-orange-200',
			lastUpdated: '5 hours ago'
		}
	];

	// Key market statistics
	const marketStats = [
		{
			label: 'Average Days on Market',
			value: '18',
			unit: 'days',
			trend: 'down',
			change: '-3 days',
			icon: '⏱️'
		},
		{
			label: 'Sales-to-Listings Ratio',
			value: '67%',
			unit: '',
			trend: 'up',
			change: '+5%',
			icon: '📊'
		},
		{
			label: 'New Listings',
			value: '2,847',
			unit: 'this month',
			trend: 'up',
			change: '+12%',
			icon: '🏘️'
		},
		{
			label: 'Price Index',
			value: '1,156',
			unit: 'points',
			trend: 'up',
			change: '+2.3%',
			icon: '💹'
		}
	];

	function getChangeColor(changeType) {
		switch (changeType) {
			case 'increase': return 'text-green-600';
			case 'decrease': return 'text-red-600';
			default: return 'text-blue-600';
		}
	}

	function getTrendColor(trend) {
		switch (trend) {
			case 'up': return 'text-green-600';
			case 'down': return 'text-red-600';
			default: return 'text-gray-600';
		}
	}

	function getTrendIcon(trend) {
		switch (trend) {
			case 'up': return '↗️';
			case 'down': return '↘️';
			default: return '➡️';
		}
	}
</script>

<section class="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		{#if visible}
			<div class="text-center mb-16" in:fly={{ y: -30, duration: 600, delay: 200 }}>
				<h2 class="text-4xl font-bold text-gray-900 mb-4">
					Market Insights
				</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto">
					Stay ahead with real-time market data, policy updates, and key insights that impact your real estate business.
				</p>
			</div>
		{/if}

		<!-- Market Insights Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
			{#each marketInsights as insight, index}
				{#if insightsVisible}
					<div 
						class="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group"
						in:fly={{ y: 30, duration: 600, delay: 400 + index * 150, easing: elasticOut }}
					>
						<!-- Header -->
						<div class="flex items-center justify-between mb-4">
							<div class="w-12 h-12 bg-gradient-to-br {insight.bgColor} rounded-xl flex items-center justify-center border {insight.borderColor}">
								<span class="text-2xl">{insight.icon}</span>
							</div>
							<div class="text-right">
								<div class="text-xs text-gray-500">{insight.lastUpdated}</div>
								<div class="text-xs font-medium {getChangeColor(insight.changeType)}">
									{insight.change}
								</div>
							</div>
						</div>

						<!-- Content -->
						<div class="mb-4">
							<h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
								{insight.title}
							</h3>
							<div class="text-3xl font-bold text-gray-900 mb-2">
								{insight.currentRate}
							</div>
							<p class="text-sm text-gray-600 leading-relaxed">
								{insight.description}
							</p>
						</div>

						<!-- Action -->
						<div class="pt-4 border-t border-gray-100">
							<button class="text-sm font-medium text-primary hover:text-primary-hover transition-colors duration-200 flex items-center group-hover:translate-x-1 transform transition-transform">
								View Details
								<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
								</svg>
							</button>
						</div>
					</div>
				{/if}
			{/each}
		</div>

		<!-- Market Statistics -->
		{#if insightsVisible}
			<div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" in:scale={{ duration: 600, delay: 1000, easing: elasticOut }}>
				<div class="bg-primary px-8 py-6 text-white">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="text-2xl font-bold mb-2">Key Market Statistics</h3>
							<p class="text-blue-100">Real-time data for informed decisions</p>
						</div>
						<div class="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
							<span class="text-3xl">📊</span>
						</div>
					</div>
				</div>

				<div class="p-8">
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{#each marketStats as stat, index}
							<div 
								class="text-center group"
								in:fly={{ y: 20, duration: 400, delay: 1200 + index * 100 }}
							>
								<div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
									<span class="text-2xl">{stat.icon}</span>
								</div>
								<div class="text-3xl font-bold text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-300">
									{stat.value}
								</div>
								<div class="text-sm font-medium text-gray-700 mb-2">
									{stat.label}
								</div>
								<div class="text-xs text-gray-500 mb-1">
									{stat.unit}
								</div>
								<div class="flex items-center justify-center space-x-1 text-xs {getTrendColor(stat.trend)}">
									<span>{getTrendIcon(stat.trend)}</span>
									<span class="font-medium">{stat.change}</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Market Analysis Call-to-Action -->
		{#if insightsVisible}
			<div class="mt-16 text-center" in:fade={{ duration: 800, delay: 1600 }}>
				<div class="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 md:p-12 text-white">
					<h3 class="text-3xl font-bold mb-4">Get Detailed Market Analysis</h3>
					<p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
						Access comprehensive market reports, trend analysis, and personalized insights to make informed decisions for your clients.
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/register"
							class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-primary bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
						>
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"></path>
							</svg>
							Access Full Reports
						</a>
						<a
							href="/dashboard"
							class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-semibold rounded-xl text-white hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105"
						>
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
							</svg>
							Quick Analysis
						</a>
					</div>
				</div>
			</div>
		{/if}

		<!-- Market Trends Mini Chart -->
		{#if insightsVisible}
			<div class="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-8" in:fly={{ y: 30, duration: 600, delay: 1800 }}>
				<div class="flex items-center justify-between mb-6">
					<div>
						<h3 class="text-xl font-bold text-gray-900 mb-2">Market Trend Overview</h3>
						<p class="text-gray-600">Last 6 months performance indicators</p>
					</div>
					<div class="text-right">
						<div class="text-sm text-gray-500">Updated</div>
						<div class="text-sm font-medium text-gray-900">Today, 2:30 PM</div>
					</div>
				</div>

				<!-- Simple trend visualization -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
						<div class="flex items-center justify-between mb-3">
							<div class="text-sm font-medium text-green-800">Sales Volume</div>
							<span class="text-2xl">📈</span>
						</div>
						<div class="text-2xl font-bold text-green-900 mb-1">+8.2%</div>
						<div class="text-sm text-green-700">vs. last quarter</div>
					</div>

					<div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
						<div class="flex items-center justify-between mb-3">
							<div class="text-sm font-medium text-blue-800">Average Price</div>
							<span class="text-2xl">💰</span>
						</div>
						<div class="text-2xl font-bold text-blue-900 mb-1">$1.2M</div>
						<div class="text-sm text-blue-700">GTA average</div>
					</div>

					<div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
						<div class="flex items-center justify-between mb-3">
							<div class="text-sm font-medium text-purple-800">Inventory</div>
							<span class="text-2xl">🏘️</span>
						</div>
						<div class="text-2xl font-bold text-purple-900 mb-1">2.1</div>
						<div class="text-sm text-purple-700">months supply</div>
					</div>
				</div>

				<!-- Market Insights Links -->
				<div class="mt-8 pt-6 border-t border-gray-200">
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<a
							href="/market-insights/bank-rate"
							class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
						>
							<div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
								<span class="text-sm">🏦</span>
							</div>
							<div>
								<div class="text-sm font-medium text-gray-900">Bank Rates</div>
								<div class="text-xs text-gray-500">Policy updates</div>
							</div>
						</a>

						<a
							href="/market-insights/mortgage-rate"
							class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
						>
							<div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
								<span class="text-sm">🏠</span>
							</div>
							<div>
								<div class="text-sm font-medium text-gray-900">Mortgage Rates</div>
								<div class="text-xs text-gray-500">Current trends</div>
							</div>
						</a>

						<a
							href="/market-insights/market-stats"
							class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
						>
							<div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
								<span class="text-sm">📊</span>
							</div>
							<div>
								<div class="text-sm font-medium text-gray-900">Market Stats</div>
								<div class="text-xs text-gray-500">Live data</div>
							</div>
						</a>

						<a
							href="/market-insights/policy-update"
							class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
						>
							<div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
								<span class="text-sm">📋</span>
							</div>
							<div>
								<div class="text-sm font-medium text-gray-900">Policy Updates</div>
								<div class="text-xs text-gray-500">Latest changes</div>
							</div>
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>