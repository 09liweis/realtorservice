<script lang="ts">
  import Input from '$lib/components/common/Input.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import ImageUpload from '$lib/components/ImageUpload.svelte';
  import Select from '$lib/components/common/Select.svelte';
  import Textarea from '$lib/components/common/Textarea.svelte';
  import type { Listing } from '$lib/types/listing';

  export let listing: Listing;
  export let onCancel: () => void;
  export let handleSubmit;

  // Convert pics string to array for ImageUpload component
  let imageUrls: string[] = listing.pics ? listing.pics.split(',').filter(url => url.trim()) : [];

  // Handle image updates from ImageUpload component
  function handleImageUpdate(event: CustomEvent<string[]>) {
    imageUrls = event.detail;
    // Convert array back to comma-separated string for the listing object
    listing.pics = imageUrls.join(',');
  }

  // Form sections for better organization
  const basicInfoFields = [
    { name: 'listing_type', type: 'select', label: 'Listing Type', required: true, options: ['Assignment Sale','Coming Soon'] },
    { name: 'project_name', type: 'text', label: 'Project Name', required: true },
    { name: 'developer', type: 'text', label: 'Developer' },
    { name: 'address', type: 'text', label: 'Address', required: true },
    { name: 'location', type: 'text', label: 'Location/City' },
  ];

  const propertyDetailsFields = [
    { name: 'ptype', type: 'select', label: 'Property Type', options: ['Condo', 'House', 'Townhouse', 'Apartment', 'Commercial'] },
    { name: 'bedroom', type: 'number', label: 'Bedrooms', min: '0' },
    { name: 'bathroom', type: 'number', label: 'Bathrooms', min: '0', step: '0.5' },
    { name: 'level', type: 'text', label: 'Floor/Level' },
    { name: 'size', type: 'number', label: 'Size (sqft)', min: '0' },
    { name: 'exposure', type: 'select', label: 'Exposure', options: ['North', 'South', 'East', 'West', 'Northeast', 'Northwest', 'Southeast', 'Southwest'] },
  ];

  const amenitiesFields = [
    { name: 'parking', type: 'text', label: 'Parking' },
    { name: 'locker', type: 'text', label: 'Locker' },
    { name: 'basement', type: 'select', label: 'Basement', options: ['None', 'Unfinished', 'Finished', 'Walkout'] },
  ];

  const financialFields = [
    { name: 'asking_price', type: 'number', label: 'Asking Price ($)', min: '0' },
    { name: 'original_price', type: 'number', label: 'Original Price ($)', min: '0' },
    { name: 'commission', type: 'number', label: 'Commission (%)', step: '0.1', min: '0', max: '100' },
    { name: 'deposit_paid', type: 'number', label: 'Deposit Paid ($)', min: '0' },
    { name: 'occupancy', type: 'date', label: 'Occupancy Date' },
  ];

  const additionalFields = [
    { name: 'remark', type: 'textarea', label: 'Remarks' },
  ];

  // Current step in the form
  let currentStep = 1;
  const totalSteps = 6;

  // Step navigation
  function nextStep() {
    if (currentStep < totalSteps) {
      currentStep++;
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  function goToStep(step: number) {
    currentStep = step;
  }

  // Form validation for current step
  function validateCurrentStep(): boolean {
    switch (currentStep) {
      case 1:
        return !!(listing.listing_type && listing.project_name && listing.address);
      case 2:
        return true; // Property details are optional
      case 3:
        return true; // Amenities are optional
      case 4:
        return true; // Financial details are optional
      case 5:
        return true; // Images are optional
      case 6:
        return true; // Additional information is optional
      default:
        return true;
    }
  }

  // Step titles
  const stepTitles = [
    'Basic Information',
    'Property Details',
    'Amenities & Features',
    'Financial Information',
    'Images',
    'Additional Information'
  ];

  // Helper function to convert options array to Select component format
  function formatSelectOptions(options: string[]) {
    return [
      { value: '', label: 'Select an option' },
      ...options.map(option => ({ value: option, label: option }))
    ];
  }
</script>

<div class="bg-white shadow rounded-xl max-w-4xl mx-auto max-h-[90vh] overflow-hidden flex flex-col">
  <!-- Header -->
  <div class="bg-primary px-8 py-6 text-white">
    <h2 class="text-2xl font-bold">
      {listing.id ? 'Edit Listing' : 'Create New Listing'}
    </h2>
    <p class="text-blue-100 mt-1">
      {listing.id ? 'Update your property listing details' : 'Add a new property to your portfolio'}
    </p>
  </div>

  <!-- Progress Bar -->
  <div class="px-8 py-4 bg-gray-50 border-b">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
      <span class="text-sm text-gray-500">{stepTitles[currentStep - 1]}</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div 
        class="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
        style="width: {(currentStep / totalSteps) * 100}%"
      ></div>
    </div>
    
    <!-- Step indicators -->
    <div class="flex justify-between mt-4">
      {#each stepTitles as title, index}
        <button
          type="button"
          on:click={() => goToStep(index + 1)}
          class="flex flex-col items-center group cursor-pointer"
        >
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 {
            currentStep > index + 1 
              ? 'bg-green-500 text-white' 
              : currentStep === index + 1 
                ? 'bg-primary text-white' 
                : 'bg-gray-300 text-gray-600 group-hover:bg-gray-400'
          }">
            {currentStep > index + 1 ? '✓' : index + 1}
          </div>
          <span class="text-xs mt-1 text-gray-600 text-center max-w-20 leading-tight hidden sm:block">
            {title}
          </span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Form Content -->
  <form on:submit|preventDefault={handleSubmit} class="flex-1 flex flex-col">
    <div class="flex-1 overflow-y-auto px-8 py-6">
      
      <!-- Step 1: Basic Information -->
      {#if currentStep === 1}
        <div class="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div class="text-center mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Basic Information</h3>
            <p class="text-gray-600">Let's start with the essential details about your property</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each basicInfoFields as field}
              {#if field.type === 'select'}
                <Select
                  id={field.name}
                  label={field.label + (field.required ? ' *' : '')}
                  bind:value={listing[field.name]}
                  options={formatSelectOptions(field.options)}
                  required={field.required}
                />
              {:else}
                <Input 
                  id={field.name}
                  bind:value={listing[field.name]}
                  type={field.type}
                  label={field.label + (field.required ? ' *' : '')}
                  required={field.required}
                  placeholder="Enter {field.label.toLowerCase()}"
                />
              {/if}
            {/each}
          </div>
        </div>
      {/if}

      <!-- Step 2: Property Details -->
      {#if currentStep === 2}
        <div class="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div class="text-center mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Property Details</h3>
            <p class="text-gray-600">Provide specific details about the property features</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each propertyDetailsFields as field}
              {#if field.type === 'select'}
                <div>
                  <Select
                    id={field.name}
                    label={field.label}
                    bind:value={listing[field.name]}
                    options={formatSelectOptions(field.options)}
                  />
                </div>
              {:else}
                <Input 
                  id={field.name}
                  bind:value={listing[field.name]}
                  type={field.type}
                  label={field.label}
                  min={field.min}
                  step={field.step}
                  placeholder="Enter {field.label.toLowerCase()}"
                />
              {/if}
            {/each}
          </div>
        </div>
      {/if}

      <!-- Step 3: Amenities & Features -->
      {#if currentStep === 3}
        <div class="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div class="text-center mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Amenities & Features</h3>
            <p class="text-gray-600">Add information about parking, storage, and other features</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each amenitiesFields as field}
              {#if field.type === 'select'}
                <div>
                  <Select
                    id={field.name}
                    label={field.label}
                    bind:value={listing[field.name]}
                    options={formatSelectOptions(field.options)}
                  />
                </div>
              {:else}
                <Input 
                  id={field.name}
                  bind:value={listing[field.name]}
                  type={field.type}
                  label={field.label}
                  placeholder="Enter {field.label.toLowerCase()}"
                />
              {/if}
            {/each}
          </div>
        </div>
      {/if}

      <!-- Step 4: Financial Information -->
      {#if currentStep === 4}
        <div class="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div class="text-center mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Financial Information</h3>
            <p class="text-gray-600">Set pricing and financial details for the listing</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each financialFields as field}
              <Input 
                id={field.name}
                bind:value={listing[field.name]}
                type={field.type}
                label={field.label}
                min={field.min}
                max={field.max}
                step={field.step}
                placeholder={field.type === 'number' ? '0' : ''}
              />
            {/each}
          </div>

          <!-- Sold Status -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_sold"
                bind:checked={listing.is_sold}
                class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="is_sold" class="text-sm font-medium text-gray-700">
                Mark as Sold
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-1">Check this box if the property has been sold</p>
          </div>
        </div>
      {/if}

      <!-- Step 5: Images -->
      {#if currentStep === 5}
        <div class="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div class="text-center mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Images</h3>
            <p class="text-gray-600">Upload photos</p>
          </div>
          
          <!-- Image Upload -->
          <div class="space-y-4">
            <ImageUpload 
              images={imageUrls} 
              on:update={handleImageUpdate}
              maxImages={30}
            />
          </div>
        </div>
      {/if}

      <!-- Step 6: Additional Information -->
      {#if currentStep === 6}
        <div class="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div class="text-center mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Additional Information</h3>
            <p class="text-gray-600">Add any additional remarks or notes</p>
          </div>
          
          <div class="space-y-4">
            {#each additionalFields as field}
              {#if field.type === 'textarea'}
                <Textarea
                  id={field.name}
                  bind:value={listing[field.name]}
                  label={field.label}
                  placeholder="Enter {field.label.toLowerCase()}"
                  rows={4}
                />
              {/if}
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Form Actions -->
    <div class="border-t bg-gray-50 px-8 py-6">
      <div class="flex justify-between items-center">
        <div class="flex space-x-3">
          <Button 
            type="button" 
            variant="secondary" 
            onclick={onCancel}
            class_name="px-6"
          >
            Cancel
          </Button>
          
          {#if currentStep > 1}
            <Button 
              type="button" 
              variant="secondary" 
              onclick={prevStep}
              class_name="px-6"
            >
              ← Previous
            </Button>
          {/if}
        </div>

        <div class="flex space-x-3">
          {#if currentStep < totalSteps}
            <Button 
              type="button" 
              onclick={nextStep}
              disabled={!validateCurrentStep()}
              class_name="px-8"
            >
              Next →
            </Button>
          {:else}
            <Button 
              type="submit"
              class_name="px-8"
            >
              {listing.id ? 'Update Listing' : 'Create Listing'}
            </Button>
          {/if}
        </div>
      </div>
    </div>
  </form>
</div>

<style>
  @keyframes slide-in-from-right {
    from {
      opacity: 0;
      transform: translateX(1rem);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .animate-in {
    animation: slide-in-from-right 0.3s ease-out;
  }

  .slide-in-from-right-4 {
    animation-name: slide-in-from-right;
  }

  .duration-300 {
    animation-duration: 0.3s;
  }
</style>