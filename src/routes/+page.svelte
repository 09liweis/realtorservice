<script>
	import Banner from '$lib/components/home/Banner.svelte';
	import ServiceModules from '$lib/components/home/ServiceModules.svelte';
	import MarketInsights from '$lib/components/home/MarketInsights.svelte';
	import TestimonialsStats from '$lib/components/home/TestimonialsStats.svelte';
	import ListingsGrid from '$lib/components/home/ListingsGrid.svelte';

	export let data;
</script>

<svelte:head>
	<title>Realtor Service - Professional Real Estate Solutions</title>
	<meta name="description" content="Professional real estate services including open houses, staging, assignment listings, social media management, and offer management." />
</svelte:head>

<Banner />
<ServiceModules />
<ListingsGrid listings={data.listings} showViewMore={true} />
<MarketInsights />
<TestimonialsStats />