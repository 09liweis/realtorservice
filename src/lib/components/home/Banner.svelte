<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { user } from '$lib/stores/auth';
	
	let visible = false;
	
	onMount(() => {
		visible = true;
	});
</script>

<!-- Banner Section -->
<section class="relative bg-primary overflow-hidden">
	<!-- Background Pattern -->
	<div class="absolute inset-0 bg-black opacity-10"></div>
	
	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
		<div class="text-center">
			{#if visible}
				<div in:fly={{ y: -30, duration: 800, delay: 200 }}>
					<h1 class="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
						Empowering Realtors:
						<span class="block text-yellow-300">Seamless Listing & Standout Branding</span>
					</h1>
					<p class="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
						Transform your real estate business with our comprehensive suite of professional services designed to maximize your success.
					</p>
				</div>
				
				<div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center" in:fade={{ duration: 800, delay: 600 }}>
					<a
						href="/register"
						class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-primary bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
					>
						Get Started Today
						<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
						</svg>
					</a>
					<a
						href="/listings"
						class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-semibold rounded-xl text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
					>
						Browse Listings
					</a>
				</div>
			{/if}
		</div>
	</div>	
</section>