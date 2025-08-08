<script>
	import Banner from '$lib/components/home/Banner.svelte';
	import ServiceModules from '$lib/components/home/ServiceModules.svelte';
	import ForumHighlights from '$lib/components/home/ForumHighlights.svelte';
	// import MarketInsights from '$lib/components/home/MarketInsights.svelte';
	import TestimonialsStats from '$lib/components/home/TestimonialsStats.svelte';
</script>

<svelte:head>
	<title>Realtor Service - Professional Real Estate Solutions</title>
	<meta name="description" content="Professional real estate services including open houses, staging, assignment listings, social media management, and offer management." />
</svelte:head>

<Banner />
<ServiceModules />
<ForumHighlights />
<!-- <MarketInsights /> -->
<TestimonialsStats />