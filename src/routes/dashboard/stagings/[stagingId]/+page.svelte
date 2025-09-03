<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { DASHBOARD_STAGINGS_URL, getPageTitle } from '$lib/types/constant';
  import type { Staging } from '$lib/types/staging';
  import StagingPropertyInfo from '$lib/components/stagings/detail/StagingPropertyInfo.svelte';
  import StagingFinancialInfo from '$lib/components/stagings/detail/StagingFinancialInfo.svelte';
  import { fade, fly } from 'svelte/transition';
  import DetailActions from '$lib/components/common/DetailActions.svelte';
  import Link from '$lib/components/Link.svelte';
  import StagingCleaningHeader from '$lib/components/common/StagingCleaningHeader.svelte';
    import Timeline from '$lib/components/common/Timeline.svelte';
    import { formatDate, sendRequest } from '$lib/helper';
  import { user } from '$lib/stores/auth';
    import SkeletonLoader from '$lib/components/common/SkeletonLoader.svelte';

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
      
      const { data: {error: fetchError, staging:data} } = await sendRequest({
        url: `/api/stagings/${stagingId}`,
        method: 'GET'
      });
      
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
      goto(`${DASHBOARD_STAGINGS_URL}?edit=${staging.id}`);
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
    <Link href={DASHBOARD_STAGINGS_URL}>
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Back to Stagings
    </Link>
  </div>

  {#if loading}
    <!-- Loading State -->
    <SkeletonLoader variant="detail"/>
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
          href={DASHBOARD_STAGINGS_URL}
        >
          Go Back
        </Link>
      </div>
    </div>
  {:else if staging}
    <!-- Main Content -->
    <div class="space-y-6" in:fly={{ y: 20, duration: 400, delay: 100 }}>
      <!-- Header Section -->
      <StagingCleaningHeader 
        tp="staging"
        request={staging} 
      />

      <Timeline request={staging} tp="staging" />

      <!-- End Date Card -->
      <div class="bg-white rounded-xl shadow-sm p-6" in:fade={{ duration: 300 }}>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Staging Completion</h3>
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span class="text-gray-700">
            {formatDate(staging.timeline)} - {formatDate(staging.end_date)}
          </span>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Main Information -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Property Information -->
          <StagingPropertyInfo {staging} />
          
          <!-- Financial Information -->
          <StagingFinancialInfo {staging} />

          <!-- Notes Section -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            {#if staging.notes}
              <div class="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {staging.notes}
              </div>
            {:else}
              <p class="text-gray-500 italic">No notes provided</p>
            {/if}
          </div>
        </div>

        <!-- Right Column - Actions and Summary -->
        <div class="lg:col-span-1">
          <DetailActions
            tp="stagings" 
            request={staging} 
            on:edit={handleEdit}
            on:statusUpdate={handleStatusUpdate}
          />
        </div>
      </div>
    </div>
  {/if}
</div>