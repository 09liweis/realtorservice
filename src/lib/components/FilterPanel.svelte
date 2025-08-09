<script lang="ts">
  import { page } from '$app/stores';

  export let filterOptions;

  function handleFilterChange(filterType: string, value: string) {
    $page.url.searchParams.set(filterType, value);
  }
</script>

<div class="bg-white p-4 rounded shadow">
  <h2 class="font-bold text-lg mb-4">Filters</h2>
  {#each Object.entries(filterOptions) as [filterType, options]}
    <div class="mb-4">
      <h3 class="font-medium mb-2">{filterType}</h3>
      <select
        class="w-full p-2 border rounded"
        on:change={(e) => handleFilterChange(filterType, e.target.value)}
      >
        <option value="">All</option>
        {#each options as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>
  {/each}
</div>