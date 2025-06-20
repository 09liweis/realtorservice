<script lang="ts">
    import { formatAmount } from "$lib/types/constant";
    import Link from "../Link.svelte";

  export let offers;
  export let handleClick;

  // 获取状态标签的样式
	function getStatusStyle(status) {
		switch (status) {
			case 'Pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'Under Review':
				return 'bg-blue-100 text-blue-800';
			case 'Accepted':
				return 'bg-green-100 text-green-800';
			case 'Rejected':
				return 'bg-red-100 text-red-800';
			case 'Withdrawn':
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<!-- Offers Grid -->
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {#each offers as offer (offer.id)}
    <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900 truncate">{offer.address}</h3>
          </div>
          <span
            class={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(
              offer.status
            )}`}
          >
            {offer.status}
          </span>
        </div>
        
        <div class="mt-4 space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Amount</span>
            <span class="text-sm font-medium text-gray-900">{formatAmount(offer.asking_price)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">Submitted</span>
            <span class="text-sm text-gray-900">{new Date(offer.date).toLocaleDateString()}</span>
          </div>
        </div>

        <div class="mt-6 text-right">
          <Link
            href={`/dashboard/offers/${offer.id}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  {:else}
    <div class="col-span-full text-center py-12 bg-white rounded-lg">
      <p class="text-gray-500">No offers found</p>
    </div>
  {/each}
</div>