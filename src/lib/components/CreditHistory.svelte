<script lang="ts">
    import { formatDate } from '$lib/helper';
  import type { CreditRecord } from '$lib/types/credit';
  
  export let showTitle: boolean = true;

  export let creditRecords:CreditRecord[] = [];
  export let loadingCredits = false;
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200">
  {#if showTitle}
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Credit History</h3>
    </div>
  {/if}
  <div class="p-6 max-h-[600px] overflow-y-auto">
    {#if loadingCredits}
      <div class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    {:else if creditRecords.length === 0}
      <div class="text-center py-6 text-gray-500">
        <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p>No credit history found</p>
      </div>
    {:else}
      <div class="space-y-3">
        {#each creditRecords as record}
          <div class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-900 capitalize">{record.tp || 'N/A'}</p>
                <p class="text-xs text-gray-500">{formatDate(record?.created_at)}</p>
                {#if record.notes}
                  <p class="text-xs mt-1 text-blue-600">{record.notes}</p>
                {/if}
              </div>
              <span class="text-sm font-medium {record?.amount > 0 ? 'text-green-600' : 'text-red-600'}">
                {record.amount > 0 ? '+' : ''}{record.amount}
              </span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>