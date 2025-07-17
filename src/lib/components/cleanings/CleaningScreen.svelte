<script lang="ts">
  // Import required libraries and components
  import { fade } from "svelte/transition";
  import CleaningForm from "./CleaningForm.svelte";
  import CleaningList from "./CleaningList.svelte";
  import Button from "$lib/components/common/Button.svelte";
  import FormBackdrop from "$lib/components/form/FormBackdrop.svelte";
  import { EMPTY_CLEANING, type Cleaning } from "$lib/types/cleaning";
  import { getCleanings, upsertCleaning, deleteCleaning, getAllCleanings } from "$lib/supabase";
  import { user } from "$lib/stores/auth";

  // Props
  let user_id: string;

  // State variables
  let loading = false;
  let error = null;
  let showForm = false;
  let currentRequest: Cleaning;
  let isEditMode = false;
  let filteredRequests: Cleaning[] = [];

  // Get data
  export const fetchCleanings = async () => {
    if (!user_id) return;
    loading = true;
    if ($user?.isAdmin) {
      const { data, error: fetchError } = await getAllCleanings();
      if (!fetchError) filteredRequests = data;
    } else {
      const { data, error: fetchError } = await getCleanings({ user_id });
      if (!fetchError) filteredRequests = data;
    }
    loading = false;
  };

  // Component mount data fetch
  $: {
    user_id = $user?.id;
    fetchCleanings();
  }
  // Edit request
  function editRequest(request: Cleaning) {
    currentRequest = { ...request };
    isEditMode = true;
    showForm = true;
  }

  // New request
  function newRequest() {
    if (!$user?.isApproved) {
      alert('Your account is not yet approved. Please contact admin to get approval.');
      return;
    }
    currentRequest = { ...EMPTY_CLEANING };
    isEditMode = false;
    showForm = true;
  }

  // Delete request
  async function deleteRequest(id: string) {
    if (confirm("Are you sure you want to delete this cleaning request?")) {
      await deleteCleaning(id);
      await fetchCleanings();
    }
  }

  // Submit form
  async function handleSubmit(event: any) {
    if (!$user?.isApproved) {
      alert('Your account is not yet approved. Please contact admin to get approval.');
      return;
    }
    const formData = event.detail;
    const cleaningData = {...formData};
    if (!$user?.isAdmin) {
      cleaningData.user_id = user_id;
    }
    await upsertCleaning(cleaningData);
    showForm = false;
    fetchCleanings();
  }

  // Cancel form
  function cancelForm() {
    showForm = false;
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-bold text-gray-900">Cleaning Requests</h1>
    {#if !$user?.isAdmin}
    <Button 
      onclick={newRequest}
      disabled={!$user?.isApproved}
    >
      <svg class="mr-2 -ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
          clip-rule="evenodd"
        />
      </svg>
      New Cleaning Request
    </Button>
    {/if}
  </div>

  <!-- Main content area -->
  {#if showForm}
    <div transition:fade={{ duration: 200 }}>
      <CleaningForm
        isEdit={isEditMode}
        request={currentRequest}
        on:submit={handleSubmit}
        on:cancel={cancelForm}
      />
    </div>
  {:else}
    <!-- Request list -->
    <CleaningList
      requests={filteredRequests}
      {loading}
      {error}
      on:edit={(e) => editRequest(e.detail)}
      on:delete={(e) => deleteRequest(e.detail)}
      on:new={newRequest}
    />
  {/if}
</div>