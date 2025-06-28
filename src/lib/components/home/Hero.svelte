<script>
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { user } from '$lib/stores/auth';
	import CouponModal from './CouponModal.svelte';
	
	let visible = false;
	let showCouponModal = false;
	
	onMount(() => {
		visible = true;
	});

	function handleShowCoupons() {
		showCouponModal = true;
	}

	function handleCloseCouponModal() {
		showCouponModal = false;
	}
</script>

<section class="bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-16">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
			<div class="text-center lg:text-left">
				{#if visible}
					<div in:fly={{ x: -50, duration: 1000, delay: 200 }}>
						<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
							Professional
							<span class="text-primary">Real Estate</span>
							Solutions
						</h1>
						<p class="mt-6 text-xl text-gray-600 leading-relaxed">
							Comprehensive real estate services designed to maximize your property's potential. From staging to social media management, we handle every detail of your real estate journey.
						</p>
						
						<!-- Call to Action Buttons -->
						<div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
							<a
								href="/register"
								class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-primary hover:bg-primary-hover transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
							>
								Get Started Free
							</a>
							
							{#if !$user}
								<button
									on:click={handleShowCoupons}
									class="inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-lg font-medium rounded-xl text-primary bg-white hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
								>
									<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
									</svg>
									View Coupons
								</button>
							{/if}
						</div>

						<!-- Trust Indicators -->
						<div class="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-600">
							<div class="flex items-center space-x-2">
								<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								<span>Free to join</span>
							</div>
							<div class="flex items-center space-x-2">
								<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								<span>500+ Properties Sold</span>
							</div>
							<div class="flex items-center space-x-2">
								<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								<span>24/7 Support</span>
							</div>
						</div>
					</div>
				{/if}
			</div>
			<div class="relative">
				{#if visible}
					<img 
						in:fade={{ duration: 1000, delay: 600 }}
						src="https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800" 
						alt="Modern luxury home" 
						class="rounded-2xl shadow-2xl w-full h-auto"
					/>
					<div 
						class="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg"
						in:scale={{ start: 0.5, duration: 800, delay: 1000 }}
					>
					<div class="flex items-center space-x-4">
						<div class="bg-green-100 p-3 rounded-full">
							<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
							</svg>
						</div>
						<div>
							<p class="text-sm font-semibold text-gray-900">500+ Properties Sold</p>
							<p class="text-xs text-gray-600">This Year</p>
						</div>
					</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- Coupon Modal -->
<CouponModal 
	show={showCouponModal} 
	on:close={handleCloseCouponModal} 
/>