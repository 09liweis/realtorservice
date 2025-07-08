<script lang="ts">
  import type { Staging } from '$lib/types/staging';
  import type { Cleaning } from '$lib/types/cleaning';
    import { getStatusStyle } from '$lib/types/constant';

  export let request: Staging | Cleaning;
  export let tp: string = "staging"; // "staging" or "cleaning"

  // Timeline events based on request data and type
  $: timelineEvents = getTimelineEvents(request, tp);

  function getTimelineEvents(request: Staging | Cleaning, type: string) {
    const baseEvents = [
      {
        title: 'Request Created',
        date: request.created_at ? new Date(request.created_at).toLocaleDateString() : 'Unknown',
        status: 'completed',
        icon: '📝',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} request was submitted`
      },
      {
        title: 'Under Review',
        date: request.status !== 'draft' ? 'In Progress' : 'Pending',
        status: request.status !== 'draft' ? 'completed' : 'pending',
        icon: '👀',
        description: 'Request is being reviewed by our team'
      },
      {
        title: 'Quote Provided',
        date: request.quotation_price ? 'Completed' : 'Pending',
        status: request.quotation_price ? 'completed' : 'pending',
        icon: '💰',
        description: 'Final pricing quote has been provided'
      },
      {
        title: 'Payment Confirmed',
        date: request.status === 'paid' ? 'Completed' : 'Pending',
        status: request.status === 'paid' ? 'completed' : 'pending',
        icon: '✅',
        description: 'Payment has been processed'
      }
    ];

    if (type === 'staging') {
      return [
        ...baseEvents,
        {
          title: 'Staging Scheduled',
          date: (request as Staging).timeline || (request.status === 'scheduled' ? 'Scheduled' : 'Pending'),
          status: request.status === 'scheduled' ? 'completed' : 'pending',
          icon: '📅',
          description: 'Staging installation date confirmed'
        },
        {
          title: 'Staging Complete',
          date: request.status === 'completed' ? 'Completed' : 'Pending',
          status: request.status === 'completed' ? 'completed' : 'pending',
          icon: '🎉',
          description: 'Property staging installation completed'
        }
      ];
    } else {
      return [
        ...baseEvents,
        {
          title: 'Service Scheduled',
          date: (request as Cleaning).scheduled_date ? new Date((request as Cleaning).scheduled_date!).toLocaleDateString() : (request.status === 'scheduled' ? 'Scheduled' : 'Pending'),
          status: request.status === 'scheduled' ? 'completed' : 'pending',
          icon: '📅',
          description: 'Cleaning service date confirmed'
        },
        {
          title: 'Service Complete',
          date: request.status === 'completed' ? 'Completed' : 'Pending',
          status: request.status === 'completed' ? 'completed' : 'pending',
          icon: '🎉',
          description: 'Cleaning service completed successfully'
        }
      ];
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

  function getServiceTypeLabel(type: string): string {
    return type === 'staging' ? 'Property Staging' : 'Cleaning Service';
  }

  function getServiceIcon(type: string): string {
    return type === 'staging' ? '✨' : '🧽';
  }

  function getDurationLabel(request: Staging | Cleaning, type: string): string {
    if (type === 'staging') {
      const staging = request as Staging;
      return staging.length ? `${staging.length} month${staging.length !== '1' ? 's' : ''}` : 'To be determined';
    } else {
      const cleaning = request as Cleaning;
      return cleaning.frequency ? cleaning.frequency.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'One-time service';
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
    <div class="space-y-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {#each timelineEvents as event, index}
        <div class="flex items-start space-x-4">
          <!-- Timeline Icon -->
          <div class="flex-shrink-0 relative">
            <div class="w-10 h-10 rounded-full flex items-center justify-center {getIconStyle(event.status)} shadow-sm">
              <span class="text-sm">{event.icon}</span>
            </div>
            <!-- {#if index < timelineEvents.length - 1}
              <div class="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-6 {event.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'}"></div>
            {/if} -->
          </div>

          <!-- Timeline Content -->
          <div class="flex-1 min-w-0">
            <div class="mb-2 space-y-2">
              <h3 class="text-base font-semibold text-gray-900">{event.title}</h3>
              <span class="inline-block px-2 py-1 rounded-full text-xs font-medium border capitalize {getStatusStyle(event.status)}">
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
    <div class="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 grid grid-cols-1 md:grid-cols-2">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <span class="text-lg">{getServiceIcon(tp)}</span>
        </div>
        <div>
          <div class="text-sm font-medium text-purple-800">Service Type</div>
          <div class="text-lg font-bold text-purple-900">
            {getServiceTypeLabel(tp)}
          </div>
        </div>
      </div>
      
      <div class="mt-3 flex items-center space-x-3">
        <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <span class="text-lg">⏱️</span>
        </div>
        <div>
          <div class="text-sm font-medium text-purple-800">Duration</div>
          <div class="text-lg font-bold text-purple-900">
            {getDurationLabel(request, tp)}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>