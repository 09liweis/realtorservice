<script>
	import Hero from '$lib/components/home/Hero.svelte';
	import Services from '$lib/components/home/Services.svelte';
	import About from '$lib/components/home/About.svelte';
	import Testimonials from '$lib/components/home/Testimonials.svelte';
	import CouponModal from '$lib/components/home/CouponModal.svelte';
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/auth';

	let showCouponModal = false;

	onMount(() => {
		// Show coupon modal for non-logged-in users after a short delay
		if (!$user) {
			setTimeout(() => {
				showCouponModal = true;
			}, 2000); // Show after 2 seconds
		}
	});

	function handleCloseCouponModal() {
		showCouponModal = false;
	}
</script>

<svelte:head>
	<title>Realtor Service - Professional Real Estate Solutions</title>
	<meta name="description" content="Professional real estate services including open houses, staging, assignment listings, social media management, and offer management." />
</svelte:head>

<Hero />
<Services />
<About />
<Testimonials />

<!-- Coupon Modal for New Users -->
<CouponModal 
	show={showCouponModal} 
	on:close={handleCloseCouponModal} 
/>