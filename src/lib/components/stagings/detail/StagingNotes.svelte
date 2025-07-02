<script lang="ts">
    import { user } from '$lib/stores/auth';
  import type { Staging } from '$lib/types/staging';

  export let staging: Staging;

  // Sample notes - in a real app, these would come from the database
  const sampleNotes = [
    {
      id: 1,
      author: 'System',
      date: staging.created_at || new Date().toISOString(),
      content: 'Staging request created and submitted for review.',
      type: 'system'
    },
    {
      id: 2,
      author: 'Staging Team',
      date: new Date().toISOString(),
      content: 'Initial assessment completed. Property is suitable for staging with recommended focus on living areas and master bedroom.',
      type: 'team'
    }
  ];

  function getAuthorInitials(author: string): string {
    return author.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  }

  function getAuthorColor(type: string): string {
    switch (type) {
      case 'system':
        return 'bg-blue-100 text-blue-600';
      case 'team':
        return 'bg-green-100 text-green-600';
      case 'client':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200">
  <div class="px-6 py-4 border-b border-gray-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900">Project Notes</h2>
      </div>
      <span class="text-sm text-gray-500">{sampleNotes.length} notes</span>
    </div>
  </div>

  <div class="p-6">
    {#if sampleNotes.length === 0}
      <!-- Empty State -->
      <div class="text-center py-8">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
        <p class="text-gray-500">Project notes and updates will appear here.</p>
      </div>
    {:else}
      <!-- Notes List -->
      <div class="space-y-4">
        {#each sampleNotes as note}
          <div class="flex space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <!-- Author Avatar -->
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium {getAuthorColor(note.type)}">
                {getAuthorInitials(note.author)}
              </div>
            </div>

            <!-- Note Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium text-gray-900">{note.author}</span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {getAuthorColor(note.type)}">
                    {note.type}
                  </span>
                </div>
                <span class="text-xs text-gray-500">{formatDate(note.date)}</span>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed">{note.content}</p>
            </div>
          </div>
        {/each}
      </div>

      <!-- Add Note Section -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <div class="flex space-x-4">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-gray-600">
                {getAuthorInitials($user?.name || 'User')}
              </span>
            </div>
          </div>
          <div class="flex-1">
            <textarea
              placeholder="Add a note about this staging request..."
              rows="3"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            ></textarea>
            <div class="mt-3 flex justify-end">
              <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>