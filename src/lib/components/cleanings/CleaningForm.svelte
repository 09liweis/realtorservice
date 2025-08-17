<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Button from "../common/Button.svelte";
  import Input from '$lib/components/common/Input.svelte';
  import { formatAmount, PROPERTY_TYPES } from "$lib/types/constant";
  import { EMPTY_CLEANING, type Cleaning, calculateCleaningPrice, CLEANING_TYPES, CLEANING_FREQUENCIES } from "$lib/types/cleaning";
  import Select from '$lib/components/common/Select.svelte';
  import Textarea from '$lib/components/common/Textarea.svelte';
  import { user } from "$lib/stores/auth";
    import { getDraftService, saveDraftService } from "../../../types/service.types";
    import { goto } from "$app/navigation";

  export let isEdit = false;
  export let request: Cleaning = { ...EMPTY_CLEANING, duration: 1 };

  const dispatch = createEventDispatcher();

  onMount(()=>{
    if (!request.id) {
      request = getDraftService('cleaning');
    }
  });

  // Property type options
  const propertyTypeOptions = PROPERTY_TYPES.map(type => ({ value: type.toLowerCase(), label: type }));

  // Cleaning type options
  const cleaningTypeOptions = [...CLEANING_TYPES];

  // Frequency options
  const frequencyOptions = [...CLEANING_FREQUENCIES];

  // Reactive calculation of cleaning fee
  $: cleaningCalculation = calculateCleaningPrice(
    parseFloat(request.rooms) || 0,
    parseFloat(request.bathrooms) || 0,
    request.cleaning_type || 'regular_cleaning',
    request.property_type || 'house',
    request.frequency || 'one_time',
    parseFloat(request.size) || 0
  );

  const durationMap = {
  'weekly': 4,      // 1 month = 4 weeks
  'bi_weekly': 2,   // 1 month = 2 bi-weeks
  'monthly': 1     // 1 month = 1 service
};

$: totalPrice = request.frequency !== 'one_time' 
  ? cleaningCalculation.totalPrice * (parseInt(request.duration) || 1) * durationMap[request.frequency]
  : cleaningCalculation.totalPrice;

  // Update estimate_price when calculation changes
  $: {
    setTimeout(() => {
      // request.estimate_price = cleaningCalculation.totalPrice;
      saveDraftService('cleaning', request);
    }, 0);
  }

  // Handle form submission
  function handleSubmit(event: Event) {
    event.preventDefault();
    // Validate form
    if (!request.location) {
      alert("Property location is required");
      return;
    }

    if (!$user) {
      goto('/login?redirect=/dashboard/cleanings');
      return;
    }

    request = {...EMPTY_CLEANING, ...request};

    // Ensure estimate_price is set
    request.estimate_price = cleaningCalculation.totalPrice;
    if (!request.id) {
      request.history?.push({status:'submitted', date: new Date()});
    }

    // Submit form
    dispatch("submit", { ...request });
  }

  // Handle cancel
  function handleCancel() {
    dispatch("cancel");
  }

</script>

