<script lang="ts">
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';
  import type { Listing } from '$lib/types/listing';

  export let listing: Listing;
  export let onCancel: () => void;
  export let handleSubmit;


  const INPUT_FIELDS = [
    {name: 'listing_type', type: 'text', label: 'Listing Type', required: true},
    {name: 'project_name', type: 'text', label: 'Project Name', required: true},
    {name: 'developer', type: 'text', label: 'Developer'},
    {name: 'address', type: 'text', label: 'Address', required: true},
    {name: 'location', type: 'text', label: 'Location'},
    {name: 'ptype', type: 'text', label: 'Property Type'},
    {name: 'bedroom', type: 'number', label: 'Bedrooms'},
    {name: 'bathroom', type: 'number', label: 'Bathrooms'},
    {name: 'level', type: 'text', label: 'Level'},
    {name: 'size', type: 'number', label: 'Size (sqft)'},
    {name: 'parking', type: 'text', label: 'Parking'},
    {name: 'locker', type: 'text', label: 'Locker'},
    {name: 'basement', type: 'text', label: 'Basement'},
    {name: 'exposure', type: 'text', label: 'Exposure'},
    {name: 'occupancy', type: 'date', label: 'Occupancy Date'},
    {name: 'asking_price', type: 'number', label: 'Asking Price ($)'},
    {name: 'original_price', type: 'number', label: 'Original Price ($)'},
    {name: 'commission', type: 'number', label: 'Commission (%)', step: '0.1'},
    {name: 'deposit_paid', type: 'number', label: 'Deposit Paid ($)'},
    {name: 'description', type: 'textarea', label: 'Description', classes: 'col-span-full'},
    {name: 'pictures', type: 'text', label: 'Pictures URL', classes: 'col-span-full'},
    {name: 'is_sold', type: 'checkbox', label: 'Is Sold'}
  ]
</script>

<form
  onsubmit={handleSubmit}
  class="space-y-4 bg-white p-6 rounded-lg shadow"
>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
  {#each INPUT_FIELDS as { name, type, label, required = false, step, classes } (name)}
    {#if (type == 'checkbox')}
      <Input 
        id={name}
        bind:checked={listing[name]}
        type={type}
        label={label}
        {required}
        {classes}
      />
    {:else if (type == 'textarea')}
      <Input 
        id={name}
        bind:value={listing[name]}
        type={type}
        label={label}
        {required}
        {classes}
      />
    {:else}
      <Input 
        id={name}
        bind:value={listing[name]}
        type={type}
        label={label}
        {step}
        {required}
        {classes}
      />
    {/if}
  {/each}
  </div>

  <div class="flex justify-end space-x-3 pt-4">
    <Button type="button" variant="secondary" on:click={onCancel}>
      Cancel
    </Button>
    <Button type="submit">Save</Button>
  </div>
</form>