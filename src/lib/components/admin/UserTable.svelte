<script lang="ts">
  import { updateUserProfile } from '$lib/supabase';

  export let users: any[];

  let loading = false;
  let updatingUserId: string | null = null;

  // Handle realtor approval
  async function approveRealtor(user: any) {
    try {
      updatingUserId = user.user_id;
      loading = true;

      const { error } = await updateUserProfile(user.user_id, {
        realtor_approved: true
      });

      if (error) throw error;

      // Update the user in the local array
      const userIndex = users.findIndex(u => u.user_id === user.user_id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], realtor_approved: true };
        users = [...users]; // Trigger reactivity
      }

    } catch (error) {
      console.error('Error approving realtor:', error);
      alert('Failed to approve realtor. Please try again.');
    } finally {
      loading = false;
      updatingUserId = null;
    }
  }

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

  // Get user initials for avatar
  function getInitials(firstName: string, lastName: string): string {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || '?';
  }

  // Get approval status badge style
  function getApprovalStatusStyle(approved: boolean): string {
    return approved 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
  <!-- Header -->
  <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">
        Registered Users
      </h3>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {users.length} {users.length === 1 ? 'User' : 'Users'}
      </span>
    </div>
  </div>

  {#if users.length === 0}
    <!-- Empty State -->
    <div class="text-center py-12 px-6">
      <div class="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
      <p class="text-gray-500 text-sm">
        User registrations will appear here once people sign up for the platform.
      </p>
    </div>
  {:else}
    <!-- User Cards Grid -->
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each users as user (user.user_id)}
          <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
            <!-- User Avatar and Basic Info -->
            <div class="flex items-start space-x-4 mb-4">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg">
                  {getInitials(user.first_name, user.last_name)}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-lg font-semibold text-gray-900 truncate">
                  {user.first_name} {user.last_name}
                </h4>
                <p class="text-sm text-gray-600 truncate">{user.email}</p>
              </div>
            </div>

            <!-- User Details -->
            <div class="space-y-3 mb-4">
              <div class="flex items-center text-sm">
                <svg class="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span class="text-gray-600 font-medium">Brokerage:</span>
                <span class="ml-1 text-gray-900">{user.brokerage || 'N/A'}</span>
              </div>

              <div class="flex items-center text-sm">
                <svg class="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="text-gray-600 font-medium">RECO:</span>
                <span class="ml-1 text-gray-900 font-mono text-xs">{user.reco_number || 'N/A'}</span>
              </div>

              <div class="flex items-center text-sm">
                <svg class="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span class="text-gray-600 font-medium">Phone:</span>
                <span class="ml-1 text-gray-900">{formatPhone(user.phone)}</span>
              </div>

              <div class="flex items-center text-sm">
                <svg class="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4l2 2 4-4m-6 4h6m-6 4h6"></path>
                </svg>
                <span class="text-gray-600 font-medium">Joined:</span>
                <span class="ml-1 text-gray-900">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <!-- Approval Status and Action -->
            <div class="border-t border-gray-200 pt-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium text-gray-600">Status:</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {getApprovalStatusStyle(user.realtor_approved)}">
                    {#if user.realtor_approved}
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      Approved
                    {:else}
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                      </svg>
                      Pending
                    {/if}
                  </span>
                </div>

                {#if !user.realtor_approved}
                  <button
                    on:click={() => approveRealtor(user)}
                    disabled={loading && updatingUserId === user.user_id}
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {#if loading && updatingUserId === user.user_id}
                      <svg class="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Approving...
                    {:else}
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      Approve
                    {/if}
                  </button>
                {:else}
                  <span class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md border border-green-200">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    Approved
                  </span>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Summary Footer -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>
              <span class="font-medium text-gray-900">{users.filter(u => u.realtor_approved).length}</span>
              Approved Realtors
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>
              <span class="font-medium text-gray-900">{users.filter(u => !u.realtor_approved).length}</span>
              Pending Approval
            </span>
          </div>
        </div>
        <div>
          Total: <span class="font-medium text-gray-900">{users.length}</span> users
        </div>
      </div>
    </div>
  {/if}
</div>