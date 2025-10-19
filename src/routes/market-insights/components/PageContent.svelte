<script>
  import Link from "$lib/components/Link.svelte";

  export let title;
  export let data;
</script>

<main class="max-w-4xl mx-auto p-6">
  <h1 class="text-3xl font-bold mb-6">{title}</h1>
  {#if data.error}
    <p class="text-red-500">Error: {data.error}</p>
  {:else}
    <ul class="space-y-4">
      {#each data.rssFeed as item}
        <li class="border-b border-gray-200 pb-4">
          <Link href={item.link} className="text-xl" target="_blank" rel="noopener noreferrer">
            {item.title}
          </Link>
          <p class="text-gray-600 mt-2">{item.description}</p>
          {#if item.pubDate}
          <small class="text-gray-400 block mt-1">Published: {item.pubDate}</small>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</main>