<script>
	import { page } from '$app/stores';
	
	let mobileMenuOpen = $state(false);
	
	const navigation = [
		{ name: 'Home', href: '/' },
		{ name: 'Services', href: '#services' },
		{ name: 'About', href: '#about' },
		{ name: 'Testimonials', href: '#testimonials' },
		{ name: 'Contact', href: '#contact' },
		{ name: 'Dashboard', href: '/dashboard' }
	];
</script>

<header class="bg-white shadow-lg fixed w-full top-0 z-50">
	<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- Logo -->
			<div class="flex-shrink-0">
				<a href="/" class="text-2xl font-bold text-blue-600">
					Realtor Service
				</a>
			</div>
			
			<!-- Desktop Navigation -->
			<div class="hidden md:block">
				<div class="ml-10 flex items-baseline space-x-4">
					{#each navigation as item}
						<a 
							href={item.href}
							class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
						>
							{item.name}
						</a>
					{/each}
				</div>
			</div>
			
			<!-- CTA Button -->
			<div class="hidden md:block">
				<a 
					href="#contact" 
					class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
				>
					Get Started
				</a>
			</div>
			
			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					onclick={() => mobileMenuOpen = !mobileMenuOpen}
					class="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
				>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
			</div>
		</div>
		
		<!-- Mobile Navigation -->
		{#if mobileMenuOpen}
			<div class="md:hidden">
				<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
					{#each navigation as item}
						<a 
							href={item.href}
							class="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
							onclick={() => mobileMenuOpen = false}
						>
							{item.name}
						</a>
					{/each}
					<a 
						href="#contact" 
						class="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 mt-4"
						onclick={() => mobileMenuOpen = false}
					>
						Get Started
					</a>
				</div>
			</div>
		{/if}
	</nav>
</header>