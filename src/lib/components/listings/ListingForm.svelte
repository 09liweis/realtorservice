<script lang="ts">
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';
  import type { Listing } from '$lib/types/listing';

  export let listing: Listing;
  export let onCancel: () => void;
  export let handleSubmit;


  const INPUT_FEILDS = [
    {name: 'listing_type', type:'text', label: 'listing_type'},
    {name: 'project_name', type:'text', label: 'project_name'},
    {name: 'developer', type:'text', label: 'developer'},
    {name: 'address', type:'text', label: 'address'},
    {name: 'location', type:'text', label: 'location'},
    {name: 'ptype', type:'text', label: 'ptype'},
    {name: 'bedroom', type:'number', label: 'bedroom'},
    {name: 'bathroom', type:'number', label: 'bathroom'},
    {name: 'level', type:'text', label: 'level'},
    {name: 'size', type:'text', label: 'size'},
    {name: 'parking', type:'text', label: 'parking'},
    {name: 'locker', type:'text', label: 'locker'},
    {name: 'basement', type:'text', label: 'basement'},
    {name: 'exposure', type:'text', label: 'exposure'},
    {name: 'occupancy', type:'text', label: 'occupancy'},
    {name: 'asking_price', type:'number', label: 'asking_price'},
    {name: 'commission', type:'text', label: 'commission'},
    {name: 'description', type:'text', label: 'description'},
    {name: 'is_sold', type:'checkbox', label: 'is_sold'},
    {name: 'pictures', type:'text', label: 'pictures'},
    {name: 'original_price', type:'number', label: 'original_price'},
    {name: 'deposit_paid', type:'number', label: 'deposit_paid'},
  ]
</script>

<form
  onsubmit={handleSubmit}
  class="space-y-4 bg-white p-6 rounded-lg shadow"
>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
  {#each INPUT_FEILDS as { name, type, label } (name)}
    {#if (type == 'checkbox')}
    <Input 
    id={name}
    bind:checked={listing[name]}
    type={type}
    label={label}
    placeholder={label}
    />
    {:else}
    <Input 
    id={name}
    bind:value={listing[name]}
    type={type}
    label={label}
    placeholder={label}
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