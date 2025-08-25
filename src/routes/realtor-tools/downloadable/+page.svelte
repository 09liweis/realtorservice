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

<main class="max-w-4xl mx-auto p-8">
  <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">Realtor Marketing Resources</h1>
  <p class="text-lg text-gray-600 mb-10 text-center">Download these essential resources to boost your online marketing efforts.</p>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {#each resources as resource}
      <div class="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
        <div class="flex flex-col h-full">
          <div class="flex-grow">
            <h2 class="text-2xl font-semibold text-gray-800">{resource.title}</h2>
            <p class="text-gray-600 mt-3">{resource.description}</p>
          </div>
          <div class="mt-6 flex justify-between items-center">
            <span class="text-sm text-gray-500">{resource.size}</span>
            <a 
              href={resource.file} 
              download
              class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    {/each}
  </div>
</main>