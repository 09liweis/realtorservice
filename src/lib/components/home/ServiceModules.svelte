<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
    import { user } from '$lib/stores/auth';
    import { DASHBOARD_CLEANINGS_URL, DASHBOARD_SOCIAL_MEDIA_SERVICES_URL, DASHBOARD_STAGINGS_URL } from '$lib/types/constant';
  import Link from '../Link.svelte';

	let services: boolean[] = [];
	let observer: IntersectionObserver | null = null;

	function createIntersectionObserver(element: Element) {
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
			image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
			price: 'Starting at $2,500',
			features: ['Furniture & decor selection', 'Room layout optimization', 'Complete setup & removal'],
      link: $user ? DASHBOARD_STAGINGS_URL : '/realtor-services/listing/staging'
		},
		{
			title: 'Professional Cleaning',
			description: 'Comprehensive cleaning services to ensure your property looks spotless for showings and photography.',
			image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
			price: 'Starting at $150',
			features: ['Deep cleaning service', 'Pre-listing preparation', 'Move-in/out cleaning'],
      link: $user ? DASHBOARD_CLEANINGS_URL : '/realtor-services/listing/cleaning'
		},
		{
			title: 'Video Editing Services',
			description: 'Professional video editing services to enhance your property marketing with high-quality visuals.',
			image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
			price: 'Starting at $300',
			features: ['Video editing & enhancement', 'Property walkthrough videos', 'Social media video content'],
      link: $user ? '/dashboard/videos' : '/realtor-services/social-media/video'
		},
		{
			title: 'Social Media Branding',
			description: 'Complete social media management and branding solutions to showcase your properties and build your professional presence.',
			image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
			price: 'Starting at $480/month',
			features: ['Content creation & scheduling', 'Professional branding', 'Analytics & reporting'],
      link: $user ? DASHBOARD_SOCIAL_MEDIA_SERVICES_URL : '/realtor-services/social-media/management'
		}
	];
</script>

<section class="py-20 bg-gray-50">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
				Our Professional Services
			</h2>
			<p class="text-xl text-gray-600 max-w-3xl mx-auto">
				Comprehensive real estate solutions designed to maximize your property's potential and accelerate your success.
			</p>
		</div>
		
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
			{#each serviceData as service, index}
				<div 
					class="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
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
								
								<!-- Price Badge -->
								<div class="absolute top-4 right-4 bg-white bg-opacity-95 px-4 py-2 rounded-full">
									<span class="text-sm font-bold text-gray-900">{service.price}</span>
								</div>
							</div>
							
							<!-- Service Content -->
							<div class="p-4">
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
									<Link
										href={service.link}
										linkType='btn'
										className='w-full justify-center'
									>
										Get Quote
								</Link>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>