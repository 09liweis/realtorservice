<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let services = [];
	let observer;

	function createIntersectionObserver(element) {
		if (!observer) {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							const index = parseInt(entry.target.dataset.index);
							services[index] = true;
							services = services;
							observer.unobserve(entry.target);
						}
					});
				},
				{
					threshold: 0.2
				}
			);
		}
		observer.observe(element);
	}

	onMount(() => {
		services = new Array(6).fill(false);
	});
</script>

<section id="services" class="py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
				Our Professional Services
			</h2>
			<p class="text-xl text-gray-600 max-w-3xl mx-auto">
				We provide comprehensive real estate solutions tailored to meet your specific needs and maximize your property's market potential.
			</p>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			<!-- Open House Service -->
			<div 
				class="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-xl transition-shadow duration-300"
				data-index="0"
				use:createIntersectionObserver
			>
				{#if services[0]}
					<div in:fly={{ y: 50, duration: 800, delay: 0 }}>
						<div class="bg-primary w-16 h-16 rounded-full flex items-center justify-center mb-6">
					<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4l2 2 4-4"></path>
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-gray-900 mb-4">Open House Management</h3>
				<p class="text-gray-600 mb-6">Professional open house coordination, visitor management, and follow-up services to maximize exposure and generate qualified leads.</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Event planning & coordination
					</li>
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Visitor registration & tracking
					</li>
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Post-event follow-up
					</li>
				</ul>
					</div>
				{/if}
			</div>
			
			<!-- Staging Service -->
			<div 
				class="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-xl transition-shadow duration-300"
				data-index="1"
				use:createIntersectionObserver
			>
				{#if services[1]}
					<div in:fly={{ y: 50, duration: 800, delay: 100 }}>
						<div class="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
					<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-gray-900 mb-4">Professional Staging</h3>
				<p class="text-gray-600 mb-6">Transform your property with expert staging services that highlight its best features and create an emotional connection with buyers.</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Furniture & decor selection
					</li>
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Room layout optimization
					</li>
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Complete setup & removal
					</li>
				</ul>
					</div>
				{/if}
			</div>
			
			<!-- Assignment Listings -->
			<div 
				class="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl hover:shadow-xl transition-shadow duration-300"
				data-index="2"
				use:createIntersectionObserver
			>
				{#if services[2]}
					<div in:fly={{ y: 50, duration: 800, delay: 200 }}>
						<div class="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
					<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-gray-900 mb-4">Assignment Listings</h3>
				<p class="text-gray-600 mb-6">Expert management of assignment sales with comprehensive marketing strategies and legal compliance to ensure smooth transactions.</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Legal documentation review
					</li>
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Market analysis & pricing
					</li>
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Buyer qualification process
					</li>
				</ul>
					</div>
				{/if}
			</div>
			
			<!-- Social Media Management -->
			<div 
				class="bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-2xl hover:shadow-xl transition-shadow duration-300"
				data-index="3"
				use:createIntersectionObserver
			>
				{#if services[3]}
					<div in:fly={{ y: 50, duration: 800, delay: 300 }}>
						<div class="bg-pink-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
					<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002-2V8M7 8h10M9 12h6m-6 4h6"></path>
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-gray-900 mb-4">Social Media Management</h3>
				<p class="text-gray-600 mb-6">Comprehensive social media marketing to showcase your properties across all major platforms and reach qualified buyers effectively.</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Content creation & scheduling
					</li>
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Targeted advertising campaigns
					</li>
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Analytics & reporting
					</li>
				</ul>
					</div>
				{/if}
			</div>
			
			<!-- Offer Management -->
			 {#if services[4]}
			<div class="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl hover:shadow-xl transition-shadow duration-300">
				<div class="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
					<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-gray-900 mb-4">Offer Management</h3>
				<p class="text-gray-600 mb-6">Strategic offer negotiation and management services to secure the best possible terms and ensure successful property transactions.</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Offer evaluation & analysis
					</li>
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Negotiation strategy development
					</li>
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Contract management
					</li>
				</ul>
			</div>
			{/if}
			
			<!-- Market Analysis -->
			<div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl hover:shadow-xl transition-shadow duration-300">
				<div class="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
					<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-gray-900 mb-4">Market Analysis</h3>
				<p class="text-gray-600 mb-6">Comprehensive market research and analysis to provide data-driven insights for optimal pricing and marketing strategies.</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Comparative market analysis
					</li>
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Pricing strategy recommendations
					</li>
					<li class="flex items-center">
						<svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
						Market trend reports
					</li>
				</ul>
			</div>
		</div>
	</div>
</section>