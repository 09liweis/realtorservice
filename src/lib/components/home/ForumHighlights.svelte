<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';

	let visible = false;
	
	onMount(() => {
		visible = true;
	});

	// Sample forum posts data
	const forumPosts = [
		{
			id: 1,
			title: 'Best Staging Tips for Luxury Condos',
			author: 'Sarah Chen',
			avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
			excerpt: 'Sharing my experience with staging high-end condos in downtown Toronto. These techniques helped me sell 3 units above asking price...',
			replies: 24,
			likes: 89,
			category: 'Staging',
			timeAgo: '2 hours ago',
			featured: true
		},
		{
			id: 2,
			title: 'Social Media Strategy That Doubled My Leads',
			author: 'Michael Rodriguez',
			avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
			excerpt: 'Here\'s the exact social media strategy I used to generate 150+ qualified leads in just 3 months using our platform...',
			replies: 31,
			likes: 156,
			category: 'Marketing',
			timeAgo: '5 hours ago',
			featured: true
		},
		{
			id: 3,
			title: 'Assignment Sale Success Story: $50K Profit',
			author: 'Jennifer Liu',
			avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
			excerpt: 'Just closed an assignment sale with a $50,000 profit for my client. Here\'s how we navigated the process and what you need to know...',
			replies: 18,
			likes: 203,
			category: 'Sales',
			timeAgo: '1 day ago',
			featured: true
		}
	];

	function getCategoryColor(category) {
		switch (category) {
			case 'Staging': return 'bg-purple-100 text-purple-800';
			case 'Marketing': return 'bg-blue-100 text-blue-800';
			case 'Sales': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<section class="py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		{#if visible}
			<div class="text-center mb-16" in:fly={{ y: -30, duration: 600, delay: 200 }}>
				<h2 class="text-4xl font-bold text-gray-900 mb-4">
					Community Forum Highlights
				</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto">
					Learn from successful realtors sharing their experiences, tips, and strategies in our active community.
				</p>
			</div>
		{/if}
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each forumPosts as post, index}
				{#if visible}
					<div 
						class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
						in:fly={{ y: 30, duration: 600, delay: 300 + index * 150, easing: elasticOut }}
					>
						<!-- Post Header -->
						<div class="p-6 border-b border-gray-100">
							<div class="flex items-center justify-between mb-3">
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getCategoryColor(post.category)}">
									{post.category}
								</span>
								{#if post.featured}
									<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
										<svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
										</svg>
										Featured
									</span>
								{/if}
							</div>
							
							<h3 class="text-lg font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
								{post.title}
							</h3>
							
							<p class="text-gray-600 text-sm leading-relaxed line-clamp-3">
								{post.excerpt}
							</p>
						</div>
						
						<!-- Post Footer -->
						<div class="p-6">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									<img 
										src={post.avatar} 
										alt={post.author}
										class="w-8 h-8 rounded-full"
									/>
									<div>
										<div class="text-sm font-medium text-gray-900">{post.author}</div>
										<div class="text-xs text-gray-500">{post.timeAgo}</div>
									</div>
								</div>
								
								<div class="flex items-center space-x-4 text-xs text-gray-500">
									<div class="flex items-center space-x-1">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
										</svg>
										<span>{post.likes}</span>
									</div>
									<div class="flex items-center space-x-1">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
										</svg>
										<span>{post.replies}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>
		
		<!-- Forum Actions -->
		{#if visible}
			<div class="mt-12 text-center" in:fade={{ duration: 600, delay: 800 }}>
				<div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-blue-100">
					<h3 class="text-2xl font-bold text-gray-900 mb-4">Join the Conversation</h3>
					<p class="text-gray-600 mb-6 max-w-2xl mx-auto">
						Connect with fellow real estate professionals, share your experiences, and learn from the best in the industry.
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/forum"
							class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-hover transition-all duration-300 transform hover:scale-105"
						>
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
							</svg>
							View All Posts
						</a>
						<a
							href="/forum/new"
							class="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-base font-medium rounded-lg text-primary bg-white hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
						>
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
							</svg>
							Create Post
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>