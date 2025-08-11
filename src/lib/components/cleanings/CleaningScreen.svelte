<script lang="ts">
  // Import required libraries and components
  import { fade } from "svelte/transition";
  import CleaningForm from "./CleaningForm.svelte";
  import CleaningList from "./CleaningList.svelte";
  import Button from "$lib/components/common/Button.svelte";
  import { EMPTY_CLEANING, type Cleaning } from "$lib/types/cleaning";
  import { getCleanings, upsertCleaning, deleteCleaning, getAllCleanings } from "$lib/supabase";
  import { user } from "$lib/stores/auth";
    import { onMount } from "svelte";
    import { sendRequest } from "$lib/helper";

  // Props
  let user_id: string;

  // State variables
  let loading = false;
  let error = null;
  let showForm = false;
  let currentRequest: Cleaning;
  let isEditMode = false;
  let filteredRequests: Cleaning[] = [];

  onMount(()=> {
    fetchCleanings();
  })

  // Get data
  export const fetchCleanings = async () => {
    loading = true;
    const {data:{cleanings,error:fetchError}} = await sendRequest({
      url: '/api/cleanings',
      method: 'GET'
    })
    if (!fetchError) filteredRequests = cleanings;
    loading = false;
  };

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
    const cleaningData = {...formData,is_user_unread:false};
    const {data:{cleaning, error}} = await sendRequest({
      url: '/api/cleanings',
      body: cleaningData
    });
    
    try {
      await sendRequest({
        url: '/api/send-status-email',
        body: {
          tp: 'cleanings',
          id: cleaning?.id,
          type: 'submission'
        }
      });
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

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