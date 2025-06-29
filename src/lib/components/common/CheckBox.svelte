<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let id = '';
  export let name = '';
  export let label = '';
  export let checked = false;
  export let disabled = false;
  export let required = false;
  export let error = false;
  export let errorMessage = '';
  export let helpText = '';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let variant: 'default' | 'switch' | 'radio' = 'default';
  export let value = '';
  export let group = undefined; // For radio button groups
  export let classes = '';

  // Handle change event
  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    
    if (variant === 'radio') {
      group = target.value;
      dispatch('change', { value: target.value, checked: target.checked });
    } else {
      checked = target.checked;
      dispatch('change', { checked: target.checked, value });
    }
    
    dispatch('input', event);
  }
  
  // Handle focus and blur events
  function handleFocus(event: Event) {
    dispatch('focus', event);
  }
  
  function handleBlur(event: Event) {
    dispatch('blur', event);
  }

  // Size classes
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  // Base input classes
  $: inputClasses = `
    ${sizeClasses[size]}
    ${variant === 'switch' ? 'rounded-full' : 'rounded'}
    border-gray-300 
    text-primary 
    focus:ring-primary 
    focus:ring-2 
    focus:ring-offset-2
    transition-all 
    duration-200 
    ease-in-out
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
    ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-primary'}
    ${classes}
  `.trim().replace(/\s+/g, ' ');

  // Label classes
  $: labelClasses = `
    text-sm 
    font-medium 
    ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 cursor-pointer'}
    ${error ? 'text-red-700' : ''}
    transition-colors 
    duration-200
  `.trim().replace(/\s+/g, ' ');

  // Container classes for different variants
  $: containerClasses = variant === 'switch' 
    ? 'flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200'
    : 'flex items-start space-x-3';
</script>

<div class="space-y-1">
  <div class={containerClasses}>
    {#if variant === 'switch'}
      <!-- Switch Style Layout -->
      <div class="flex-1">
        {#if label}
          <label for={id} class={labelClasses}>
            {label}
            {#if required}
              <span class="text-red-500 ml-1">*</span>
            {/if}
          </label>
        {/if}
        {#if helpText}
          <p class="text-xs text-gray-500 mt-1">{helpText}</p>
        {/if}
      </div>
      <div class="flex-shrink-0">
        <input
          {id}
          {name}
          type="checkbox"
          {value}
          bind:checked
          {disabled}
          {required}
          class={inputClasses}
          on:change={handleChange}
          on:focus={handleFocus}
          on:blur={handleBlur}
        />
      </div>
    {:else if variant === 'radio'}
      <!-- Radio Button Style -->
      <input
        {id}
        {name}
        type="radio"
        {value}
        bind:group
        {disabled}
        {required}
        class={inputClasses}
        on:change={handleChange}
        on:focus={handleFocus}
        on:blur={handleBlur}
      />
      {#if label}
        <label for={id} class={labelClasses}>
          {label}
          {#if required}
            <span class="text-red-500 ml-1">*</span>
          {/if}
        </label>
      {/if}
    {:else}
      <!-- Default Checkbox Style -->
      <input
        {id}
        {name}
        type="checkbox"
        {value}
        bind:checked
        {disabled}
        {required}
        class={inputClasses}
        on:change={handleChange}
        on:focus={handleFocus}
        on:blur={handleBlur}
      />
      <div class="flex-1">
        {#if label}
          <label for={id} class={labelClasses}>
            {label}
            {#if required}
              <span class="text-red-500 ml-1">*</span>
            {/if}
          </label>
        {/if}
        {#if helpText}
          <p class="text-xs text-gray-500 mt-1">{helpText}</p>
        {/if}
      </div>
    {/if}
  </div>
  
  {#if error && errorMessage}
    <p class="text-sm text-red-600 flex items-center mt-1">
      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {errorMessage}
    </p>
  {/if}
</div>