<script lang="ts">
  import { updateUserProfile } from '$lib/supabase';

  export let users: any[];

  let loading = false;
  let updatingUserId: string | null = null;
  let showModal = false;
  let currentUser: any = null;
  let notificationMessage = '';

  async function approveRealtor(user: any) {
    try {
      updatingUserId = user.user_id;
      loading = true;

      const { error } = await updateUserProfile(user.user_id, {
        realtor_approved: true
      });

      if (error) throw error;

      const userIndex = users.findIndex(u => u.user_id === user.user_id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], realtor_approved: true };
        users = [...users];
      }
    } catch (error) {
      console.error('Error approving realtor:', error);
      alert('Failed to approve realtor. Please try again.');
    } finally {
      loading = false;
      updatingUserId = null;
    }
  }

  function openNotificationModal(user: any) {
    currentUser = user;
    notificationMessage = '';
    showModal = true;
  }

  async function sendNotification() {
    if (!currentUser || !notificationMessage.trim()) return;

    try {
      loading = true;
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser.user_id,
          content: notificationMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      alert('Notification sent successfully!');
      showModal = false;
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification. Please try again.');
    } finally {
      loading = false;
    }
  }
</script>

<div class="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
  <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
    <h3 class="text-lg font-medium text-gray-900">
      Registered Users ({users.length})
    </h3>
  </div>

  {#if users.length === 0}
    <div class="text-center py-8 px-4">
      <h3 class="text-md font-medium text-gray-900 mb-1">No users found</h3>
      <p class="text-gray-500 text-sm">
        User registrations will appear here once people sign up.
      </p>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">RECO Number</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Brokerage</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each users as user (user.user_id)}
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.first_name} {user.last_name}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {user.reco_number || '—'}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {user.brokerage || '—'}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm">
                {#if user.realtor_approved}
                  <span class="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                    Approved
                  </span>
                {:else}
                  <span class="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                {/if}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm">
                {#if !user.realtor_approved}
                  <button
                    on:click={() => approveRealtor(user)}
                    disabled={loading && updatingUserId === user.user_id}
                    class="px-3 py-1 text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 mr-2"
                  >
                    {#if loading && updatingUserId === user.user_id}
                      Approving...
                    {:else}
                      Approve
                    {/if}
                  </button>
                {/if}
                <button
                  on:click={() => openNotificationModal(user)}
                  disabled={loading && updatingUserId === user.user_id}
                  class="px-3 py-1 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  Notify
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  {#if showModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium mb-4">Notify User</h3>
        <textarea
          bind:value={notificationMessage}
          class="w-full p-2 border border-gray-300 rounded mb-4"
          rows="5"
          placeholder="Enter your notification message..."
        ></textarea>
        <div class="flex justify-end space-x-2">
          <button
            on:click={() => showModal = false}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            on:click={sendNotification}
            disabled={loading}
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
          >
            {#if loading}
              Sending...
            {:else}
              Send Notification
            {/if}
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>