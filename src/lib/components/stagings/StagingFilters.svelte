<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { StagingStatus } from '$lib/types/staging';

	export let searchQuery = '';
	export let statusFilter: 'All' | StagingStatus = 'All';
	export let typeFilter = 'All';
	export let sortBy = 'newest';

	const dispatch = createEventDispatcher();

	// 状态选项
	const statusOptions: Array<'All' | StagingStatus> = ['All', 'draft', 'submitted', 'confirmed', 'paid', 'schedule'];
	
	// 类型选项
	const typeOptions = ['All', 'Full Home', 'Partial', 'Virtual', 'Consultation'];
	
	// 排序选项
	const sortOptions = [
		{ value: 'newest', label: 'Newest First' },
		{ value: 'oldest', label: 'Oldest First' },
		{ value: 'budget-high', label: 'Budget: High to Low' },
		{ value: 'budget-low', label: 'Budget: Low to High' }
	];

	// 处理搜索输入变化
	function handleSearchChange(e) {
		searchQuery = e.target.value;
		updateFilters();
	}

	// 处理状态过滤器变化
	function handleStatusChange(e) {
		statusFilter = e.target.value;
		updateFilters();
	}

	// 处理类型过滤器变化
	function handleTypeChange(e) {
		typeFilter = e.target.value;
		updateFilters();
	}

	// 处理排序变化
	function handleSortChange(e) {
		sortBy = e.target.value;
		updateFilters();
	}

	// 更新过滤器并通知父组件
	function updateFilters() {
		dispatch('filter', {
			searchQuery,
			statusFilter,
			typeFilter,
			sortBy
		});
	}

	// 重置所有过滤器
	function resetFilters() {
		searchQuery = '';
		statusFilter = 'All';
		typeFilter = 'All';
		sortBy = 'newest';
		updateFilters();
	}
</script>

<div class="bg-white shadow rounded-lg p-4 mb-6">
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
		<!-- 搜索框 -->
		<div class="relative">
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			<input
				type="text"
				bind:value={searchQuery}
				on:input={handleSearchChange}
				placeholder="Search properties..."
				class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
			/>
		</div>

		<!-- 状态过滤器 -->
		<div>
			<label for="status-filter" class="block text-xs font-medium text-gray-700 mb-1">Status</label>
			<select
				id="status-filter"
				bind:value={statusFilter}
				on:change={handleStatusChange}
				class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
			>
				{#each statusOptions as status}
					<option value={status}>{status}</option>
				{/each}
			</select>
		</div>

		<!-- 类型过滤器 -->
		<div>
			<label for="type-filter" class="block text-xs font-medium text-gray-700 mb-1">Type</label>
			<select
				id="type-filter"
				bind:value={typeFilter}
				on:change={handleTypeChange}
				class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
			>
				{#each typeOptions as type}
					<option value={type}>{type}</option>
				{/each}
			</select>
		</div>

		<!-- 排序选项 -->
		<div>
			<label for="sort-by" class="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
			<select
				id="sort-by"
				bind:value={sortBy}
				on:change={handleSortChange}
				class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
			>
				{#each sortOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- 重置按钮 -->
	<div class="mt-4 flex justify-end">
		<button
			on:click={resetFilters}
			class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
		>
			Reset Filters
		</button>
	</div>
</div>