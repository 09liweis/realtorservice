<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Button from "../Button.svelte";
  import Input from "../Input.svelte";
  import { OCCUPATION_STATUS_OPTIONS, PROPERTY_TYPES, STAGING_STATUS_OPTIONS } from "$lib/types/constant";
  import { EMPTY_STAGING, type Staging, calculateStagingFee } from "$lib/types/staging";
  import Select from "../Select.svelte";

  export let isEdit = false;
  export let request: Staging = { ...EMPTY_STAGING };

  const dispatch = createEventDispatcher();

  // Property type options
  const propertyTypeOptions = [...PROPERTY_TYPES];

  // Occupation status options
  const occupationStatusOptions = [...OCCUPATION_STATUS_OPTIONS];

  // Status options
  const statusOptions = [...STAGING_STATUS_OPTIONS];

  // Reactive calculation of staging fee
  $: stagingCalculation = calculateStagingFee(
    parseFloat(request.size) || 0,
    parseFloat(request.rooms) || 0,
    parseFloat(request.length) || 1,
    request.property_type || 'house'
  );

  // Update estimate_price when calculation changes
  $: {
    request.estimate_price = stagingCalculation.totalCost;
  }

  // Handle form submission
  function handleSubmit() {
    // Validate form
    if (!request.location) {
      alert("Property location is required");
      return;
    }

    // Ensure estimate_price is set
    request.estimate_price = stagingCalculation.totalCost;

    // Submit form
    dispatch("submit", { ...request });
  }

  // Handle cancel
  function handleCancel() {
    dispatch("cancel");
  }

  // Format currency
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
</script>

<div class="bg-white shadow rounded-lg p-6 max-w-4xl mx-auto">
  <h2 class="text-lg font-medium text-gray-900 mb-6">
    {isEdit ? "Edit Staging Request" : "New Staging Request"}
  </h2>

  <form onsubmit={handleSubmit} class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column - Form Fields -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Property Location -->
        <div>
          <Input
            id="location"
            label="Property Location*"
            type="text"
            bind:value={request.location}
            required={true}
            placeholder="Address, City, Postal Code"
          />
        </div>

        <!-- Property Type and Size -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Select
              id="property_type"
              label="Property Type"
              bind:value={request.property_type}
              options={propertyTypeOptions.map(type => ({ value: type.toLowerCase(), label: type }))}
            />
          </div>

          <div>
            <Input
              id="size"
              label="Size (sq ft)*"
              type="number"
              bind:value={request.size}
              min="0"
              step="1"
              placeholder="Property square footage"
              helpText="Required for accurate pricing calculation"
            />
          </div>
        </div>

        <!-- Occupation Status and Rooms -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Select
              id="occupation_status"
              label="Occupation Status"
              bind:value={request.occupation_status}
              options={occupationStatusOptions.map(status => ({ value: status.toLowerCase(), label: status }))}
            />
          </div>

          <div>
            <Input
              id="rooms"
              label="Number of Rooms to Stage*"
              type="number"
              bind:value={request.rooms}
              min="1"
              step="1"
              placeholder="e.g., 5"
              helpText="Required for accurate pricing calculation"
            />
          </div>
        </div>

        <!-- Selling Price and Timeline -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              id="selling_price"
              label="Approximate Selling Price ($)"
              type="number"
              bind:value={request.selling_price}
              min="0"
              step="1000"
              placeholder="e.g., 750000"
            />
          </div>

          <div>
            <Input
              id="timeline"
              label="Desired Start Date"
              type="date"
              bind:value={request.timeline}
            />
          </div>
        </div>

        <!-- Length and Status -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              id="length"
              label="Length of Staging (months)*"
              type="number"
              bind:value={request.length}
              min="1"
              step="1"
              placeholder="e.g., 3"
              helpText="Longer terms receive discounts"
            />
          </div>

          {#if isEdit}
            <div>
              <Select
                id="status"
                label="Status"
                bind:value={request.status}
                options={statusOptions.map(status => ({ value: status.toLowerCase(), label: status }))}
              />
            </div>
          {/if}
        </div>
      </div>

      <!-- Right Column - Price Calculator -->
      <div class="lg:col-span-1">
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 sticky top-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            Staging Fee Calculator
          </h3>
          
          {#if request.size && request.rooms && request.length}
            <div class="space-y-4">
              <!-- Total Cost Display -->
              <div class="bg-white rounded-lg p-4 border border-blue-300">
                <div class="text-center">
                  <div class="text-sm text-gray-600 mb-1">Total Staging Cost</div>
                  <div class="text-3xl font-bold text-blue-600">
                    {formatCurrency(stagingCalculation.totalCost)}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    {formatCurrency(stagingCalculation.monthlyFee)}/month × {request.length} month{request.length !== '1' ? 's' : ''}
                  </div>
                </div>
              </div>

              <!-- Cost Breakdown -->
              <div class="space-y-3">
                <h4 class="text-sm font-semibold text-gray-700">Cost Breakdown:</h4>
                
                {#each stagingCalculation.breakdown as item}
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">{item.split(':')[0]}:</span>
                    <span class="font-medium">{item.split(':')[1]}</span>
                  </div>
                {/each}
                
                {#if stagingCalculation.discount > 0}
                  <div class="border-t border-blue-200 pt-2">
                    <div class="flex justify-between text-sm text-green-600">
                      <span>You save:</span>
                      <span class="font-medium">{formatCurrency(stagingCalculation.discount)}</span>
                    </div>
                  </div>
                {/if}
                
                <div class="border-t border-blue-200 pt-2">
                  <div class="flex justify-between text-base font-semibold">
                    <span>Total Cost:</span>
                    <span class="text-blue-600">{formatCurrency(stagingCalculation.totalCost)}</span>
                  </div>
                </div>
              </div>

              <!-- Additional Info -->
              <div class="bg-blue-100 rounded-lg p-3 text-xs text-blue-800">
                <div class="font-medium mb-1">📋 What's Included:</div>
                <ul class="space-y-1 text-blue-700">
                  <li>• Professional furniture & decor</li>
                  <li>• Complete setup & styling</li>
                  <li>• Monthly maintenance visits</li>
                  <li>• Full removal service</li>
                </ul>
              </div>

              {#if request.length >= 3}
                <div class="bg-green-100 rounded-lg p-3 text-xs text-green-800">
                  <div class="font-medium mb-1">🎉 Term Discount Applied!</div>
                  <div class="text-green-700">
                    You're saving {formatCurrency(stagingCalculation.discount)} with a {request.length}-month commitment.
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            <div class="text-center py-8">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <p class="text-sm text-gray-600 mb-2">Enter property details to calculate staging fees</p>
              <p class="text-xs text-gray-500">
                Fill in size, rooms, and duration for instant pricing
              </p>
            </div>
          {/if}

          <!-- Pricing Notes -->
          <div class="mt-4 pt-4 border-t border-blue-200">
            <div class="text-xs text-gray-600 space-y-1">
              <div class="font-medium text-gray-700">💡 Pricing Notes:</div>
              <div>• Based on Toronto market rates</div>
              <div>• Longer terms receive discounts</div>
              <div>• Custom packages available</div>
              <div>• All prices in CAD</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
      <Button variant="secondary" onclick={handleCancel}>Cancel</Button>
      <Button type="submit">
        {isEdit ? "Update Request" : "Submit Request"}
        {#if request.size && request.rooms && request.length}
          <span class="ml-2 text-sm opacity-75">
            ({formatCurrency(stagingCalculation.totalCost)})
          </span>
        {/if}
      </Button>
    </div>
  </form>
</div>