<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let id = '';
  export let name = '';
  export let type = 'text';
  export let label = '';
  export let value = '';
  export let placeholder = '';
  export let required = false;
  export let autocomplete = '';
  export let minlength = '';
  export let error = false;
  export let errorMessage = '';
  export let disabled = false;
  export let classes = '';
  
  // Handle input event
  function handleInput(event) {
    dispatch('input', event);
  }
  
  // Handle change event
  function handleChange(event) {
    dispatch('change', event);
  }
  
  // Handle focus event
  function handleFocus(event) {
    dispatch('focus', event);
  }
  
  // Handle blur event
  function handleBlur(event) {
    dispatch('blur', event);
  }
  
  // Base input classes
  const baseClasses = 'appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ease-in-out sm:text-sm';
  
  // Compute input classes based on error state
  $: inputClasses = `${baseClasses} ${error ? 'border-red-500' : 'border-gray-300'} ${classes}`;
</script>

<div>
  {#if label}
    <label for={id} class="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}
  
  <input
    {id}
    {name}
    {type}
    {placeholder}
    {required}
    {autocomplete}
    {minlength}
    {disabled}
    bind:value
    class={inputClasses}
    on:input={handleInput}
    on:change={handleChange}
    on:focus={handleFocus}
    on:blur={handleBlur}
  />
  
  {#if error && errorMessage}
    <p class="mt-1 text-sm text-red-500">{errorMessage}</p>
  {/if}
</div>