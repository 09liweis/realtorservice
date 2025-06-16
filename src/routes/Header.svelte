<script>
	import { page } from '$app/stores';
	import { user, signOut } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
  import { derived } from 'svelte/store';
	import Link from '$lib/components/Link.svelte';
	
	let mobileMenuOpen = $state(false);
	let userMenuOpen = $state(false);
	
	// Public navigation items
	const publicNavigation = [
		{ name: 'Home', href: '/' },
		{ name: 'Services', href: '#services' },
		{ name: 'About', href: '#about' },
		{ name: 'Testimonials', href: '#testimonials' },
		{ name: 'Contact', href: '#contact' }
	];

	// Navigation items for logged-in users
	const privateNavigation = [
		{ name: 'Dashboard', href: '/dashboard' },
		{ name: 'Listings', href: '/dashboard/listings' },
		{ name: 'Offers', href: '/dashboard/offers' }
	];

	// Get navigation items based on login status
	const navigation = derived(user, ($user) => $user ? [...publicNavigation, ...privateNavigation] : publicNavigation);

	async function handleSignOut() {
		const { success } = await signOut();
		if (success) {
			goto('/');
			userMenuOpen = false;
		}
	}
</script>

<header class="bg-white shadow-lg fixed w-full top-0 z-50">
	<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center">
			<!-- Logo -->
			<div class="flex-shrink-0">
				<Link href="/" className="text-2xl font-bold text-primary">
					<img src="/logo.png" alt="Realtor Service" class="w-32">
				</Link>
			</div>
			
			<!-- Desktop Navigation -->
			<div class="hidden md:block">
				<div class="ml-10 flex items-baseline space-x-4">
					{#each navigation as item}
						<Link 
							href={item.href}
							className="hover:text-primary-hover px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
						>
							{item.name}
						</Link>
					{/each}
				</div>
			</div>
			
			<!-- Auth Buttons / User Menu -->
			<div class="hidden md:block">
				{#if $user}
					<!-- User Menu -->
					<div class="relative">
						<button 
							on:click={() => userMenuOpen = !userMenuOpen}
							class="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
						>
							<span class="mr-2">{$user.email?.split('@')[0] || 'User'}</span>
							<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
						
						{#if userMenuOpen}
							<div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
								<Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
								<Link href="/dashboard/listings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Listings</Link>
								<Link href="/dashboard/offers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Offer Management</Link>
								<button 
									on:click={handleSignOut}
									class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								>
									Sign Out
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<!-- Login/Register Buttons -->
					<div class="flex space-x-2">
						<Link 
							href="/login" 
							className="text-blue-600 border border-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors duration-200"
						>
							Login
						</Link>
						<Link 
							href="/register" 
							className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
						>
							Register
						</Link>
					</div>
				{/if}
			</div>
			
			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					on:click={() => mobileMenuOpen = !mobileMenuOpen}
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
						<Link 
							href={item.href}
							className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
							on:click={() => mobileMenuOpen = false}
						>
							{item.name}
						</Link>
					{/each}
					
					<!-- Mobile Auth Section -->
					{#if $user}
						<div class="border-t border-gray-200 mt-4 pt-4">
							<div class="px-3 py-2 text-sm text-gray-500">
								{$user.email}
							</div>
							<button 
								on:click={() => {
									handleSignOut();
									mobileMenuOpen = false;
								}}
								class="text-red-600 hover:text-red-800 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
							>
								Sign Out
							</button>
						</div>
					{:else}
						<div class="border-t border-gray-200 mt-4 pt-4 space-y-2">
							<Link 
								href="/login" 
								className="text-blue-600 border border-blue-600 block text-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-50"
								on:click={() => mobileMenuOpen = false}
							>
								Login
							</Link>
							<Link 
								href="/register" 
								className="bg-blue-600 text-white block text-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
								on:click={() => mobileMenuOpen = false}
							>
								Register
							</Link>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</nav>
</header>