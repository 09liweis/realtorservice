<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let id = '';
  export let name = '';
  export let type = 'text';
  export let label = '';
  export let value = '';
  export let checked = false;
  export let min = 0;
  export let placeholder = '';
  export let required = false;
  export let minlength = 1;
  export let error = false;
  export let errorMessage = '';
  export let disabled = false;
  export let classes = '';
  
  // Handle input event
  function handleInput(event:any) {
    dispatch('input', event);
  }
  
  // Handle change event
  function handleChange(event:any) {
    dispatch('change', event);
  }
  
  // Handle focus event
  function handleFocus(event:any) {
    dispatch('focus', event);
  }
  
  // Handle blur event
  function handleBlur(event:any) {
    dispatch('blur', event);
  }
  
  // Base input classes with enhanced styling
  const baseClasses = type === 'checkbox' 
    ? 'h-4 w-4 rounded border-gray-300 text-primary focus:ring-[#0d7377] transition-colors duration-200 ease-in-out'
    : 'appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0d7377] focus:border-[#0d7377] transition-colors duration-200 ease-in-out sm:text-sm';
  
  // Compute input classes based on error state and disabled state
  $: inputClasses = `${baseClasses} ${
    error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
  } ${
    disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
  } ${classes}`;
</script>

<div class="space-y-1">
  {#if label && type !== 'checkbox'}
    <label for={id} class="block text-sm font-medium text-gray-700">
      {label}
      {#if required}
        <span class="text-red-500 ml-1">*</span>
      {/if}
    </label>
  {/if}
  
  {#if type === 'checkbox'}
    <div class="flex items-center space-x-3">
      <input
        {id}
        {name}
        type="checkbox"
        bind:checked
        {disabled}
        class={inputClasses}
        on:input={handleInput}
        on:change={handleChange}
        on:focus={handleFocus}
        on:blur={handleBlur}
      />
      {#if label}
        <label for={id} class="text-sm font-medium text-gray-700">
          {label}
          {#if required}
            <span class="text-red-500 ml-1">*</span>
          {/if}
        </label>
      {/if}
    </div>
  {:else}
    <input
      {id}
      {name}
      {type}
      {min}
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