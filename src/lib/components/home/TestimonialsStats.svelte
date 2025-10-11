<script>
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';

	let visible = false;
	let statsVisible = false;
	
	onMount(() => {
		visible = true;
		setTimeout(() => {
			statsVisible = true;
		}, 800);
	});

	// Enhanced testimonials with more details
	const testimonials = [
		{
			id: 1,
			name: 'Sarah Johnson',
			role: 'Real Estate Agent',
			company: 'Royal LePage',
			location: 'Toronto, ON',
			avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
			rating: 5,
			quote: 'The staging service was incredible! My home sold within two weeks of listing, and I received multiple offers above asking price. The team\'s attention to detail made all the difference.',
			results: 'Sold 15% above asking price',
			service: 'Professional Staging'
		},
		{
			id: 2,
			name: 'Michael Chen',
			role: 'Property Investor',
			company: 'Chen Properties',
			location: 'Vancouver, BC',
			avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
			rating: 5,
			quote: 'Their social media marketing strategy was phenomenal. The property photos and virtual tours they created generated so much interest. Professional service from start to finish.',
			results: '300% increase in inquiries',
			service: 'Social Media Branding'
		},
		{
			id: 3,
			name: 'Emily Rodriguez',
			role: 'First-time Seller',
			company: 'Private Client',
			location: 'Calgary, AB',
			avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
			rating: 5,
			quote: 'The assignment listing service helped me navigate a complex transaction seamlessly. Their expertise in legal documentation and buyer qualification was invaluable.',
			results: 'Smooth transaction completion',
			service: 'Assignment Listings'
		}
	];

	// Statistics data with animations
	const stats = [
		{
			value: '500+',
			label: 'Properties Sold',
			description: 'Successfully closed transactions',
			icon: '🏠',
			color: 'text-blue-600',
			bgColor: 'bg-blue-100'
		},
		{
			value: '95%',
			label: 'Client Satisfaction',
			description: 'Happy clients rate us 5 stars',
			icon: '⭐',
			color: 'text-yellow-600',
			bgColor: 'bg-yellow-100'
		},
		{
			value: '14',
			label: 'Days Average Sale',
			description: 'Faster than market average',
			icon: '⚡',
			color: 'text-green-600',
			bgColor: 'bg-green-100'
		},
		{
			value: '10+',
			label: 'Years Experience',
			description: 'Proven track record',
			icon: '🏆',
			color: 'text-purple-600',
			bgColor: 'bg-purple-100'
		}
	];
</script>

<!-- Testimonials Section -->
<section class="py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		{#if visible}
			<div class="text-center mb-16" in:fly={{ y: -30, duration: 600, delay: 200 }}>
				<h2 class="text-4xl font-bold text-gray-900 mb-4">
					What Our Clients Say
				</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto">
					Real stories from real estate professionals who've transformed their business with our services.
				</p>
			</div>
		{/if}
		
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
			{#each testimonials as testimonial, index}
				{#if visible}
					<div 
						class="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group"
						in:fly={{ y: 30, duration: 600, delay: 400 + index * 200, easing: elasticOut }}
					>
						<!-- Rating Stars -->
						<div class="flex items-center mb-6">
							{#each Array(testimonial.rating) as _}
								<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
								</svg>
							{/each}
						</div>
						
						<!-- Quote -->
						<blockquote class="text-gray-700 mb-6 italic leading-relaxed">
							"{testimonial.quote}"
						</blockquote>
						
						<!-- Results Badge -->
						<div class="mb-6">
							<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
								✅ {testimonial.results}
							</span>
						</div>
						
						<!-- Author Info -->
						<div class="flex items-center">
							<img 
								src={testimonial.avatar} 
								alt={testimonial.name}
								class="w-12 h-12 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300"
							/>
							<div>
								<div class="font-semibold text-gray-900">{testimonial.name}</div>
								<div class="text-sm text-gray-600">{testimonial.role}</div>
								<div class="text-xs text-gray-500">{testimonial.company} • {testimonial.location}</div>
							</div>
						</div>
						
						<!-- Service Used -->
						<div class="mt-4 pt-4 border-t border-gray-200">
							<div class="text-xs text-gray-500 mb-1">Service Used:</div>
							<div class="text-sm font-medium text-primary">{testimonial.service}</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</section>

<!-- Statistics Section -->
<section class="py-20 bg-primary">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		{#if statsVisible}
			<div class="text-center mb-16" in:fade={{ duration: 800, delay: 200 }}>
				<h2 class="text-4xl font-bold text-white mb-4">
					Proven Results That Speak for Themselves
				</h2>
				<p class="text-xl text-blue-100 max-w-3xl mx-auto">
					Our track record demonstrates our commitment to excellence and client success.
				</p>
			</div>
		{/if}
		
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
			{#each stats as stat, index}
				{#if statsVisible}
					<div 
						class="text-center group"
						in:scale={{ duration: 800, delay: 400 + index * 150, start: 0.5, easing: elasticOut }}
					>
						<div class="w-20 h-20 {stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
							<span class="text-3xl">{stat.icon}</span>
						</div>
						<div class="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
							{stat.value}
						</div>
						<div class="text-lg font-semibold text-blue-100 mb-1">
							{stat.label}
						</div>
						<div class="text-sm text-blue-200">
							{stat.description}
						</div>
					</div>
				{/if}
			{/each}
		</div>
		
		<!-- Call to Action -->
		{#if statsVisible}
			<div class="mt-16 text-center" in:fade={{ duration: 800, delay: 1200 }}>
				<div class="bg-primary bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm border border-white border-opacity-20">
					<h3 class="text-2xl font-bold text-white mb-4">
						Ready to Join Our Success Stories?
					</h3>
					<p class="text-blue-100 mb-8 max-w-2xl mx-auto">
						Experience the difference our professional services can make for your real estate business.
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/register"
							class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-primary bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
						>
							Start Your Journey
							<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
							</svg>
						</a>
						<a
							href="/about"
							class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-semibold rounded-xl text-white transition-all duration-300 transform hover:scale-105"
						>
							Learn More About Us
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>