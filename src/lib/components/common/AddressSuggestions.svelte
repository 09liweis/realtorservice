<script lang="ts">
  import { PUBLIC_MAPBOX_API_KEY } from '$env/static/public';

  export let query: string;
  export let handleSuggestionClick: (value: any) => void;
  export let isTyping = false;

  // State for address suggestions
  let suggestions: any[] = [];
  let loading = false;
  let showSuggestions = false;

  // Fetch address suggestions from Mapbox API
  async function fetchAddressSuggestions() {
    if (!query || !isTyping) {
      suggestions = [];
      showSuggestions = false;
      return;
    }

    loading = true;
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${PUBLIC_MAPBOX_API_KEY}&limit=5`
      );
      const data = await response.json();
      suggestions = data.features || [];
      showSuggestions = suggestions.length > 0;
    } catch (err) {
      console.error('Failed to fetch address suggestions:', err);
      suggestions = [];
      showSuggestions = false;
    } finally {
      loading = false;
    }
  }

  // Call fetchAddressSuggestions when query changes
  $: if (query && isTyping) {
    fetchAddressSuggestions();
  }
</script>

{#if showSuggestions}
  <ul class="mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
    {#each suggestions as suggestion}
      <li 
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        on:click={() => {
          handleSuggestionClick(suggestion);
          showSuggestions = false;
        }}
      >
        {suggestion.place_name}
      </li>
    {/each}
  </ul>
{/if}