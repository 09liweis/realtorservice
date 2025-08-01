<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/auth';
  import { getPageTitle } from '$lib/types/constant';
  import type { SocialMediaService } from '$lib/types/social';
  import { 
    SOCIAL_MEDIA_PLATFORMS, 
    SOCIAL_MEDIA_ADDONS,
    calculateSocialMediaPrice
  } from '$lib/types/social';
  import SocialMediaServiceHeader from '$lib/components/social/detail/SocialMediaServiceHeader.svelte';
  import SocialMediaServiceInfo from '$lib/components/social/detail/SocialMediaServiceInfo.svelte';
  import SocialMediaServicePricing from '$lib/components/social/detail/SocialMediaServicePricing.svelte';
  import DetailActions from '$lib/components/common/DetailActions.svelte';
  import { getSocialMediaService, upsertSocialMediaService } from '$lib/supabase';
    import Link from '$lib/components/Link.svelte';
    import Timeline from '$lib/components/common/Timeline.svelte';

  const socialServiceId = $page.params.socialId;
  
  let socialMediaService: SocialMediaService | null = null;
  let loading = false;
  let error = '';
  let user_id:string|undefined;

  // Redirect if user is not logged in
  $: {
    user_id = $user?.id;
    fetchSocialMediaService();
  }

  const fetchSocialMediaService = async ()=> {
    if (user_id) {
      const {data, error} = await getSocialMediaService(socialServiceId);
      if (error) throw error;
      socialMediaService = data;

      const updatedSocialMediaService:SocialMediaService = {
        ...socialMediaService
      };
      if ($user?.isAdmin) {
        updatedSocialMediaService.is_admin_unread = false;
      } else {
        updatedSocialMediaService.is_user_unread = false;
      }
      await upsertSocialMediaService(updatedSocialMediaService)
    }
  }

  // Get platform information
  $: platformInfo = (socialMediaService?.platforms || []).map(platform => 
    SOCIAL_MEDIA_PLATFORMS.find(p => p.value === platform)
  ).filter(Boolean);
  
  // Get addon information
  $: addonInfo = (socialMediaService?.addons || []).map(addonType => 
    SOCIAL_MEDIA_ADDONS.find(addon => addon.value === addonType)
  ).filter(Boolean);

  // Calculate pricing information
  $: pricingInfo = calculateSocialMediaPrice(
    socialMediaService?.posting_frequency,
    socialMediaService?.subscription_type,
    socialMediaService?.addons || [],
    socialMediaService?.quotation_price
  );

  // Handle status updates - refresh the data
  async function handleStatusUpdate() {
    try {
      loading = true;
      error = '';
      
      const { data: updatedSocialMediaService, error: fetchError } = await getSocialMediaService(socialMediaService?.id!);
      
      if (fetchError) {
        throw fetchError;
      }

      if (updatedSocialMediaService) {
        socialMediaService = updatedSocialMediaService;
      }
    } catch (err) {
      console.error('Error refreshing social media service:', err);
      error = 'Failed to refresh data';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>{getPageTitle(`Social Media Service #${socialMediaService?.id?.slice(-8) || 'N/A'}`)}</title>
</svelte:head>

<div class="space-y-8">
  <!-- Back Navigation -->
  <div class="flex items-center space-x-4">
    <Link
      href={'/dashboard/social'}
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      Back to Social Media Services
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
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
        <span class="text-gray-700">Refreshing data...</span>
      </div>
    </div>
  {/if}

  <!-- Social Media Service Header -->
  <SocialMediaServiceHeader {socialMediaService} />
  <Timeline request={socialMediaService} tp='social'/>

  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Left Column - Main Content -->
    <div class="lg:col-span-2 space-y-8">
      <!-- Social Media Service Information -->
      <SocialMediaServiceInfo {socialMediaService} {platformInfo} {addonInfo} />

      <!-- Pricing Information -->
      <SocialMediaServicePricing {socialMediaService} {pricingInfo} />
    </div>

    <!-- Right Column - Actions -->
    <div class="lg:col-span-1">
      <DetailActions 
        request={socialMediaService}
        tp="social"
        on:statusUpdate={handleStatusUpdate}
      />
    </div>
  </div>
</div>