<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/auth';
  import { getPageTitle } from '$lib/types/constant';
  import type { VideoService } from '$lib/types/video';
  import { VIDEO_SERVICE_TYPES, VIDEO_SERVICE_ADDONS, VIDEO_SERVICE_STATUS, calculateVideoServicePrice, EMPTY_VIDEO_SERVICE } from '$lib/types/video';
  import VideoServiceHeader from '$lib/components/video/detail/VideoServiceHeader.svelte';
  import VideoServiceInfo from '$lib/components/video/detail/VideoServiceInfo.svelte';
  import VideoServicePricing from '$lib/components/video/detail/VideoServicePricing.svelte';
  import VideoServiceActions from '$lib/components/video/detail/VideoServiceActions.svelte';

  const videoServiceId = $page.params.videoServiceId;
  
  let videoService: VideoService = EMPTY_VIDEO_SERVICE;

  // Redirect if user is not logged in
  $: if (!$user) {
    goto('/login');
  } else {

  }

  // Get service type information
  $: serviceTypeInfo = VIDEO_SERVICE_TYPES.find(type => type.value === videoService.service_type);
  
  // Get addon information
  $: addonInfo = (videoService.addons || []).map(addonType => 
    VIDEO_SERVICE_ADDONS.find(addon => addon.value === addonType)
  ).filter(Boolean);

  // Calculate pricing information
  $: pricingInfo = calculateVideoServicePrice(
    videoService.service_type,
    videoService.number_of_videos,
    videoService.addons || [],
    videoService.price
  );

  // Get status information
  $: statusInfo = VIDEO_SERVICE_STATUS.find(s => s.value === videoService.status) || VIDEO_SERVICE_STATUS[0];

  // Handle status updates
  function handleStatusUpdate() {
    // Refresh the page data or refetch the video service
    window.location.reload();
  }
</script>

<svelte:head>
  <title>{getPageTitle(`Video Service Request #${videoService.id?.slice(-8) || 'N/A'}`)}</title>
</svelte:head>

<div class="space-y-8">
  <!-- Back Navigation -->
  <div class="flex items-center space-x-4">
    <button
      on:click={() => goto('/dashboard/video')}
      class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      Back to Video Services
    </button>
  </div>

  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Left Column - Main Content -->
    <div class="lg:col-span-2 space-y-8">
      <!-- Video Service Header -->
      <VideoServiceHeader {videoService} />

      <!-- Video Service Information -->
      <VideoServiceInfo {videoService} {serviceTypeInfo} {addonInfo} />

      <!-- Pricing Information -->
      <VideoServicePricing {videoService} {pricingInfo} />
    </div>

    <!-- Right Column - Actions -->
    <div class="lg:col-span-1">
      <VideoServiceActions 
        {videoService} 
        on:statusUpdate={handleStatusUpdate}
      />
    </div>
  </div>
</div>