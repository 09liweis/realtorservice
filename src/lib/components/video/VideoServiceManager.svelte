<script lang="ts">
  import { onMount } from 'svelte';
  import type { VideoService } from '$lib/types/video';
  import { EMPTY_VIDEO_SERVICE, getServiceTypeInfo } from '$lib/types/video';
  import { getUserVideoServices, upsertVideoService, deleteVideoService } from '$lib/supabase';
  import VideoServiceForm from './VideoServiceForm.svelte';
  import VideoServiceList from './VideoServiceList.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
    import { user } from '$lib/stores/auth';
    import { sendEmailRequest } from '$lib/http';

  export let userId: string = $user?.id || '';

  let videoServices: VideoService[] = [];
  let loading = false;
  let error: string | null = null;
  let showForm = false;
  let editingVideoService: VideoService | null = null;
  let formLoading = false;
  let showDeleteConfirm = false;
  let videoServiceToDelete: VideoService | null = null;

  let isAdmin = false;
  $: {
    isAdmin = $user?.isAdmin || false;
  }

  onMount(() => {
    loadVideoServices();
  });

  async function loadVideoServices() {
    try {
      loading = true;
      error = null;
      const { data, error: fetchError } = await getUserVideoServices({user_id:userId,isAdmin});
      if (fetchError) throw fetchError;
      videoServices = data || [];
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load video services';
      console.error('Error loading video services:', err);
    } finally {
      loading = false;
    }
  }

  function handleCreateNew() {
    editingVideoService = null;
    showForm = true;
  }

  function handleEdit(event: CustomEvent<VideoService>) {
    editingVideoService = { ...event.detail };
    showForm = true;
  }

  function handleDelete(event: CustomEvent<VideoService>) {
    videoServiceToDelete = event.detail;
    showDeleteConfirm = true;
  }

  async function confirmDelete() {
    if (!videoServiceToDelete?.id) return;

    try {
      formLoading = true;
      const { error: deleteError } = await deleteVideoService(videoServiceToDelete.id);
      if (deleteError) throw deleteError;
      
      await loadVideoServices();
      showDeleteConfirm = false;
      videoServiceToDelete = null;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to delete video service';
      console.error('Error deleting video service:', err);
    } finally {
      formLoading = false;
    }
  }

  async function handleFormSubmit(event: CustomEvent<VideoService>) {
    const videoServiceData = event.detail;

    try {
      formLoading = true;
      error = null;

      const serviceToSave = {
        ...videoServiceData,
        user_id: userId,
        is_user_unread:false
      };

      if (editingVideoService?.id) {
        serviceToSave.id = editingVideoService.id;
      }

      const { data, error: saveError } = await upsertVideoService(serviceToSave);
      if (saveError) throw saveError;

      // Send email notification
      try {
        await sendEmailRequest({
          email: $user?.email,
          projectName: getServiceTypeInfo(videoServiceData.service_type)?.label || videoServiceData.service_type,
          projectUrl: `/dashboard/video/${data?.id}`,
          type: 'submission'
        });
      } catch (emailError) {
        console.error('Email notification error:', emailError);
      }

      await loadVideoServices();
      showForm = false;
      editingVideoService = null;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to save video service';
      console.error('Error saving video service:', err);
    } finally {
      formLoading = false;
    }
  }

  function handleFormCancel() {
    showForm = false;
    editingVideoService = null;
  }

  function cancelDelete() {
    showDeleteConfirm = false;
    videoServiceToDelete = null;
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Video Editing Services</h2>
      <p class="text-gray-600 mt-1">Request professional video editing for your real estate content</p>
    </div>
    {#if !isAdmin}
    <Button onclick={handleCreateNew}>
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
      New Video Request
    </Button>
    {/if}
  </div>

  <!-- Error Message -->
  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        {error}
      </div>
    </div>
  {/if}

  <!-- Video Service List or Form -->
  {#if showForm}
    <VideoServiceForm
      videoService={editingVideoService || { ...EMPTY_VIDEO_SERVICE }}
      isEdit={!!editingVideoService}
      loading={formLoading}
      on:submit={handleFormSubmit}
      on:cancel={handleFormCancel}
    />
  {:else}
    <VideoServiceList 
      {videoServices} 
      {loading}
      on:edit={handleEdit}
      on:delete={handleDelete}
    />
  {/if}
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm && videoServiceToDelete}
  <FormBackdrop handleClose={cancelDelete}>
    <div class="bg-white rounded-xl shadow-lg mx-auto p-6">
      <div class="flex items-center mb-4">
        <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900">Delete Video Service Request</h3>
      </div>
      
      <p class="text-gray-600 mb-6">
        Are you sure you want to delete this video service request? This action cannot be undone.
      </p>
      
      <div class="flex items-center justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onclick={cancelDelete}
          disabled={formLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onclick={confirmDelete}
          loading={formLoading}
          disabled={formLoading}
          class_name="bg-red-600 hover:bg-red-700 text-white"
        >
          Delete Request
        </Button>
      </div>
    </div>
  </FormBackdrop>
{/if}