<script>
  // 可下载资源数据
  const resources = [
    {
      title: 'Online Marketing Guide',
      description: 'Comprehensive guide to online marketing strategies for realtors',
      file: '/downloads/marketing-guide.pdf',
      size: '2.4MB'
    },
    {
      title: 'Social Media Templates',
      description: 'Ready-to-use templates for social media posts',
      file: '/downloads/social-templates.zip',
      size: '5.1MB'
    },
    {
      title: 'Lead Generation Checklist',
      description: 'Step-by-step checklist for effective lead generation',
      file: '/downloads/lead-checklist.pdf',
      size: '1.2MB'
    }
  ];
</script>

<main class="max-w-4xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">Realtor Marketing Resources</h1>
  <p class="text-gray-600 mb-8">Download these essential resources to boost your online marketing efforts.</p>
  
  <div class="space-y-6">
    {#each resources as resource}
      <div class="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-semibold">{resource.title}</h2>
            <p class="text-gray-600 mt-2">{resource.description}</p>
          </div>
          <span class="text-sm text-gray-500">{resource.size}</span>
        </div>
        <a 
          href={resource.file} 
          download
          class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Download
        </a>
      </div>
    {/each}
  </div>
</main>