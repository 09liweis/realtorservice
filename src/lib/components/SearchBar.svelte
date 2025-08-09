<script lang="ts">
  import { page } from '$app/stores';

  let searchQuery = '';

  function handleSearch() {
    $page.url.searchParams.set('q', searchQuery);
  }
</script>

<div class="w-full">
  <input
    type="text"
    bind:value={searchQuery}
    placeholder="Search listings..."
    class="w-full p-2 border rounded"
    on:keydown={(e) => e.key === 'Enter' && handleSearch()}
  />
</div>