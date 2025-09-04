<script>
    import Link from "$lib/components/Link.svelte";
    import { user } from "$lib/stores/auth";
    import { DASHBOARD_OPENHOUSES_URL } from "$lib/types/constant";

  // 开放日服务功能列表
  const features = [
    {
      title: 'Schedule Open House',
      description: 'Easily schedule open houses with property details and timing.'
    },
    {
      title: 'Guest Management',
      description: 'Track visitor details including name, contact information, and notes.'
    },
    {
      title: 'Real-time Updates',
      description: 'Get real-time updates on open house attendance and feedback.'
    }
  ];
</script>

<main class="max-w-4xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">Open House Management</h1>
  <p class="text-gray-600 mb-8">
    Streamline your property viewings with our comprehensive tools.
    Schedule open houses, manage guests, and track feedback all in one place.
  </p>
  
  <div class="space-y-6">
    {#each features as feature}
      <div class="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition">
        <h2 class="text-xl font-semibold">{feature.title}</h2>
        <p class="text-gray-600 mt-2">{feature.description}</p>
      </div>
    {/each}

    <Link href={$user ? DASHBOARD_OPENHOUSES_URL : `/login?redirect=${DASHBOARD_OPENHOUSES_URL}`} linkType="btn" >Create Open House</Link>
  </div>
</main>