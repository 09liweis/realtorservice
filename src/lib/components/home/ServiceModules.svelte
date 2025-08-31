<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
    import { user } from '$lib/stores/auth';

	let services: boolean[] = [];
	let observer;

	function createIntersectionObserver(element) {
		if (!observer) {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							const index = parseInt(entry.target?.dataset.index);
							services[index] = true;
							services = services;
							observer?.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.2 }
			);
		}
		observer.observe(element);
	}

	onMount(() => {
		services = new Array(4).fill(false);
	});

	const serviceData = [
		{
			title: 'Professional Staging',
			description: 'Transform your property with expert staging services that highlight its best features and create emotional connections with buyers.',
			image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
			price: 'Starting at $2,500',
			features: ['Furniture & decor selection', 'Room layout optimization', 'Complete setup & removal'],
			color: 'from-purple-500 to-pink-500',
			bgColor: 'from-purple-50 to-pink-50',
			icon: '✨',
      link: $user ? '/dashboard/stagings' : '/realtor-services/listing/staging'
		},
		{
			title: 'Professional Cleaning',
			description: 'Comprehensive cleaning services to ensure your property looks spotless for showings and photography.',
			image: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=800',
			price: 'Starting at $150',
			features: ['Deep cleaning service', 'Pre-listing preparation', 'Move-in/out cleaning'],
			color: 'from-green-500 to-emerald-500',
			bgColor: 'from-green-50 to-emerald-50',
			icon: '🧽',
      link: $user ? '/dashboard/cleanings' : '/realtor-services/listing/cleaning'
		},
		{
			title: 'Video Editing Services',
			description: 'Professional video editing services to enhance your property marketing with high-quality visuals.',
			image: 'https://images.pexels.com/photos/5698855/pexels-photo-5698855.jpeg?auto=compress&cs=tinysrgb&w=800',
			price: 'Starting at $300',
			features: ['Video editing & enhancement', 'Property walkthrough videos', 'Social media video content'],
			color: 'from-teal-500 to-cyan-500',
			bgColor: 'from-teal-50 to-cyan-50',
			icon: '🎬',
      link: $user ? '/dashboard/videos' : '/realtor-services/social-media/video'
		},
		{
			title: 'Social Media Branding',
			description: 'Complete social media management and branding solutions to showcase your properties and build your professional presence.',
			image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
			price: 'Starting at $480/month',
			features: ['Content creation & scheduling', 'Professional branding', 'Analytics & reporting'],
			color: 'from-blue-500 to-indigo-500',
			bgColor: 'from-blue-50 to-indigo-50',
			icon: '📱',
      link: $user ? '/dashboard/social_media_services' : '/realtor-services/social-media/management'
		}
	];
</script>

<section class="py-20 bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
				Our Professional Services
			</h2>
			<p class="text-xl text-gray-600 max-w-3xl mx-auto">
				Comprehensive real estate solutions designed to maximize your property's potential and accelerate your success.
			</p>
		</div>
		
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			{#each serviceData as service, index}
				<div 
					class="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
					data-index={index}
					use:createIntersectionObserver
				>
					{#if services[index]}
						<div in:scale={{ duration: 600, delay: index * 150, easing: elasticOut }}>
							<!-- Service Image -->
							<div class="relative h-64 overflow-hidden">
								<img 
									src={service.image} 
									alt={service.title}
									class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
								/>
								<div class="absolute inset-0 bg-gradient-to-t {service.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
								
								<!-- Service Icon -->
								<div class="absolute top-4 left-4 w-12 h-12 bg-white bg-opacity-90 rounded-xl flex items-center justify-center">
									<span class="text-2xl">{service.icon}</span>
								</div>
								
								<!-- Price Badge -->
								<div class="absolute top-4 right-4 bg-white bg-opacity-95 px-4 py-2 rounded-full">
									<span class="text-sm font-bold text-gray-900">{service.price}</span>
								</div>
							</div>
							
							<!-- Service Content -->
							<div class="p-8">
								<h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
									{service.title}
								</h3>
								<p class="text-gray-600 mb-6 leading-relaxed">
									{service.description}
								</p>
								
								<!-- Features List -->
								<ul class="space-y-2 mb-8">
									{#each service.features as feature}
										<li class="flex items-center text-sm text-gray-600">
											<svg class="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
											</svg>
											{feature}
										</li>
									{/each}
								</ul>
								
								<!-- Action Buttons -->
								<div class="flex flex-col sm:flex-row gap-3">
									<a
										href={service.link}
										class="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r {service.color} hover:shadow-lg transition-all duration-300 transform hover:scale-105"
									>
										Get Quote
									</a>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
		
		<!-- Call to Action -->
		<div class="mt-16 text-center">
			<div class="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white">
				<h3 class="text-3xl font-bold mb-4">Ready to Transform Your Real Estate Business?</h3>
				<p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
					Join thousands of successful realtors who trust our platform for their professional services.
				</p>
				<a
					href="/register"
					class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-primary bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
				>
					Start Your Free Trial
					<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
					</svg>
				</a>
			</div>
		</div>
	</div>
</section>