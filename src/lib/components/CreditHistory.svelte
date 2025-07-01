<script lang="ts">
    import { formatDate } from '$lib/helper';
  import { getCreditRecords } from '$lib/supabase';
  import type { CreditRecord } from '$lib/types/credit';
  import { onMount } from 'svelte';
  
  export let userId: string;
  export let showTitle: boolean = true;

  let creditRecords:CreditRecord[] = [];
  let loadingCreditRecords = false;

  async function loadCreditHistory() {
    if (!userId) return;
    
    try {
      loadingCreditRecords = true;
      const { data, error: recordsError } = await getCreditRecords(userId);
      
      if (recordsError) {
        throw recordsError;
      }
      
      creditRecords = data || [];
    } catch (err) {
      console.error('Error loading credit history:', err);
    } finally {
      loadingCreditRecords = false;
    }
  }

  onMount(() => {
    if (userId) {
      loadCreditHistory();
    }
  });

  // Watch for userId changes
  $: if (userId) {
    loadCreditHistory();
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200">
  {#if showTitle}
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Credit History</h3>
    </div>
  {/if}
  <div class="p-6">
    {#if loadingCreditRecords}
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
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each creditRecords as record}
              <tr>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(record.created_at)}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-right font-medium {record?.amount > 0 ? 'text-green-600' : 'text-red-600'}">
                  {record.amount}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {record.tp || 'N/A'}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>