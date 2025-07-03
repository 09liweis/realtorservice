<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getStaging } from '$lib/supabase';
  import { getPageTitle } from '$lib/types/constant';
  import type { Staging } from '$lib/types/staging';
  import StagingHeader from '$lib/components/stagings/detail/StagingHeader.svelte';
  import StagingPropertyInfo from '$lib/components/stagings/detail/StagingPropertyInfo.svelte';
  import StagingFinancialInfo from '$lib/components/stagings/detail/StagingFinancialInfo.svelte';
  import StagingTimeline from '$lib/components/stagings/detail/StagingTimeline.svelte';
  import { fade, fly } from 'svelte/transition';
    import StagingCleaningActions from '$lib/components/common/StagingCleaningActions.svelte';
    import Link from '$lib/components/Link.svelte';

  const stagingId = $page.params.stagingId;
  
  let staging: Staging | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(() => {
    loadStaging();
  });

  async function loadStaging() {
    try {
      loading = true;
      error = null;
      
      const { data, error: fetchError } = await getStaging({ property_id: stagingId });
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (!data) {
        error = 'Staging request not found';
        return;
      }
      
      staging = data;
    } catch (err) {
      console.error('Error loading staging:', err);
      error = err instanceof Error ? err.message : 'Failed to load staging details';
    } finally {
      loading = false;
    }
  }

  function handleEdit() {
    if (staging) {
      goto(`/dashboard/stagings?edit=${staging.id}`);
    }
  }

  function handleStatusUpdate() {
    // Reload staging data after status update
    loadStaging();
  }
</script>

<svelte:head>
  <title>{getPageTitle('Staging Details')}</title>
</svelte:head>

<div class="space-y-6">
  <!-- Back Navigation -->
  <div class="flex items-center space-x-4">
    <Link href="/dashboard/stagings">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Back to Stagings
    </Link>
  </div>

  {#if loading}
    <!-- Loading State -->
    <div class="flex justify-center items-center py-12" in:fade={{ duration: 300 }}>
      <div class="relative">
        <div class="animate-spin rounded-full h-12 w-12 border-2 border-gray-200"></div>
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 absolute top-0 left-0"></div>
      </div>
    </div>
  {:else if error}
    <!-- Error State -->
    <div 
      class="bg-red-50 border border-red-200 rounded-xl p-8 text-center"
      in:fly={{ y: 20, duration: 400 }}
    >
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-red-900 mb-2">Error Loading Staging</h3>
      <p class="text-red-700 mb-4">{error}</p>
      <div class="flex justify-center space-x-3">
        <button
          on:click={loadStaging}
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Try Again
        </button>
        <Link
          href="/dashboard/stagings"
        >
          Go Back
        </Link>
      </div>
    </div>
  {:else if staging}
    <!-- Main Content -->
    <div class="space-y-6" in:fly={{ y: 20, duration: 400, delay: 100 }}>
      <!-- Header Section -->
      <StagingHeader 
        {staging} 
      />

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Main Information -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Property Information -->
          <StagingPropertyInfo {staging} />
          
          <!-- Financial Information -->
          <StagingFinancialInfo {staging} />
          
          <!-- Timeline -->
          <StagingTimeline {staging} />
          
          <!-- Notes Section -->
          <!-- <StagingNotes {staging} /> -->
        </div>

        <!-- Right Column - Actions and Summary -->
        <div class="lg:col-span-1">
          <StagingCleaningActions
            tp="staging" 
            request={staging} 
            on:edit={handleEdit}
            on:statusUpdate={handleStatusUpdate}
          />
        </div>
      </div>
    </div>
  {/if}
</div>