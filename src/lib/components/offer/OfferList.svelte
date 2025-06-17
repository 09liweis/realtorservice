<script lang="ts">
  export let isLoading;
  export let offers;
  export let handleEdit;
  export let handleDelete;

  // 排序状态
  let sortField = 'buyer';
  let sortDirection = 'asc';

  // 格式化金额
  function formatAmount(amount) {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

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
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
    offers = [...offers]; // 触发 Svelte 响应式更新
  }

  // 获取排序图标样式
  function getSortIcon(field) {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  }
</script>

{#if isLoading}
  <div class="flex justify-center p-8">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
{:else}
  <div class="overflow-x-auto bg-white shadow rounded-lg">
    {#if offers.length === 0}
      <div class="p-8 text-center bg-gray-50">
        <p class="text-gray-600">No offers have been submitted yet.</p>
      </div>
    {:else}
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onclick={() => sortOffers('buyer')}
            >
              Buyer {getSortIcon('buyer')}
            </th>
            <th 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onclick={() => sortOffers('agent')}
            >
              Agent {getSortIcon('agent')}
            </th>
            <th 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onclick={() => sortOffers('price')}
            >
              Price {getSortIcon('price')}
            </th>
            <th 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onclick={() => sortOffers('deposit')}
            >
              Deposit {getSortIcon('deposit')}
            </th>
            <th 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onclick={() => sortOffers('completion_date')}
            >
              Completion Date {getSortIcon('completion_date')}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each offers as offer (offer.id)}
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{offer.buyer}</div>
                <div class="text-xs text-gray-500">{offer.email || 'No email'}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{offer.agent || 'N/A'}</div>
                <div class="text-xs text-gray-500">{offer.phone || 'No phone'}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-blue-600">{formatAmount(offer.price)}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{formatAmount(offer.deposit)}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{offer.completion_date || 'Not set'}</div>
                {#if offer.title_search}
                  <div class="text-xs text-gray-500">Title: {offer.title_search}</div>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onclick={() => handleEdit(offer)}
                  class="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors mr-2"
                >
                  Edit
                </button>
                <button
                  onclick={() => handleDelete(offer)}
                  class="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  Delete
                </button>
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