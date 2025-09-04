<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { DASHBOARD_CLEANINGS_URL, getPageTitle } from '$lib/types/constant';
  import type { Cleaning } from '$lib/types/cleaning';
  import CleaningPropertyInfo from '$lib/components/cleanings/detail/CleaningPropertyInfo.svelte';
  import CleaningFinancialInfo from '$lib/components/cleanings/detail/CleaningFinancialInfo.svelte';
  import { fade, fly } from 'svelte/transition';
    import StagingCleaningHeader from '$lib/components/common/StagingCleaningHeader.svelte';
    import DetailActions from '$lib/components/common/DetailActions.svelte';
    import Timeline from '$lib/components/common/Timeline.svelte';
    import Link from '$lib/components/Link.svelte';
    import { sendRequest } from '$lib/helper';
    import SkeletonLoader from '$lib/components/common/SkeletonLoader.svelte';


  const cleaningId = $page.params.cleaningId;
  
  let cleaning: Cleaning | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(() => {
    loadCleaning();
  });

  async function loadCleaning() {
    try {
      loading = true;
      error = null;
      
      const { data: {error: fetchError,cleaning:data} } = await sendRequest({
        url: `/api/cleanings/${cleaningId}`,
        method: 'GET'
      });
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (!data) {
        error = 'Cleaning request not found';
        return;
      }
      
      cleaning = data;
    } catch (err) {
      console.error('Error loading cleaning:', err);
      error = err instanceof Error ? err.message : 'Failed to load cleaning details';
    } finally {
      loading = false;
    }
  }

  function handleEdit() {
    if (cleaning) {
      goto(`${DASHBOARD_CLEANINGS_URL}?edit=${cleaning.id}`);
    }
  }

  function handleStatusUpdate() {
    // Reload cleaning data after status update
    loadCleaning();
  }
</script>

<svelte:head>
  <title>{getPageTitle('Cleaning Details')}</title>
</svelte:head>

<div class="space-y-6">
  <!-- Back Navigation -->
  <div class="flex items-center space-x-4">
    <Link
      href={DASHBOARD_CLEANINGS_URL}
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Back to Cleanings
    </Link>
  </div>

  {#if loading}
    <!-- Loading State (Skeleton Style) -->
    <SkeletonLoader variant="detail" />
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
      <h3 class="text-lg font-semibold text-red-900 mb-2">Error Loading Cleaning</h3>
      <p class="text-red-700 mb-4">{error}</p>
      <div class="flex justify-center space-x-3">
        <button
          on:click={loadCleaning}
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  {:else if cleaning}
    <!-- Main Content -->
    <div class="space-y-6" in:fly={{ y: 20, duration: 400, delay: 100 }}>
      <!-- Header Section -->
      <StagingCleaningHeader
        tp="cleaning"
        request={cleaning} 
      />

      <Timeline request={cleaning} tp="cleaning" />

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Main Information -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Property Information -->
          <CleaningPropertyInfo {cleaning} />
          
          <!-- Financial Information -->
          <CleaningFinancialInfo {cleaning} />

          <!-- Special Requests Section -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            {#if cleaning.notes}
              <div class="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {cleaning.notes}
              </div>
            {:else}
              <p class="text-gray-500 italic">No special requests provided</p>
            {/if}
          </div>
          
        </div>

        <!-- Right Column - Actions and Summary -->
        <div class="lg:col-span-1">
          <DetailActions
            request={cleaning}
            tp="cleanings"
            on:statusUpdate={handleStatusUpdate}
          />
        </div>
      </div>
    </div>
  {/if}
</div>