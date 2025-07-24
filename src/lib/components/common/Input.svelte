<script lang="ts">
    import { PUBLIC_MAPBOX_API_KEY } from '$env/static/public';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  // Props
  export let id = '';
  export let autocomplete = '';
  export let name = '';
  export let type = 'text';
  export let label = '';
  export let value = '';
  export let min = 0;
  export let step = 1;
  export let placeholder = '';
  export let required = false;
  export let minlength = 1;
  export let error = false;
  export let errorMessage = '';
  export let disabled = false;
  export let classes = '';
  
  // State for address suggestions
  let suggestions: any[] = [];
  let loading = false;
  
  // Fetch address suggestions from Mapbox API
  async function fetchAddressSuggestions(query: string) {
    if (!query || autocomplete !== 'address') {
      suggestions = [];
      return;
    }
    
    loading = true;
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${PUBLIC_MAPBOX_API_KEY}&limit=5`
      );
      const data = await response.json();
      suggestions = data.features || [];
    } catch (err) {
      console.error('Failed to fetch address suggestions:', err);
      suggestions = [];
    } finally {
      loading = false;
    }
  }
  
  // Handle input event
  function handleInput(event: any) {
    dispatch('input', event);
    if (autocomplete === 'address') {
      fetchAddressSuggestions(event.target.value);
    }
  }
  
  // Handle change event
  function handleChange(event: any) {
    dispatch('change', event);
  }
  
  // Handle focus event
  function handleFocus(event: any) {
    dispatch('focus', event);
  }
  
  // Handle blur event
  function handleBlur(event: any) {
    dispatch('blur', event);
  }
  
  // Base input classes with enhanced styling
  const baseClasses = 'appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d7377] focus:border-[#0d7377] transition-colors duration-200 ease-in-out sm:text-sm';
  
  // Compute input classes based on error state and disabled state
  $: inputClasses = `${baseClasses} ${
    error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
  } ${
    disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
  } ${classes}`;
</script>

<div class="space-y-1">
  {#if label}
    <label for={id} class="block text-sm font-medium text-gray-700">
      {label}
      {#if required}
        <span class="text-red-500 ml-1">*</span>
      {/if}
    </label>
  {/if}
  
  <input
    {id}
    {name}
    {type}
    {min}
    {step}
    {placeholder}
    {required}
    {minlength}
    {disabled}
    bind:value
    class={inputClasses}
    on:input={handleInput}
    on:change={handleChange}
    on:focus={handleFocus}
    on:blur={handleBlur}
  />
  
  {#if suggestions.length > 0}
    <ul class="mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
      {#each suggestions as suggestion}
        <li 
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          on:click={() => {
            value = suggestion.place_name;
            suggestions = [];
          }}
        >
          {suggestion.place_name}
        </li>
      {/each}
    </ul>
  {/if}
  
  {#if error && errorMessage}
    <p class="text-sm text-red-600 flex items-center mt-1">
      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {errorMessage}
    </p>
  {/if}
</div>