<script>
	// 导入所需的库和组件
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { 
		StagingCard, 
		StagingFilters, 
		StagingsList, 
		StagingForm, 
		StagingDetailsModal 
	} from '$lib/components/stagings';
  import Button from '$lib/components/Button.svelte';

	// 模拟数据 - 在实际应用中，这些数据将从API获取
	let stagingRequests = [
		{
			id: '1',
			location: '123 Main St, San Francisco, CA 94105',
			size: '2500',
			occupation_status: 'Vacant',
			property_type: 'House',
			rooms: 'Living Room, Dining Room, Kitchen, 3 Bedrooms, 2 Bathrooms',
			selling_price: 1500000,
			timeline: 'June 15, 2023',
			length: '45 days',
			status: 'Pending',
			contactPerson: 'John Doe',
			contactEmail: 'john@example.com',
			contactPhone: '(415) 555-1234',
			notes: 'Modern style preferred. Need staging completed before open house on June 20.'
		},
		{
			id: '2',
			location: '456 Market St, San Francisco, CA 94103',
			size: '1800',
			occupation_status: 'Occupied',
			property_type: 'Condo',
			rooms: 'Living Room, Master Bedroom',
			selling_price: 950000,
			timeline: 'June 10, 2023',
			length: '30 days',
			status: 'Scheduled',
			contactPerson: 'Jane Smith',
			contactEmail: 'jane@example.com',
			contactPhone: '(415) 555-5678',
			notes: 'Living room and master bedroom only. Owner will be moving out next week.'
		},
		{
			id: '3',
			location: '789 Valencia St, San Francisco, CA 94110',
			size: '1200',
			occupation_status: 'Vacant',
			property_type: 'Townhouse',
			rooms: 'All Rooms',
			selling_price: 750000,
			timeline: 'May 28, 2023',
			length: '60 days',
			status: 'Completed',
			contactPerson: 'Bob Johnson',
			contactEmail: 'bob@example.com',
			contactPhone: '(415) 555-9012',
			notes: 'Property sold within 2 weeks of staging.'
		},
		{
			id: '4',
			location: '101 California St, San Francisco, CA 94111',
			size: '3200',
			occupation_status: 'Vacant',
			property_type: 'House',
			rooms: 'Living Room, Family Room, Kitchen, Master Suite',
			selling_price: 2200000,
			timeline: 'TBD',
			length: '90 days',
			status: 'Cancelled',
			contactPerson: 'Alice Brown',
			contactEmail: 'alice@example.com',
			contactPhone: '(415) 555-3456',
			notes: 'Client cancelled due to budget constraints.'
		}
	];

	// 状态变量
	let loading = false;
	let error = null;
	let showForm = false;
	let showDetails = false;
	let currentRequest = null;
	let isEditMode = false;
	let filteredRequests = [];

	// 过滤器状态
	let searchQuery = '';
	let statusFilter = 'All';
	let typeFilter = 'All';
	let sortBy = 'newest';

	// 初始化
	onMount(() => {
		// 模拟API加载
		setTimeout(() => {
			loading = false;
			applyFilters();
		}, 1000);
	});
	applyFilters();

	// 应用过滤器
	function applyFilters() {
		// 过滤请求
		let filtered = [...stagingRequests];

		// 应用搜索查询
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(req) =>
					req.property.toLowerCase().includes(query) ||
					req.contactPerson.toLowerCase().includes(query) ||
					(req.notes && req.notes.toLowerCase().includes(query))
			);
		}

		// 应用状态过滤器
		if (statusFilter !== 'All') {
			filtered = filtered.filter((req) => req.status === statusFilter);
		}

		// 应用类型过滤器
		if (typeFilter !== 'All') {
			filtered = filtered.filter((req) => req.type === typeFilter);
		}

		// 应用排序
		switch (sortBy) {
			case 'newest':
				filtered.sort((a, b) => (a.id < b.id ? 1 : -1));
				break;
			case 'oldest':
				filtered.sort((a, b) => (a.id > b.id ? 1 : -1));
				break;
			case 'budget-high':
				filtered.sort((a, b) => b.budget - a.budget);
				break;
			case 'budget-low':
				filtered.sort((a, b) => a.budget - b.budget);
				break;
		}

		filteredRequests = filtered;
	}

	// 处理过滤器变化
	function handleFilterChange(event) {
		searchQuery = event.detail.searchQuery;
		statusFilter = event.detail.statusFilter;
		typeFilter = event.detail.typeFilter;
		sortBy = event.detail.sortBy;
		applyFilters();
	}

	// 查看请求详情
	function viewRequest(request) {
		currentRequest = request;
		showDetails = true;
	}

	// 编辑请求
	function editRequest(request) {
		currentRequest = { ...request };
		isEditMode = true;
		showForm = true;
		showDetails = false;
	}

	// 新建请求
	function newRequest() {
    console.log('test');
		currentRequest = {
			id: (stagingRequests.length + 1).toString(),
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
		isEditMode = false;
		showForm = true;
	}

	// 删除请求
	function deleteRequest(id) {
		if (confirm('Are you sure you want to delete this staging request?')) {
			stagingRequests = stagingRequests.filter((req) => req.id !== id);
			applyFilters();
		}
	}

	// 提交表单
	function handleSubmit(event) {
		const formData = event.detail;

		if (isEditMode) {
			// 更新现有请求
			stagingRequests = stagingRequests.map((req) =>
				req.id === formData.id ? { ...formData } : req
			);
		} else {
			// 添加新请求
			stagingRequests = [...stagingRequests, formData];
		}

		showForm = false;
		applyFilters();
	}

	// 取消表单
	function cancelForm() {
		showForm = false;
	}

	// 关闭详情模态框
	function closeDetails() {
		showDetails = false;
	}
</script>

<div class="container mx-auto">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-2xl font-bold text-gray-900">Staging Requests</h1>
		<Button
			onclick={newRequest}
		>
			<svg class="mr-2 -ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
					clip-rule="evenodd"
				/>
			</svg>
			New Staging Request
		</Button>
	</div>

	<!-- 主内容区域 -->
	{#if showForm}
		<div transition:fade={{ duration: 200 }}>
			<StagingForm 
				isEdit={isEditMode} 
				request={currentRequest} 
				on:submit={handleSubmit} 
				on:cancel={cancelForm} 
			/>
		</div>
	{:else}
		<!-- 过滤器 -->
		<StagingFilters
			{searchQuery}
			{statusFilter}
			{typeFilter}
			{sortBy}
			on:filter={handleFilterChange}
		/>

		<!-- 请求列表 -->
		<StagingsList
			requests={filteredRequests}
			{loading}
			{error}
			on:view={(e) => viewRequest(e.detail)}
			on:edit={(e) => editRequest(e.detail)}
			on:delete={(e) => deleteRequest(e.detail)}
			on:new={newRequest}
		/>
	{/if}

	<!-- 详情模态框 -->
	<StagingDetailsModal
		request={currentRequest}
		show={showDetails}
		on:close={closeDetails}
		on:edit={(e) => editRequest(e.detail)}
	/>
</div>