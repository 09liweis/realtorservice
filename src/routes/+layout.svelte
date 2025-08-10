<script>
	import Header from '../lib/components/Header.svelte';
	import Footer from './Footer.svelte';
	import '../app.css';
	import { initializeAuth, user } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
    import { goto } from '$app/navigation';

	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();

	onMount(() => {
		initializeAuth();
		const redirectUrl = localStorage.getItem('redirect');
		if (redirectUrl && $user) {
			localStorage.removeItem('redirect');
			goto(redirectUrl);
		}
	});
</script>

<div>

<Header />

<main class="">
	{@render children()}
</main>

{#if !$page.url.pathname.startsWith('/dashboard')}
	<Footer />
{/if}

</div>