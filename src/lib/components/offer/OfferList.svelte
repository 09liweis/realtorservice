<script lang="ts">
  export let isLoading;
  export let offers;
  export let handleEdit;
  export let handleDelete;

  // 格式化金额
  function formatAmount(amount) {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }
</script>
{#if isLoading}
  <div class="flex justify-center p-8">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
{:else}
  <div class="grid gap-6">
  {#if offers.length === 0}
    <div class="p-8 text-center bg-gray-50 rounded-lg">
      <p class="text-gray-600">No offers have been submitted yet.</p>
    </div>
  {:else}
    {#each offers as offer}
      <article class="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <h3 class="text-lg font-medium text-gray-900">{offer.buyer}</h3>
            <p class="text-sm text-gray-500">Agent: {offer.agent || 'N/A'}</p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-blue-600">{formatAmount(offer.price)}</div>
            <p class="text-sm text-gray-500">Deposit: {formatAmount(offer.deposit)}</p>
          </div>
        </div>
        
        <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-500">Contact:</span>
            <div class="mt-1 space-y-1">
              <p class="text-gray-700">{offer.phone || 'No phone provided'}</p>
              <p class="text-gray-700">{offer.email || 'No email provided'}</p>
            </div>
          </div>
          <div>
            <span class="text-gray-500">Important Dates:</span>
            <div class="mt-1 space-y-1">
              <p class="text-gray-700">Completion: {offer.completion_date || 'Not set'}</p>
              <p class="text-gray-700">Title Search: {offer.title_search || 'Not set'}</p>
            </div>
          </div>
        </div>

        {#if offer.schedule_a_conditions}
          <div class="mt-4">
            <span class="text-gray-500">Conditions:</span>
            <p class="mt-1 text-sm text-gray-700">{offer.schedule_a_conditions}</p>
          </div>
        {/if}

        <div class="mt-4 flex justify-end space-x-3">
          <button
            on:click={() => handleEdit(offer)}
            class="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          >
            Edit
          </button>
          <button
            on:click={() => handleDelete(offer)}
            class="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </article>
    {/each}
  {/if}
</div>
{/if}