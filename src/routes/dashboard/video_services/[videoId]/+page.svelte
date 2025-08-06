<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/auth';
  import { getPageTitle } from '$lib/types/constant';
  import type { VideoService } from '$lib/types/video';
  import { VIDEO_SERVICE_TYPES, VIDEO_SERVICE_ADDONS, calculateVideoServicePrice } from '$lib/types/video';
  import VideoServiceHeader from '$lib/components/video/detail/VideoServiceHeader.svelte';
  import VideoServiceInfo from '$lib/components/video/detail/VideoServiceInfo.svelte';
  import VideoServicePricing from '$lib/components/video/detail/VideoServicePricing.svelte';
  import DetailActions from '$lib/components/common/DetailActions.svelte';
  import { getVideoService, upsertVideoService } from '$lib/supabase';
  import { onMount } from 'svelte';
    import Link from '$lib/components/Link.svelte';
    import Timeline from '$lib/components/common/Timeline.svelte';
    import { sendRequest } from '$lib/helper';

  const videoServiceId = $page.params.videoId;
  
  let videoService: VideoService;
  let loading = false;
  let error = '';

  let user_id:string|undefined;

  $: {
    user_id = $user?.id;
  }

  onMount(()=>{
    fetchSocialMediaService();
  })

  const fetchSocialMediaService = async ()=> {
    const {data: {error,video_service}} = await sendRequest({
      url: `/api/videos/${videoServiceId}`,
      method: 'GET'
    });
    if (error) throw error;
    videoService = video_service;
  }

  // Get service type information
  $: serviceTypeInfo = VIDEO_SERVICE_TYPES.find(type => type.value === videoService?.service_type);
  
  // Get addon information
  $: addonInfo = (videoService?.addons || []).map(addonType => 
    VIDEO_SERVICE_ADDONS.find(addon => addon.value === addonType)
  ).filter(Boolean);

  // Calculate pricing information
  $: pricingInfo = calculateVideoServicePrice(
    videoService?.service_type,
    videoService?.number_of_videos,
    videoService?.addons || [],
    videoService?.estimate_price
  );

  // Handle status updates - refresh the data
  async function handleStatusUpdate() {
    try {
      loading = true;
      error = '';
      
      const { data: updatedVideoService, error: fetchError } = await getVideoService(videoService?.id!);
      
      if (fetchError) {
        throw fetchError;
      }

      if (updatedVideoService) {
        videoService = updatedVideoService;
      }
    } catch (err) {
      console.error('Error refreshing video service:', err);
      error = 'Failed to refresh data';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>{getPageTitle(`Video Service Request #${videoService?.id?.slice(-8) || 'N/A'}`)}</title>
</svelte:head>

<div class="space-y-8">
  <!-- Back Navigation -->
  <div class="flex items-center space-x-4">
    <Link
      href={'/dashboard/video'}
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      Back to Video Services
    </Link>
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

  <!-- Loading Overlay -->
  {#if loading}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        <span class="text-gray-700">Refreshing data...</span>
      </div>
    </div>
  {/if}

  <!-- Video Service Header -->
  <VideoServiceHeader {videoService} />
  <Timeline request={videoService} tp="video" />

  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Left Column - Main Content -->
    <div class="lg:col-span-2 space-y-8">

      <!-- Video Service Information -->
      <VideoServiceInfo {videoService} {serviceTypeInfo} {addonInfo} />

      <!-- Pricing Information -->
      <VideoServicePricing {videoService} {pricingInfo} />
    </div>

    <!-- Right Column - Actions -->
    <div class="lg:col-span-1">
      <DetailActions 
        request={videoService}
        tp="video"
        on:statusUpdate={handleStatusUpdate}
      />
    </div>
  </div>
</div>