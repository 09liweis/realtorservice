<script lang="ts">
  export let value: string = '';
  export let label: string = '';
  export let id: string = '';
  export let placeholder: string = '';
  export let helpText: string = '';
  export let disabled: boolean = false;
  export let error: string | undefined = undefined;
  export let rows: number = 4;
</script>

<div class="mb-4">
  {#if label}
    <label
      for={id}
      class="block text-sm font-medium {error ? 'text-red-600' : 'text-gray-700'} mb-1"
    >
      {label}
    </label>
  {/if}

  <textarea
    {id}
    bind:value
    {placeholder}
    {disabled}
    {rows}
    class="w-full px-3 py-2 border {error ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm sm:text-sm"
    aria-invalid={error ? 'true' : 'false'}
    aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
  ></textarea>

  {#if error}
    <p id={`${id}-error`} class="mt-2 text-sm text-red-600">
      {error}
    </p>
  {:else if helpText}
    <p id={`${id}-help`} class="mt-2 text-sm text-gray-500">
      {helpText}
    </p>
  {/if}
</div>