<script>
  export let data;
</script>

<main class="max-w-4xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">Mortgage Rate Insights</h1>
  {#if data.error}
    <p class="text-red-500">Error: {data.error}</p>
  {:else}
    <ul class="space-y-4">
      {#each data.rssFeed as item}
        <li class="border-b border-gray-200 pb-4">
          <a href={item.link} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline font-medium">
            {item.title}
          </a>
          <p class="text-gray-600 mt-2">{item.description}</p>
          <small class="text-gray-400 block mt-1">Published: {item.pubDate}</small>
        </li>
      {/each}
    </ul>
  {/if}
</main>