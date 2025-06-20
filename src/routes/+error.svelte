<script>
  import { page } from '$app/stores';
  import Link from '$lib/components/Link.svelte';
  import { getPageTitle } from '$lib/types/constant';
</script>

<svelte:head>
  <title>{getPageTitle('Page Not Found')}</title>
</svelte:head>

<main class="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16">
  <div class="max-w-2xl mx-auto">
    <div class="text-9xl font-bold text-primary-500 mb-4">404</div>
    <h1 class="text-4xl font-bold mb-6">Page Not Found</h1>
    <p class="text-lg text-gray-600 mb-8">
      We couldn't find the page you're looking for at <span class="font-mono bg-gray-100 px-2 py-1 rounded">{$page.url.pathname}</span>
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <Link href="/">Go to Homepage</Link>
    </div>
  </div>
</main>