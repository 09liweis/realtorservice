<script lang="ts">
  import { onMount } from 'svelte';
  import type { SocialMediaService } from '$lib/types/social';
  import { EMPTY_SOCIAL_MEDIA_SERVICE } from '$lib/types/social';
  import { getUserSocialMediaServices, upsertSocialMediaService, deleteSocialMediaService } from '$lib/supabase';
  import SocialMediaServiceForm from './SocialMediaServiceForm.svelte';
  import SocialMediaServiceList from './SocialMediaServiceList.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
    import { user } from '$lib/stores/auth';
  import { sendEmailRequest } from '$lib/http';
    import { sendRequest } from '$lib/helper';

  export let userId: string = $user?.id || '';

  let socialMediaServices: SocialMediaService[] = [];
  let loading = false;
  let error: string | null = null;
  let showForm = false;
  let editingService: SocialMediaService | null = null;
  let formLoading = false;
  let showDeleteConfirm = false;
  let serviceToDelete: SocialMediaService | null = null;

  let isAdmin = false;
  $: {
    isAdmin = $user?.isAdmin || false;
  }

  onMount(() => {
    loadSocialMediaServices();
  });

  async function loadSocialMediaServices() {
    try {
      loading = true;
      error = null;
      const { data: {error: fetchError, social_media_services} } = await sendRequest({
        url: '/api/socials',
        method: 'GET'
      });
      if (fetchError) throw fetchError;
      socialMediaServices = social_media_services || [];
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load social media services';
      console.error('Error loading social media services:', err);
    } finally {
      loading = false;
    }
  }

  function handleCreateNew() {
    editingService = null;
    showForm = true;
  }

  function handleEdit(event: CustomEvent<SocialMediaService>) {
    editingService = { ...event.detail };
    showForm = true;
  }

  function handleDelete(event: CustomEvent<SocialMediaService>) {
    serviceToDelete = event.detail;
    showDeleteConfirm = true;
  }

  async function confirmDelete() {
    if (!serviceToDelete?.id) return;

    try {
      formLoading = true;
      const { error: deleteError } = await deleteSocialMediaService(serviceToDelete.id);
      if (deleteError) throw deleteError;
      
      await loadSocialMediaServices();
      showDeleteConfirm = false;
      serviceToDelete = null;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to delete social media service';
      console.error('Error deleting social media service:', err);
    } finally {
      formLoading = false;
    }
  }

  async function handleFormSubmit(event: CustomEvent<SocialMediaService>) {
    const serviceData = event.detail;

    try {
      formLoading = true;
      error = null;

      const serviceToSave = {
        ...serviceData,
        is_user_unread:false
      };

      if (editingService?.id) {
        serviceToSave.id = editingService.id;
      }

      const { data: {error: saveError, social_media_service} } = await sendRequest({
        url: '/api/socials',
        body: serviceToSave
      });

      if (saveError) throw saveError;

      try {
        await sendEmailRequest({
          email: $user?.email,
          projectName: serviceData.platforms.join(', ') + ' ' + serviceData.posting_frequency,
          projectUrl: `/dashboard/social/${social_media_service?.id}`,
          type: 'submission'
        });
      } catch (emailError) {
        console.error('Email notification error:', emailError);
      }

      await loadSocialMediaServices();
      showForm = false;
      editingService = null;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to save social media service';
      console.error('Error saving social media service:', err);
    } finally {
      formLoading = false;
    }
  }

  function handleFormCancel() {
    showForm = false;
    editingService = null;
  }

  function cancelDelete() {
    showDeleteConfirm = false;
    serviceToDelete = null;
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Social Media Management</h2>
      <p class="text-gray-600 mt-1">Professional social media management services for your real estate business</p>
    </div>
    {#if !isAdmin}
    <Button onclick={handleCreateNew}>
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002 2V8M7 8h10M9 12h6m-6 4h6"></path>
      </svg>
      New Social Media Service
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

  <!-- Social Media Service List or Form -->
  {#if showForm}
    <SocialMediaServiceForm
      socialMediaService={editingService || { ...EMPTY_SOCIAL_MEDIA_SERVICE }}
      isEdit={!!editingService}
      loading={formLoading}
      on:submit={handleFormSubmit}
      on:cancel={handleFormCancel}
    />
  {:else}
    <SocialMediaServiceList 
      {socialMediaServices} 
      {loading}
      on:edit={handleEdit}
      on:delete={handleDelete}
    />
  {/if}
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm && serviceToDelete}
  <FormBackdrop handleClose={cancelDelete}>
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex items-center mb-4">
        <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900">Delete Social Media Service</h3>
      </div>
      
      <p class="text-gray-600 mb-6">
        Are you sure you want to delete this social media service request? This action cannot be undone.
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
          Delete Service
        </Button>
      </div>
    </div>
  </FormBackdrop>
{/if}