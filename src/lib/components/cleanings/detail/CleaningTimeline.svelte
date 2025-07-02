<script lang="ts">
  import type { Cleaning } from '$lib/types/cleaning';

  export let cleaning: Cleaning;

  // Timeline events based on cleaning data
  $: timelineEvents = [
    {
      title: 'Request Created',
      date: cleaning.created_at ? new Date(cleaning.created_at).toLocaleDateString() : 'Unknown',
      status: 'completed',
      icon: '📝',
      description: 'Cleaning request was submitted'
    },
    {
      title: 'Under Review',
      date: cleaning.status !== 'draft' ? 'In Progress' : 'Pending',
      status: cleaning.status !== 'draft' ? 'completed' : 'pending',
      icon: '👀',
      description: 'Request is being reviewed by our team'
    },
    {
      title: 'Quote Provided',
      date: cleaning.quotation_price ? 'Completed' : 'Pending',
      status: cleaning.quotation_price ? 'completed' : 'pending',
      icon: '💰',
      description: 'Final pricing quote has been provided'
    },
    {
      title: 'Payment Confirmed',
      date: cleaning.status === 'paid' ? 'Completed' : 'Pending',
      status: cleaning.status === 'paid' ? 'completed' : 'pending',
      icon: '✅',
      description: 'Payment has been processed'
    },
    {
      title: 'Service Scheduled',
      date: cleaning.scheduled_date ? new Date(cleaning.scheduled_date).toLocaleDateString() : (cleaning.status === 'scheduled' ? 'Scheduled' : 'Pending'),
      status: cleaning.status === 'scheduled' ? 'completed' : 'pending',
      icon: '📅',
      description: 'Cleaning service date confirmed'
    },
    {
      title: 'Service Complete',
      date: cleaning.status === 'completed' ? 'Completed' : 'Pending',
      status: cleaning.status === 'completed' ? 'completed' : 'pending',
      icon: '🎉',
      description: 'Cleaning service completed successfully'
    }
  ];

  function getStatusStyle(status: string) {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'current':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  }

  function getIconStyle(status: string) {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'current':
        return 'bg-blue-500 text-white';
      case 'pending':
        return 'bg-gray-300 text-gray-600';
      default:
        return 'bg-gray-300 text-gray-600';
    }
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200">
  <div class="px-6 py-4 border-b border-gray-200">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-900">Service Timeline</h2>
    </div>
  </div>

  <div class="p-6">
    <div class="space-y-6">
      {#each timelineEvents as event, index}
        <div class="flex items-start space-x-4">
          <!-- Timeline Icon -->
          <div class="flex-shrink-0 relative">
            <div class="w-10 h-10 rounded-full flex items-center justify-center {getIconStyle(event.status)} shadow-sm">
              <span class="text-sm">{event.icon}</span>
            </div>
            {#if index < timelineEvents.length - 1}
              <div class="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-6 {event.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'}"></div>
            {/if}
          </div>

          <!-- Timeline Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-base font-semibold text-gray-900">{event.title}</h3>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {getStatusStyle(event.status)}">
                {event.status}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-1">{event.description}</p>
            <div class="flex items-center text-xs text-gray-500">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4l2 2 4-4m-6 4h6m-6 4h6"></path>
              </svg>
              {event.date}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Timeline Summary -->
    <div class="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <span class="text-lg">🧽</span>
        </div>
        <div>
          <div class="text-sm font-medium text-green-800">Service Type</div>
          <div class="text-lg font-bold text-green-900">
            {cleaning.cleaning_type ? cleaning.cleaning_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Regular Cleaning'}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>