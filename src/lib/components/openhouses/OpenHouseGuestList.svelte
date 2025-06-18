<script lang="ts">
  export let guests: any[] = [];

  // Format phone number for display
  function formatPhone(phone: string): string {
    if (!phone) return 'N/A';
    // Simple phone formatting (assumes North American format)
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  // Get initials for avatar
  function getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Get status badge color
  function getStatusColor(buyLease: string): string {
    switch (buyLease?.toLowerCase()) {
      case 'buy':
        return 'bg-green-100 text-green-800';
      case 'lease':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Get agent status color
  function getAgentStatusColor(hasAgent: string): string {
    const hasAgentLower = hasAgent?.toLowerCase();
    if (hasAgentLower === 'yes' || hasAgentLower === 'true') {
      return 'bg-orange-100 text-orange-800';
    } else if (hasAgentLower === 'no' || hasAgentLower === 'false') {
      return 'bg-purple-100 text-purple-800';
    }
    return 'bg-gray-100 text-gray-800';
  }
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200">
  {#if guests.length === 0}
    <!-- Empty State -->
    <div class="text-center py-12 px-6">
      <div class="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No guests yet</h3>
      <p class="text-gray-500 text-sm">
        Guest information will appear here once visitors sign in to the open house.
      </p>
    </div>
  {:else}
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          Open House Guests
        </h3>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {guests.length} {guests.length === 1 ? 'Guest' : 'Guests'}
        </span>
      </div>
    </div>

    <!-- Guest List -->
    <div class="divide-y divide-gray-200">
      {#each guests as guest, index (guest.id || index)}
        <div class="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
          <div class="flex items-start space-x-4">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                {getInitials(guest.name)}
              </div>
            </div>

            <!-- Guest Information -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <!-- Name -->
                  <h4 class="text-sm font-semibold text-gray-900 truncate">
                    {guest.name || 'Unknown Guest'}
                  </h4>
                  
                  <!-- Contact Information -->
                  <div class="mt-1 space-y-1">
                    {#if guest.email}
                      <div class="flex items-center text-sm text-gray-600">
                        <svg class="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <a href="mailto:{guest.email}" class="hover:text-blue-600 transition-colors">
                          {guest.email}
                        </a>
                      </div>
                    {/if}
                    
                    {#if guest.phone}
                      <div class="flex items-center text-sm text-gray-600">
                        <svg class="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        <a href="tel:{guest.phone}" class="hover:text-blue-600 transition-colors">
                          {formatPhone(guest.phone)}
                        </a>
                      </div>
                    {/if}
                  </div>
                </div>

                <!-- Status Badges -->
                <div class="flex flex-col items-end space-y-2 ml-4">
                  {#if guest.buy_lease}
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(guest.buy_lease)}">
                      {guest.buy_lease}
                    </span>
                  {/if}
                  
                  {#if guest.has_agent}
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getAgentStatusColor(guest.has_agent)}">
                      {guest.has_agent?.toLowerCase() === 'yes' || guest.has_agent?.toLowerCase() === 'true' ? 'Has Agent' : 'No Agent'}
                    </span>
                  {/if}
                </div>
              </div>

              <!-- Additional Information -->
              {#if !guest.email && !guest.phone}
                <p class="mt-1 text-sm text-gray-500 italic">
                  No contact information provided
                </p>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Footer Summary -->
    <div class="px-6 py-3 bg-gray-50 rounded-b-lg border-t border-gray-200">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <div class="flex items-center space-x-4">
          <span>
            <span class="font-medium text-gray-900">{guests.filter(g => g.buy_lease?.toLowerCase() === 'buy').length}</span>
            looking to buy
          </span>
          <span>
            <span class="font-medium text-gray-900">{guests.filter(g => g.buy_lease?.toLowerCase() === 'lease').length}</span>
            looking to lease
          </span>
        </div>
        <div>
          <span class="font-medium text-gray-900">
            {guests.filter(g => g.has_agent?.toLowerCase() === 'no' || g.has_agent?.toLowerCase() === 'false').length}
          </span>
          without agents
        </div>
      </div>
    </div>
  {/if}
</div>