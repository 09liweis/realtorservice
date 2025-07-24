<script lang="ts">
    import { formatAmount } from "$lib/types/constant";
    import { fade, fly, slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import {flip} from "svelte/animate";
    import type { Offer } from "$lib/types/offer";

  export let isLoading;
  export let offers:Offer[];
  export let handleEdit;
  export let handleDelete;

  // 排序状态
  let sortField = 'buyer';
  let sortDirection = 'asc';

  // 排序函数
  function sortOffers(field) {
    if (sortField === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDirection = 'asc';
    }

    offers = offers.sort((a, b) => {
      let comparison = 0;
      
      switch (field) {
        case 'buyer':
          comparison = a.buyer.localeCompare(b.buyer);
          break;
        case 'agent':
          comparison = (a.agent || '').localeCompare(b.agent || '');
          break;
        case 'price':
          comparison = parseFloat(a.price || 0) - parseFloat(b.price || 0);
          break;
        case 'deposit':
          comparison = parseFloat(a.deposit || 0) - parseFloat(b.deposit || 0);
          break;
        case 'completion_date':
          comparison = (a.completion_date || '').localeCompare(b.completion_date || '');
          break;
        case 'title_search':
          comparison = (a.title_search || '').localeCompare(b.title_search || '');
          break;
        case 'schedule_a_conditions':
          comparison = (a.schedule_a_conditions || '').localeCompare(b.schedule_a_conditions || '');
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
    offers = [...offers]; // 触发 Svelte 响应式更新
  }

  // 获取排序图标样式
  function getSortIcon(field) {
    // 不再使用文本图标，改为在模板中使用SVG图标
    return sortField === field;
  }
</script>

{#if isLoading}
  <div class="flex justify-center p-12" in:fade={{ duration: 200 }}>
    <div class="relative">
      <div class="animate-spin rounded-full h-12 w-12 border-2 border-gray-200"></div>
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 absolute top-0 left-0" style="animation-duration: 1s;"></div>
      <div class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <div class="h-2 w-2 bg-blue-600 rounded-full"></div>
      </div>
    </div>
  </div>
{:else}
  <div class="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-lg">
    {#if offers.length === 0}
      <div 
        class="p-12 text-center bg-gray-50 rounded-xl"
        in:fade={{ duration: 300, delay: 150 }}
      >
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-600 text-lg">No offers have been submitted yet.</p>
        <p class="text-gray-400 mt-2">Offers will appear here once they are submitted.</p>
      </div>
    {:else}
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
          <tr>
            <th 
              class="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer group transition-all duration-200 hover:bg-gray-100 border-b-2 border-transparent hover:border-blue-500"
              on:click={() => sortOffers('buyer')}
            >
              <div class="flex items-center space-x-1">
                <span>Buyer & Agent</span>
                <span class="transition-opacity {getSortIcon('buyer') ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}">
                  <svg class="w-4 h-4 transition-transform {sortDirection === 'asc' ? 'transform rotate-0' : 'transform rotate-180'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                </span>
              </div>
            </th>
            <th 
              class="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer group transition-all duration-200 hover:bg-gray-100 border-b-2 border-transparent hover:border-blue-500"
              on:click={() => sortOffers('price')}
            >
              <div class="flex items-center space-x-1">
                <span>Price</span>
                <span class="transition-opacity {getSortIcon('price') ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}">
                  <svg class="w-4 h-4 transition-transform {sortDirection === 'asc' ? 'transform rotate-0' : 'transform rotate-180'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                </span>
              </div>
            </th>
            <th 
              class="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer group transition-all duration-200 hover:bg-gray-100 border-b-2 border-transparent hover:border-blue-500"
              on:click={() => sortOffers('deposit')}
            >
              <div class="flex items-center space-x-1">
                <span>Deposit</span>
                <span class="transition-opacity {getSortIcon('deposit') ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}">
                  <svg class="w-4 h-4 transition-transform {sortDirection === 'asc' ? 'transform rotate-0' : 'transform rotate-180'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                </span>
              </div>
            </th>
            <th 
              class="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer group transition-all duration-200 hover:bg-gray-100 border-b-2 border-transparent hover:border-blue-500"
              on:click={() => sortOffers('completion_date')}
            >
              <div class="flex items-center space-x-1">
                <span>Completion Date</span>
                <span class="transition-opacity {getSortIcon('completion_date') ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}">
                  <svg class="w-4 h-4 transition-transform {sortDirection === 'asc' ? 'transform rotate-0' : 'transform rotate-180'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                </span>
              </div>
            </th>
            <th 
              class="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer group transition-all duration-200 hover:bg-gray-100 border-b-2 border-transparent hover:border-blue-500"
              on:click={() => sortOffers('schedule_a_conditions')}
            >
              <div class="flex items-center space-x-1">
                <span>Conditions</span>
                <span class="transition-opacity {getSortIcon('schedule_a_conditions') ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}">
                  <svg class="w-4 h-4 transition-transform {sortDirection === 'asc' ? 'transform rotate-0' : 'transform rotate-180'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                </span>
              </div>
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each offers as offer (offer.id)}
            <tr 
              in:fly={{ y: 20, duration: 300, delay: 50 }}
              out:fade={{ duration: 200 }}
              animate:flip={{ duration: 300, easing: quintOut }}
              class="hover:bg-blue-50/50 transition-all duration-200 ease-in-out"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{offer.buyer}</div>
                <div class="text-xs text-gray-500">{offer.email || 'No email'}</div>
                <div class="text-sm text-gray-900 mt-1">{offer.agent || 'N/A'}</div>
                <div class="text-xs text-gray-500">{offer.phone || 'No phone'}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-blue-600">{formatAmount(offer.price)}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{formatAmount(offer.deposit)}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="text-sm text-gray-900">{offer.completion_date || 'Not set'}</div>
                {#if offer.title_search}
                  <div class="text-xs text-gray-500">Title: {offer.title_search}</div>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {#if offer.schedule_a_conditions}
                  <div class="text-sm text-gray-900">Conditions: {offer.schedule_a_conditions}</div>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    on:click={() => handleEdit(offer)}
                    class="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 rounded-md transition-all duration-200 border border-blue-200 hover:border-blue-600 shadow-sm hover:shadow flex items-center"
                  >
                    <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    on:click={() => handleDelete(offer)}
                    class="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 rounded-md transition-all duration-200 border border-red-200 hover:border-red-600 shadow-sm hover:shadow flex items-center"
                  >
                    <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
{/if}

<style>
  /* 确保表格在小屏幕上可以水平滚动 */
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
</style>