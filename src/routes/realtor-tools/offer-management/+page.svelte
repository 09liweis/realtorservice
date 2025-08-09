<script>
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

  // 排序选项
  const sortOptions = [
    { label: 'Date (Newest First)', value: 'date-desc' },
    { label: 'Date (Oldest First)', value: 'date-asc' },
    { label: 'Price (High to Low)', value: 'price-desc' },
    { label: 'Price (Low to High)', value: 'price-asc' },
    { label: 'Status', value: 'status' }
  ];

  let selectedSort = 'date-desc';
</script>

<main class="max-w-4xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">Offer & Property Management</h1>
  <p class="text-gray-600 mb-8">
    Streamline your real estate transactions with our comprehensive tools.
    Create properties, manage offers, collaborate with clients, and track progress all in one place.
  </p>

  <!-- 排序功能 -->
  <div class="mb-8">
    <label for="sort" class="block text-sm font-medium text-gray-700 mb-2">Sort Offers By:</label>
    <select 
      id="sort" 
      bind:value={selectedSort}
      class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
    >
      {#each sortOptions as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>
  
  <div class="space-y-6">
    {#each features as feature}
      <div class="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition">
        <h2 class="text-xl font-semibold">{feature.title}</h2>
        <p class="text-gray-600 mt-2">{feature.description}</p>
      </div>
    {/each}
  </div>
</main>