<div class="bg-white shadow rounded-lg p-6 max-w-4xl mx-auto">
  <h2 class="text-lg font-medium text-gray-900 mb-6">
    {isEdit ? "Edit Cleaning Request" : "New Cleaning Request"}
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
            disabled={$user?.isAdmin}
          />
        </div>

        <!-- Property Type and Size -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Select
              id="property_type"
              label="Property Type"
              bind:value={request.property_type}
              options={propertyTypeOptions}
              disabled={$user?.isAdmin}
            />
          </div>

          <div>
            <Input
              id="size"
              label="Size (sq ft)"
              type="number"
              bind:value={request.size}
              min={1}
              placeholder="Property square footage"
              disabled={$user?.isAdmin}
            />
          </div>
        </div>

        <!-- Rooms and Bathrooms -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              id="rooms"
              label="Number of Rooms*"
              type="number"
              bind:value={request.rooms}
              min={1}
              placeholder="e.g., 5"
              helpText="Total number of rooms to clean"
              disabled={$user?.isAdmin}
            />
          </div>

          <div>
            <Input
              id="bathrooms"
              label="Number of Bathrooms*"
              type="number"
              bind:value={request.bathrooms}
              min={1}
              step="1"
              placeholder="e.g., 2"
              helpText="Number of bathrooms to clean"
              disabled={$user?.isAdmin}
            />
          </div>
        </div>

        <!-- Cleaning Type and Frequency -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Select
              id="cleaning_type"
              label="Cleaning Type*"
              bind:value={request.cleaning_type}
              options={cleaningTypeOptions}
              disabled={$user?.isAdmin}
            />
          </div>

          <div>
            <Select
              id="frequency"
              label="Frequency"
              bind:value={request.frequency}
              options={frequencyOptions}
              disabled={$user?.isAdmin}
            />
          </div>
        </div>

        <!-- Duration Input (only shown if frequency is not one-time) -->
        {#if request.frequency !== 'one_time'}
          <div>
            <Input
              id="duration"
              label="Duration (Months)*"
              type="number"
              bind:value={request.duration}
              min={1}
              placeholder="e.g., 3"
              helpText="Number of months for recurring service"
              disabled={$user?.isAdmin}
            />
          </div>
        {/if}

        <!-- Scheduled Date -->
        <div>
          <Input
            id="scheduled_date"
            label="Preferred Date"
            type="date"
            bind:value={request.scheduled_date}
            disabled={$user?.isAdmin}
          />
        </div>

        <!-- Special Requests -->
        <Textarea
          id="notes"
          label="Special Requests"
          bind:value={request.notes}
          rows={4}
          placeholder="Any specific cleaning requirements, areas of focus, or special instructions..."
          disabled={$user?.isAdmin}
        />
        
        <!-- Admin Only Fields -->
        {#if $user?.isAdmin}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                id="quotation_price"
                label="Admin Quotation Price ($)"
                type="number"
                bind:value={request.quotation_price}
                placeholder="e.g., 250"
                helpText="Final price quoted to client"
              />
            </div>
            <div>
              <Select
                id="status"
                label="Status"
                bind:value={request.status}
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'submitted', label: 'Submitted' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'scheduled', label: 'Scheduled' },
                  { value: 'completed', label: 'Completed' }
                ]}
              />
            </div>
          </div>
        {/if}
      </div>

      <!-- Right Column - Price Calculator -->
      <div class="lg:col-span-1">
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 sticky top-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            Cleaning Price Calculator
          </h3>
          
          {#if request.rooms && request.bathrooms}
            <div class="space-y-4">
              <!-- Total Cost Display -->
              <div class="bg-white rounded-lg p-4 border border-green-300">
                <div class="text-center">
                  <div class="text-sm text-gray-600 mb-1">Estimated Total Cost</div>
                  <div class="text-3xl font-bold text-green-600">
                    {formatAmount(totalPrice)}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    {CLEANING_TYPES.find(t => t.value === request.cleaning_type)?.label || 'Regular Cleaning'}
                    {#if request.frequency !== 'one_time'}
                      • {CLEANING_FREQUENCIES.find(f => f.value === request.frequency)?.label}
                    {/if}
                  </div>
                </div>
              </div>

              <!-- Cost Breakdown -->
              <div class="space-y-3">
                <h4 class="text-sm font-semibold text-gray-700">Cost Breakdown:</h4>
                
                {#each cleaningCalculation.breakdown as item}
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">{item.split(':')[0]}:</span>
                    <span class="font-medium">{item.split(':')[1]}</span>
                  </div>
                {/each}
                
                <div class="border-t border-green-200 pt-2">
                  <div class="flex justify-between text-base font-semibold">
                    <span>Total Cost:</span>
                    <span class="text-green-600">{formatAmount(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <!-- Service Info -->
              <div class="bg-green-100 rounded-lg p-3 text-xs text-green-800">
                <div class="font-medium mb-1">🧽 What's Included:</div>
                <ul class="space-y-1 text-green-700">
                  <li>• Professional cleaning supplies</li>
                  <li>• Experienced cleaning team</li>
                  <li>• Quality assurance check</li>
                  <li>• Satisfaction guarantee</li>
                </ul>
              </div>

              {#if cleaningCalculation.frequencyDiscount > 0}
                <div class="bg-blue-100 rounded-lg p-3 text-xs text-blue-800">
                  <div class="font-medium mb-1">💰 Frequency Savings!</div>
                  <div class="text-blue-700">
                    You're saving {formatAmount(cleaningCalculation.frequencyDiscount)} with {CLEANING_FREQUENCIES.find(f => f.value === request.frequency)?.label} service.
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            <div class="text-center py-8">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <p class="text-sm text-gray-600 mb-2">Enter property details to calculate cleaning cost</p>
              <p class="text-xs text-gray-500">
                Fill in rooms and bathrooms for instant pricing
              </p>
            </div>
          {/if}

          <!-- Pricing Notes -->
          <div class="mt-4 pt-4 border-t border-green-200">
            <div class="text-xs text-gray-600 space-y-1">
              <div class="font-medium text-gray-700">💡 Pricing Notes:</div>
              <div>• Based on industry standards</div>
              <div>• Recurring service discounts available</div>
              <div>• Custom quotes for special requests</div>
              <div>• All prices in CAD</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    {#if $user}
    <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
      <Button variant="secondary" onclick={handleCancel}>Cancel</Button>
      <Button type="submit">
        {isEdit ? "Update Request" : "Submit Request"}
        {#if request.rooms && request.bathrooms}
          <span class="ml-2 text-sm opacity-75">
            ({formatAmount(totalPrice)})
          </span>
        {/if}
      </Button>
    </div>
    {:else}
    <Button type="submit">
      Login to Submit Request
    </Button>
    {/if}
  </form>
</div>