<script>
    import Link from "$lib/components/Link.svelte";
    import { user } from "$lib/stores/auth";
    import { DASHBOARD_OFFERS_URL } from "$lib/types/constant";

  // 报价管理服务功能列表
  const features = [
    {
      title: 'Create Property',
      description: 'Easily create and list new properties with detailed descriptions and media uploads.'
    },
    {
      title: 'Offer Management',
      description: 'Manage all offers with advanced sorting options (by date, price, or status).'
    },
    {
      title: 'Offer Tracking',
      description: 'Track all offers in one place with real-time updates and notifications.'
    }
  ];
</script>

<main class="max-w-4xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">Offer & Property Management</h1>
  <p class="text-gray-600 mb-8">
    Streamline your real estate transactions with our comprehensive tools.
    Create properties, manage offers, collaborate with clients, and track progress all in one place.
  </p>
  
  <div class="space-y-6">
    {#each features as feature}
      <div class="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition">
        <h2 class="text-xl font-semibold">{feature.title}</h2>
        <p class="text-gray-600 mt-2">{feature.description}</p>
      </div>
    {/each}

    <Link href={$user ? DASHBOARD_OFFERS_URL : `/login?redirect=${DASHBOARD_OFFERS_URL}`} linkType="btn" >Create Property</Link>
  </div>
</main>