<script lang="ts">
  import { formatAmount } from '$lib/types/constant';
  import type { Staging } from '$lib/types/staging';

  export let stagings: Staging[] = [];

  // Format date for display
  function formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Get status badge color
  function getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Get property type badge color
  function getPropertyTypeColor(type: string): string {
    switch (type?.toLowerCase()) {
      case 'house':
        return 'bg-blue-100 text-blue-800';
      case 'condo':
        return 'bg-purple-100 text-purple-800';
      case 'townhouse':
        return 'bg-green-100 text-green-800';
      case 'apartment':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Format currency
  function formatCurrency(amount: number): string {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
  <!-- Header -->
  <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">
        Staging Requests
      </h3>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        {stagings.length} {stagings.length === 1 ? 'Request' : 'Requests'}
      </span>
    </div>
  </div>

  {#if stagings.length === 0}
    <!-- Empty State -->
    <div class="text-center py-12 px-6">
      <div class="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No staging requests</h3>
      <p class="text-gray-500 text-sm">
        Staging requests will appear here once users submit them.
      </p>
    </div>
  {:else}
    <!-- Staging Cards Grid -->
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each stagings as staging (staging.id)}
          <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
            <!-- Header with Status -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h4 class="text-lg font-semibold text-gray-900 truncate">
                  {staging.location || 'Unknown Location'}
                </h4>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 {getPropertyTypeColor(staging.property_type)}">
                  {staging.property_type || 'Unknown Type'}
                </span>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(staging.status)}">
                {staging.status || 'Unknown'}
              </span>
            </div>

            <!-- Property Details -->
            <div class="space-y-3 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Size:</span>
                <span class="font-medium text-gray-900">
                  {staging.size ? `${staging.size} sq ft` : 'N/A'}
                </span>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Rooms:</span>
                <span class="font-medium text-gray-900">
                  {staging.rooms || 'N/A'}
                </span>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Length:</span>
                <span class="font-medium text-gray-900">
                  {staging.length ? `${staging.length} month${staging.length !== '1' ? 's' : ''}` : 'N/A'}
                </span>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Occupation:</span>
                <span class="font-medium text-gray-900 capitalize">
                  {staging.occupation_status || 'N/A'}
                </span>
              </div>
            </div>

            <!-- Financial Information -->
            <div class="border-t border-gray-200 pt-4 space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Selling Price:</span>
                <span class="font-medium text-gray-900">
                  {staging.selling_price ? formatAmount(staging.selling_price) : 'N/A'}
                </span>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Quote:</span>
                <span class="font-bold text-purple-600">
                  {staging.quotation_price ? formatCurrency(staging.quotation_price) : 'Pending'}
                </span>
              </div>
            </div>

            <!-- Timeline -->
            {#if staging.timeline}
              <div class="border-t border-gray-200 pt-4 mt-4">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">Start Date:</span>
                  <span class="font-medium text-gray-900">
                    {formatDate(staging.timeline)}
                  </span>
                </div>
              </div>
            {/if}

            <!-- Created Date -->
            {#if staging.created_at}
              <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="flex items-center text-xs text-gray-500">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Requested: {formatDate(staging.created_at)}
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Summary Footer -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>
              <span class="font-medium text-gray-900">{stagings.filter(s => s.status?.toLowerCase() === 'pending').length}</span>
              Pending
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>
              <span class="font-medium text-gray-900">{stagings.filter(s => s.status?.toLowerCase() === 'scheduled').length}</span>
              Scheduled
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>
              <span class="font-medium text-gray-900">{stagings.filter(s => s.status?.toLowerCase() === 'completed').length}</span>
              Completed
            </span>
          </div>
        </div>
        <div>
          Total Value: <span class="font-medium text-gray-900">
            {formatCurrency(stagings.reduce((sum, s) => sum + (s.quotation_price || 0), 0))}
          </span>
        </div>
      </div>
    </div>
  {/if}
</div>