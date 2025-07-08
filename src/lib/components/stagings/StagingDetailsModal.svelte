<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import FormBackdrop from '../form/FormBackdrop.svelte';
  import type { Staging } from '$lib/types/staging';
    import { formatAmount, getStatusStyle, type StagingCleaningStatus } from '$lib/types/constant';
    import { formatDate } from '$lib/helper';

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
                <p class="mt-1 text-sm text-gray-900">{request.location}</p>
              </div>

              <!-- Property Details -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-500">Property Type</h4>
                  <p class="mt-1 text-sm text-gray-900">{request.property_type}</p>
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
                    {formatAmount(request.estimate_price)}
                  </p>
                </div>
              </div>

              <!-- Timeline Information -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-500">Start Date</h4>
                  <p class="mt-1 text-sm text-gray-900">
                    {request.timeline || (request.timeline ? formatDate(request.timeline) : 'Not specified')}
                  </p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500">Length of Staging</h4>
                  <p class="mt-1 text-sm text-gray-900">
                    {request.length ? `${request.length} month${request.length !== '1' ? 's' : ''}` : 'Not specified'}
                  </p>
                </div>
              </div>

              <!-- Pricing Breakdown -->
              {#if request.estimate_price}
                <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 class="text-sm font-medium text-blue-900 mb-2">💰 Staging Investment</h4>
                  <div class="text-2xl font-bold text-blue-600 mb-2">
                    {formatAmount(request.estimate_price)}
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
          onclick={closeModal}
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </FormBackdrop>
{/if}