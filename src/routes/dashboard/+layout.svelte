<script>
	import { page } from '$app/stores';

	// 导航项
	const navItems = [
		{ name: 'Dashboard', href: '/dashboard', icon: '📊' },
		{ name: 'Listings', href: '/dashboard/listings', icon: '🏠' },
		{ name: 'Open Houses', href: '/dashboard/openhouses', icon: '🔍' },
		{ name: 'Offers', href: '/dashboard/offers', icon: '�' },
		{ name: 'Stagings', href: '/dashboard/stagings', icon: '🛋️' }
	];

	// 检查当前路径是否匹配导航项
	function isActive(href) {
		return $page.url.pathname === href || 
			($page.url.pathname !== '/dashboard' && href !== '/dashboard' && $page.url.pathname.startsWith(href));
	}

	// 移动端菜单状态
	let mobileMenuOpen = false;
</script>

<div class="min-h-screen bg-gray-100">
	<!-- 顶部导航栏 -->
	<nav class="bg-white shadow-sm">
		<div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex">
					<div class="flex items-center flex-shrink-0">
						<a href="/" class="text-xl font-bold text-blue-600">RealTor Service</a>
					</div>
				</div>
				<div class="flex items-center">
					<div class="hidden md:ml-4 md:flex md:items-center">
						<button
							type="button"
							class="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							<span class="sr-only">View notifications</span>
							🔔
						</button>

						<!-- 个人资料下拉菜单 -->
						<div class="relative ml-3">
							<div>
								<button
									type="button"
									class="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								>
									<span class="sr-only">Open user menu</span>
									<div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
										👤
									</div>
								</button>
							</div>
						</div>
					</div>
					<div class="flex items-center -mr-2 md:hidden">
						<!-- 移动端菜单按钮 -->
						<button
							type="button"
							on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
							class="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							<span class="sr-only">Open main menu</span>
							{#if mobileMenuOpen}
								❌
							{:else}
								☰
							{/if}
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- 移动端菜单 -->
		{#if mobileMenuOpen}
			<div class="md:hidden">
				<div class="pt-2 pb-3 space-y-1">
					{#each navItems as item}
						<a
							href={item.href}
							class={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
								isActive(item.href)
									? 'bg-blue-50 border-blue-500 text-blue-700'
									: 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
							}`}
						>
							{item.icon} {item.name}
						</a>
					{/each}
				</div>
				<div class="pt-4 pb-3 border-t border-gray-200">
					<div class="flex items-center px-4">
						<div class="flex-shrink-0">
							<div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
								👤
							</div>
						</div>
						<div class="ml-3">
							<div class="text-base font-medium text-gray-800">John Doe</div>
							<div class="text-sm font-medium text-gray-500">john@example.com</div>
						</div>
					</div>
					<div class="mt-3 space-y-1">
						<a
							href="#"
							class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
						>
							Your Profile
						</a>
						<a
							href="#"
							class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
						>
							Settings
						</a>
						<a
							href="#"
							class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
						>
							Sign out
						</a>
					</div>
				</div>
			</div>
		{/if}
	</nav>

	<div class="py-6">
		<div class="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
			<div class="flex flex-col md:flex-row">
				<!-- 侧边栏导航 - 桌面版 -->
				<div class="hidden md:block md:w-64 md:flex-shrink-0">
					<div class="h-full px-3 py-4 overflow-y-auto bg-white rounded-lg shadow">
						<div class="space-y-1">
							{#each navItems as item}
								<a
									href={item.href}
									class={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
										isActive(item.href)
											? 'bg-blue-100 text-blue-900'
											: 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
									}`}
								>
									<span class="mr-3">{item.icon}</span>
									{item.name}
								</a>
							{/each}
						</div>
					</div>
				</div>

				<!-- 主内容区域 -->
				<div class="flex-1 mt-5 md:mt-0 md:ml-6">
					<slot />
				</div>
			</div>
		</div>
	</div>
</div>