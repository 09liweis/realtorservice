<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { VideoService } from '$lib/types/video';
  import { VIDEO_SERVICE_STATUS } from '$lib/types/video';
  import { user } from '$lib/stores/auth';
  import { upsertVideoService } from '$lib/supabase';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';

  export let videoService: VideoService;

  const dispatch = createEventDispatcher();

  let statusLoading = false;
  let error = '';
  let success = false;

  // Get current status info
  $: currentStatusInfo = VIDEO_SERVICE_STATUS.find(s => s.value === videoService.status) || VIDEO_SERVICE_STATUS[0];

  // Get next possible statuses based on current status and user role
  $: nextStatuses = getNextStatuses(videoService.status, $user?.isAdmin);

  function getNextStatuses(currentStatus: string, isAdmin: boolean) {
    if (!isAdmin) {
      // Non-admin users can only cancel their requests
      if (currentStatus === 'pending' || currentStatus === 'quoted') {
        return [{ value: 'cancelled', label: 'Cancel Request', color: 'red' }];
      }
      return [];
    }

    // Admin can change status based on workflow
    switch (currentStatus) {
      case 'pending':
        return [
          { value: 'quoted', label: 'Provide Quote', color: 'blue' },
          { value: 'cancelled', label: 'Cancel Request', color: 'red' }
        ];
      case 'quoted':
        return [
          { value: 'approved', label: 'Mark as Approved', color: 'green' },
          { value: 'cancelled', label: 'Cancel Request', color: 'red' }
        ];
      case 'approved':
        return [
          { value: 'in_progress', label: 'Start Work', color: 'blue' }
        ];
      case 'in_progress':
        return [
          { value: 'review', label: 'Submit for Review', color: 'purple' }
        ];
      case 'review':
        return [
          { value: 'completed', label: 'Mark as Completed', color: 'green' },
          { value: 'in_progress', label: 'Back to In Progress', color: 'blue' }
        ];
      default:
        return [];
    }
  }

  async function updateStatus(newStatus: string) {
    try {
      statusLoading = true;
      error = '';
      success = false;

      const updatedVideoService = {
        ...videoService,
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await upsertVideoService(updatedVideoService);
      if (updateError) throw updateError;

      videoService.status = newStatus;
      success = true;
      dispatch('statusUpdate');

      // Clear success message after 3 seconds
      setTimeout(() => {
        success = false;
      }, 3000);

    } catch (err: any) {
      error = err.message || 'Failed to update status';
      console.error('Error updating video service status:', err);
    } finally {
      statusLoading = false;
    }
  }

  async function updatePrice() {
    try {
      statusLoading = true;
      error = '';
      success = false;

      const { error: updateError } = await upsertVideoService(videoService);
      if (updateError) throw updateError;

      success = true;
      dispatch('statusUpdate');

      // Clear success message after 3 seconds
      setTimeout(() => {
        success = false;
      }, 3000);

    } catch (err: any) {
      error = err.message || 'Failed to update price';
      console.error('Error updating video service price:', err);
    } finally {
      statusLoading = false;
    }
  }

  function getStatusButtonStyle(color: string): string {
    switch (color) {
      case 'green':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      case 'red':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
  <h2 class="px-6 py-4 border-b border-gray-200 text-xl font-semibold text-gray-900">Quick Actions</h2>

  <div class="p-6 space-y-4">
    <!-- Current Status Display -->
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-{currentStatusInfo.color}-100 rounded-lg flex items-center justify-center">
          <span class="text-lg">
            {#if currentStatusInfo.value === 'pending'}⏳
            {:else if currentStatusInfo.value === 'quoted'}💰
            {:else if currentStatusInfo.value === 'approved'}✅
            {:else if currentStatusInfo.value === 'in_progress'}🔄
            {:else if currentStatusInfo.value === 'review'}👀
            {:else if currentStatusInfo.value === 'completed'}🎉
            {:else if currentStatusInfo.value === 'cancelled'}❌
            {:else}📋{/if}
          </span>
        </div>
        <div>
          <div class="font-medium text-gray-900">Current Status</div>
          <div class="text-sm text-gray-600">{currentStatusInfo.label}</div>
        </div>
      </div>
    </div>

    <!-- Admin Price Update -->
    {#if $user?.isAdmin && (videoService.status === 'pending' || videoService.status === 'quoted')}
      <div class="space-y-3">
        <Input
          label="Custom Price (CAD)"
          bind:value={videoService.price}
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter custom price"
        />
        <Button
          onclick={updatePrice}
          loading={statusLoading}
          disabled={statusLoading}
          class_name="w-full"
        >
          Update Price
        </Button>
      </div>
    {/if}

    <!-- Status Update Actions -->
    {#if nextStatuses.length > 0}
      <div class="space-y-3">
        <div class="text-sm font-medium text-gray-700">Available Actions:</div>
        {#each nextStatuses as status}
          <Button
            onclick={() => updateStatus(status.value)}
            loading={statusLoading}
            disabled={statusLoading}
            class_name="w-full {getStatusButtonStyle(status.color)}"
          >
            {statusLoading ? 'Updating...' : status.label}
          </Button>
        {/each}
      </div>
    {:else}
      <div class="text-center py-4">
        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span class="text-2xl">
            {#if videoService.status === 'completed'}🎉
            {:else if videoService.status === 'cancelled'}❌
            {:else}⏳{/if}
          </span>
        </div>
        <div class="text-sm font-medium text-gray-700">
          {#if videoService.status === 'completed'}
            Request Completed
          {:else if videoService.status === 'cancelled'}
            Request Cancelled
          {:else}
            No Actions Available
          {/if}
        </div>
        <div class="text-xs text-gray-500 mt-1">
          {#if videoService.status === 'completed'}
            Your video editing is complete
          {:else if videoService.status === 'cancelled'}
            This request has been cancelled
          {:else}
            Please wait for the next step
          {/if}
        </div>
      </div>
    {/if}

    <!-- Success/Error Messages -->
    {#if success}
      <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
        Status updated successfully!
      </div>
    {/if}

    {#if error}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {error}
      </div>
    {/if}

    <!-- Contact Support -->
    <div class="space-y-3 pt-4 border-t border-gray-200">
      <button class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        Contact Support
      </button>
    </div>

    <!-- Request Information -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-sm font-medium text-gray-700 mb-3">Request Information</h3>
      <div class="space-y-2 text-xs text-gray-600">
        <div class="flex justify-between">
          <span>Request ID:</span>
          <span class="font-mono">{videoService.id?.slice(-8) || 'N/A'}</span>
        </div>
        <div class="flex justify-between">
          <span>Created:</span>
          <span>{videoService.created_at ? new Date(videoService.created_at).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div class="flex justify-between">
          <span>Last Updated:</span>
          <span>{videoService.updated_at ? new Date(videoService.updated_at).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>
    </div>
  </div>
</div>