<script>
	import Header from '../lib/components/Header.svelte';
	import Footer from './Footer.svelte';
	import '../app.css';
	import { initializeAuth } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();

	onMount(() => {
		initializeAuth();
	});
</script>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>

	{#if !$page.url.pathname.startsWith('/dashboard')}
		<Footer />
	{/if}
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
	}
</style>