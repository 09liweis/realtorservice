<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
  import { quintOut, elasticOut } from 'svelte/easing';
  import { flip } from 'svelte/animate';

  export let guests: any[] = [];
  export let handleDelete: (id: string, name: string) => void;

  // Format phone number for display
  function formatPhone(phone: string): string {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  // Get status badge color
  function getStatusColor(buyLease: string): string {
    switch (buyLease?.toLowerCase()) {
      case 'buy':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'lease':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }
</script>

<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
  {#if guests.length === 0}
    <!-- Empty State -->
    <div 
      class="text-center py-16 px-8"
      in:fade={{ duration: 400, delay: 200 }}
    >
      <div 
        class="mx-auto h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6"
        in:scale={{ duration: 600, delay: 400, easing: elasticOut, start: 0.5 }}
      >
        <svg class="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      </div>
      <h3 
        class="text-xl font-semibold text-gray-900 mb-3"
        in:fly={{ y: 20, duration: 400, delay: 600 }}
      >
        No guests yet
      </h3>
      <p 
        class="text-gray-500 max-w-sm mx-auto leading-relaxed"
        in:fly={{ y: 20, duration: 400, delay: 700 }}
      >
        Guest information will appear here once visitors sign in to the open house.
      </p>
    </div>
  {:else}
    <!-- Header -->
    <div 
      class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200"
      in:fly={{ y: -20, duration: 400, delay: 100 }}
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-semibold text-gray-900 mb-1">
            Open House Guests
          </h3>
          <p class="text-sm text-gray-600">
            Welcome visitors and potential buyers
          </p>
        </div>
        <div 
          class="flex items-center space-x-3"
          in:scale={{ duration: 400, delay: 300, easing: elasticOut }}
        >
          <div class="text-right">
            <div class="text-2xl font-bold text-gray-900">{guests.length}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wide">
              {guests.length === 1 ? 'Guest' : 'Guests'}
            </div>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Guest Table -->
    <div class="p-8 overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each guests as guest, index (guest.id || index)}
            <tr 
              class="hover:bg-gray-50 transition-colors duration-200"
              in:fly={{ y: 30, duration: 400, delay: 200 + index * 100, easing: quintOut }}
              out:fade={{ duration: 200 }}
              animate:flip={{ duration: 400, easing: quintOut }}
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{guest.name || 'Unknown Guest'}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {#if guest.email}
                  <a href="mailto:{guest.email}" class="text-sm text-blue-600 hover:text-blue-800">{guest.email}</a>
                {:else}
                  <span class="text-sm text-gray-400 italic">N/A</span>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {#if guest.phone}
                  <a href="tel:{guest.phone}" class="text-sm text-green-600 hover:text-green-800">{formatPhone(guest.phone)}</a>
                {:else}
                  <span class="text-sm text-gray-400 italic">N/A</span>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {#if guest.buy_lease}
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border {getStatusColor(guest.buy_lease)}">
                    {guest.buy_lease}
                  </span>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {#if guest.has_agent}
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                    {guest.has_agent}
                  </span>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  type="button"
                  on:click={() => handleDelete(guest.id, guest.name)}
                  class="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Summary Footer -->
    <div 
      class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200"
      in:fly={{ y: 20, duration: 400, delay: 400 + guests.length * 100 }}
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Buyers -->
        <div class="text-center">
          <div class="flex items-center justify-center space-x-2 mb-2">
            <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span class="text-sm font-medium text-gray-700">Looking to Buy</span>
          </div>
          <div class="text-2xl font-bold text-emerald-600">
            {guests.filter(g => g.buy_lease?.toLowerCase() === 'buy').length}
          </div>
        </div>

        <!-- Leasers -->
        <div class="text-center">
          <div class="flex items-center justify-center space-x-2 mb-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span class="text-sm font-medium text-gray-700">Looking to Lease</span>
          </div>
          <div class="text-2xl font-bold text-blue-600">
            {guests.filter(g => g.buy_lease?.toLowerCase() === 'lease').length}
          </div>
        </div>

        <!-- Without Agents -->
        <div class="text-center">
          <div class="flex items-center justify-center space-x-2 mb-2">
            <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span class="text-sm font-medium text-gray-700">Without Agents</span>
          </div>
          <div class="text-2xl font-bold text-purple-600">
            {guests.filter(g => g.has_agent?.toLowerCase() === 'no' || g.has_agent?.toLowerCase() === 'false').length}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Custom animations */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
  }

  .group:hover .animate-float {
    animation: float 2s ease-in-out infinite;
  }

  /* Smooth transitions for all interactive elements */
  * {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }

  /* Custom scrollbar */
  :global(::-webkit-scrollbar) {
    width: 6px;
    height: 6px;
  }

  :global(::-webkit-scrollbar-track) {
    background: #f1f5f9;
    border-radius: 3px;
  }

  :global(::-webkit-scrollbar-thumb) {
    background: #cbd5e1;
    border-radius: 3px;
  }

  :global(::-webkit-scrollbar-thumb:hover) {
    background: #94a3b8;
  }
</style>