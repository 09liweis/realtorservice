<script>
	import { createEventDispatcher } from 'svelte';

	export let request = null;
	export let show = false;

	const dispatch = createEventDispatcher();

	// 关闭模态框
	function closeModal() {
		dispatch('close');
	}

	// 编辑请求
	function handleEdit() {
		dispatch('edit', request);
	}

	// 格式化金额
	function formatAmount(amount) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(amount);
	}

	// 格式化日期
	function formatDate(dateString) {
		if (!dateString) return 'Not scheduled';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
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
</script>

{#if show && request}
	<div class="fixed inset-0 z-10 overflow-y-auto">
		<div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
			<!-- 背景遮罩 -->
			<div
				class="fixed inset-0 transition-opacity"
				aria-hidden="true"
				on:click={closeModal}
			>
				<div class="absolute inset-0 bg-gray-500 opacity-75"></div>
			</div>

			<!-- 模态框内容 -->
			<div
				class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-headline"
			>
				<!-- 头部 -->
				<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<div class="sm:flex sm:items-start">
						<div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
							<div class="flex justify-between items-center">
								<h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
									Staging Request Details
								</h3>
								<span
									class={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(
										request.status
									)}`}
								>
									{request.status}
								</span>
							</div>

							<div class="mt-6 space-y-6">
								<!-- 属性信息 -->
								<div>
									<h4 class="text-sm font-medium text-gray-500">Property</h4>
									<p class="mt-1 text-sm text-gray-900">{request.property}</p>
								</div>

								<!-- 类型和预算 -->
								<div class="grid grid-cols-2 gap-4">
									<div>
										<h4 class="text-sm font-medium text-gray-500">Type</h4>
										<p class="mt-1 text-sm text-gray-900">{request.type}</p>
									</div>
									<div>
										<h4 class="text-sm font-medium text-gray-500">Budget</h4>
										<p class="mt-1 text-sm text-gray-900">{formatAmount(request.budget)}</p>
									</div>
								</div>

								<!-- 联系人信息 -->
								<div>
									<h4 class="text-sm font-medium text-gray-500">Contact Information</h4>
									<div class="mt-1 text-sm text-gray-900">
										<p>{request.contactPerson}</p>
										{#if request.contactEmail}
											<p class="mt-1">
												<span class="text-gray-500">Email:</span>
												<a href="mailto:{request.contactEmail}" class="text-blue-600 hover:underline">
													{request.contactEmail}
												</a>
											</p>
										{/if}
										{#if request.contactPhone}
											<p class="mt-1">
												<span class="text-gray-500">Phone:</span>
												<a href="tel:{request.contactPhone}" class="text-blue-600 hover:underline">
													{request.contactPhone}
												</a>
											</p>
										{/if}
									</div>
								</div>

								<!-- 日期信息 -->
								<div>
									<h4 class="text-sm font-medium text-gray-500">Scheduled Date</h4>
									<p class="mt-1 text-sm text-gray-900">{formatDate(request.scheduledDate)}</p>
								</div>

								<!-- 备注 -->
								{#if request.notes}
									<div>
										<h4 class="text-sm font-medium text-gray-500">Notes</h4>
										<p class="mt-1 text-sm text-gray-900 whitespace-pre-line">{request.notes}</p>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<!-- 底部按钮 -->
				<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
					<button
						type="button"
						on:click={handleEdit}
						class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
					>
						Edit
					</button>
					<button
						type="button"
						on:click={closeModal}
						class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}