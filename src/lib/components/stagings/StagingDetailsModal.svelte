<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import FormBackdrop from '../form/FormBackdrop.svelte';
  import type { Staging } from '$lib/types/staging';

  export let request: Staging;
  export let show = false;

  const dispatch = createEventDispatcher();

  // Close modal
  function closeModal() {
    dispatch('close');
  }

  // Edit request
  function handleEdit() {
    dispatch('edit', request);
  }

  // Format currency for Canadian dollars
  function formatCurrency(amount: number): string {
    if (!amount) return 'Quote pending';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Format amount
  function formatAmount(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Format date
  function formatDate(dateString) {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Get status badge style
  function getStatusStyle(status) {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
</script>

{#if show && request}
  <FormBackdrop handleClose={closeModal}>
    <!-- Modal content -->
    <div
      class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <!-- Header -->
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
            <div class="flex justify-between items-center">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                Staging Request Details
              </h3>
              <span
                class={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(
                  request.status
                )}`}
              >
                {request.status}
              </span>
            </div>

            <div class="mt-6 space-y-6">
              <!-- Property Information -->
              <div>
                <h4 class="text-sm font-medium text-gray-500">Property Location</h4>
                <p class="mt-1 text-sm text-gray-900">{request.location || request.property}</p>
              </div>

              <!-- Property Details -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-500">Property Type</h4>
                  <p class="mt-1 text-sm text-gray-900">{request.property_type || request.type}</p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500">Size</h4>
                  <p class="mt-1 text-sm text-gray-900">
                    {request.size ? `${request.size} sq ft` : 'Not specified'}
                  </p>
                </div>
              </div>

              <!-- Staging Details -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-500">Occupation Status</h4>
                  <p class="mt-1 text-sm text-gray-900">{request.occupation_status || 'Not specified'}</p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500">Rooms to be Staged</h4>
                  <p class="mt-1 text-sm text-gray-900">{request.rooms || 'All rooms'}</p>
                </div>
              </div>

              <!-- Financial Information -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-500">Selling Price</h4>
                  <p class="mt-1 text-sm text-gray-900">
                    {request.selling_price ? formatAmount(request.selling_price) : 'Not specified'}
                  </p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500">Staging Quote</h4>
                  <p class="mt-1 text-lg font-bold text-blue-600">
                    {formatCurrency(request.quotation_price)}
                  </p>
                </div>
              </div>

              <!-- Timeline Information -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-500">Start Date</h4>
                  <p class="mt-1 text-sm text-gray-900">
                    {request.timeline || (request.scheduledDate ? formatDate(request.scheduledDate) : 'Not specified')}
                  </p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500">Length of Staging</h4>
                  <p class="mt-1 text-sm text-gray-900">
                    {request.length ? `${request.length} month${request.length !== '1' ? 's' : ''}` : 'Not specified'}
                  </p>
                </div>
              </div>

              <!-- Contact Information -->
              <div>
                <h4 class="text-sm font-medium text-gray-500">Contact Information</h4>
                <div class="mt-1 text-sm text-gray-900">
                  <p>{request.contactPerson}</p>
                  {#if request.contactEmail}
                    <p class="mt-1">
                      <span class="text-gray-500">Email:</span>
                      <a href="mailto:{request.contactEmail}" class="text-blue-600 hover:underline">
                        {request.contactEmail}
                      </a>
                    </p>
                  {/if}
                  {#if request.contactPhone}
                    <p class="mt-1">
                      <span class="text-gray-500">Phone:</span>
                      <a href="tel:{request.contactPhone}" class="text-blue-600 hover:underline">
                        {request.contactPhone}
                      </a>
                    </p>
                  {/if}
                </div>
              </div>

              <!-- Pricing Breakdown -->
              {#if request.quotation_price}
                <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 class="text-sm font-medium text-blue-900 mb-2">💰 Staging Investment</h4>
                  <div class="text-2xl font-bold text-blue-600 mb-2">
                    {formatCurrency(request.quotation_price)}
                  </div>
                  <div class="text-xs text-blue-700 space-y-1">
                    <div>✓ Professional furniture & decor</div>
                    <div>✓ Complete setup & styling</div>
                    <div>✓ Monthly maintenance visits</div>
                    <div>✓ Full removal service included</div>
                  </div>
                </div>
              {/if}

              <!-- Notes -->
              {#if request.notes}
                <div>
                  <h4 class="text-sm font-medium text-gray-500">Notes</h4>
                  <p class="mt-1 text-sm text-gray-900 whitespace-pre-line">{request.notes}</p>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          onclick={handleEdit}
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Edit Request
        </button>
        <button
          type="button"
          onclick={closeModal}
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </FormBackdrop>
{/if}