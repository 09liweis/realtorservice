<script lang="ts">
  export let id: string;
  export let label: string;
  export let value: string;
  export let options: { value: string; label: string }[];
  export let required = false;
  export let helpText: string | undefined = undefined;
  export let disabled = false;

  // Forward the value changes to parent
  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    value = target.value;
  }
</script>

<div>
  <label for={id} class="block text-sm font-medium text-gray-700 mb-1">
    {label}
  </label>
  <select
    {disabled}
    {id}
    {required}
    value={value}
    on:change={handleChange}
    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0d7377] focus:border-[#0d7377] sm:text-sm {disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}"
  >
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  {#if helpText}
    <p class="text-xs text-gray-500 mt-1">{helpText}</p>
  {/if}
</div>