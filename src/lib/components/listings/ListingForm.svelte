<script lang="ts">
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';
  import ImageUpload from '$lib/components/ImageUpload.svelte';
  import type { Listing } from '$lib/types/listing';

  export let listing: Listing;
  export let onCancel: () => void;
  export let handleSubmit;

  // Convert pictures string to array for ImageUpload component
  let imageUrls: string[] = listing.pictures ? listing.pictures.split(',').filter(url => url.trim()) : [];

  // Handle image updates from ImageUpload component
  function handleImageUpdate(event: CustomEvent<string[]>) {
    imageUrls = event.detail;
    // Convert array back to comma-separated string for the listing object
    listing.pictures = imageUrls.join(',');
  }

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
    {name: 'is_sold', type: 'checkbox', label: 'Is Sold'}
  ]
</script>

<form
  onsubmit={handleSubmit}
  class="space-y-6 bg-white p-6 rounded-lg shadow max-w-6xl mx-auto max-h-[90vh] overflow-y-auto"
>
  <div class="border-b border-gray-200 pb-4">
    <h2 class="text-xl font-semibold text-gray-900">
      {listing.id ? 'Edit Listing' : 'Create New Listing'}
    </h2>
  </div>

  <!-- Property Images Section -->
  <div class="space-y-4">
    <h3 class="text-lg font-medium text-gray-900">Property Images</h3>
    <ImageUpload 
      images={imageUrls} 
      on:update={handleImageUpdate}
      maxImages={30}
    />
  </div>

  <!-- Property Details Section -->
  <div class="space-y-4">
    <h3 class="text-lg font-medium text-gray-900">Property Details</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div class={classes || 'col-span-full'}>
            <label for={name} class="block text-sm font-medium text-gray-700 mb-1">
              {label}
              {#if required}
                <span class="text-red-500">*</span>
              {/if}
            </label>
            <textarea
              id={name}
              bind:value={listing[name]}
              rows="4"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={label}
            ></textarea>
          </div>
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
  </div>

  <!-- Form Actions -->
  <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
    <Button type="button" variant="secondary" onclick={onCancel}>
      Cancel
    </Button>
    <Button type="submit">
      {listing.id ? 'Update Listing' : 'Create Listing'}
    </Button>
  </div>
</form>