<script lang="ts">
  import { getPageTitle } from '$lib/types/constant';
  import Button from '$lib/components/common/Button.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
  import { onMount } from 'svelte';
  import type { UserProfile } from '$lib/types/user';
  import CreditTopup from '$lib/components/credit/CreditTopup.svelte';
  import CreditHistory from '$lib/components/CreditHistory.svelte';
    import { sendRequest } from '$lib/helper';
    import type { CreditRecord } from '$lib/types/credit';
    import ProfileHeader from '$lib/components/profile/ProfileHeader.svelte';
    import AccountStatus from '$lib/components/profile/AccountStatus.svelte';
    import QuickActions from '$lib/components/profile/QuickActions.svelte';
    import ContactSupport from '$lib/components/profile/ContactSupport.svelte';
    import ProfileInfo from '$lib/components/profile/ProfileInfo.svelte';

  // Profile data
  let profile:UserProfile = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    brokerage: '',
    reco_number: '',
    role: 'realtor',
    realtor_approved: false,
    credits: 0
  };

  // Form state
  let loading = false;
  let error = '';
  let successMessage = '';
  let showTopup = false;
  let loadingCredits = false;

  // Load user profile on mount
  onMount(() => {
    loadUserProfile();
  });

  let loadingCreditRecords = false;
  let creditRecords: CreditRecord[] = [];

  async function loadUserProfile() {    
    try {
      loading = true;
      loadingCredits = true;
      error = '';
      
      const { data } = await sendRequest({
        url:'/api/user',
        method: 'GET'
      })
      
      if (data.error) {
        throw data.error;
      }
      
      profile = data.userProfile;
      creditRecords = data.creditRecords;
    } catch (err) {
      console.error('Error loading profile:', err);
      error = 'Failed to load profile data';
    } finally {
      loading = false;
      loadingCredits = false;
    }
  }

  function handleTopupSuccess(event: CustomEvent) {
    const { amount } = event.detail;
    showTopup = false;
    successMessage = `Successfully added $${amount} to your account!`;
    loadUserProfile();
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage = '';
    }, 5000);
  }
</script>

<svelte:head>
  <title>{getPageTitle('Profile')}</title>
</svelte:head>

<div class="space-y-8">
  <!-- Page Header -->
  <ProfileHeader {profile} />

  <!-- Profile Content -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    <!-- Main Profile Information -->
    <div class="lg:col-span-2 space-y-4">
      <ProfileInfo {profile} />

      <AccountStatus {profile} />

      <QuickActions />

      <ContactSupport />
      
    </div>

    <!-- Sidebar Information -->
    <div class="space-y-6">
      
      <!-- Credits Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Account Credits</h3>
        </div>
        <div class="p-6">
          <div class="text-center mb-6">
            <div class="text-4xl font-bold text-blue-600 mb-2">
              {#if loadingCredits}
                <div class="animate-pulse bg-gray-200 h-12 w-24 mx-auto rounded"></div>
              {:else}
                {profile.credits}
              {/if}
            </div>
            <p class="text-gray-600">Available Credits</p>
          </div>
          
          <Button 
            onclick={() => showTopup = true}
            class_name="w-full"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Credits
          </Button>
          
          <div class="mt-4 text-center text-sm text-gray-500">
            <p>Use credits for premium features and services</p>
          </div>
        </div>
      </div>

      <!-- Credit History Section -->
      <CreditHistory {loadingCreditRecords} {creditRecords} />
    </div>
  </div>
</div>

<!-- Topup Modal -->
{#if showTopup}
  <FormBackdrop handleClose={() => showTopup = false}>
    <CreditTopup 
      on:success={handleTopupSuccess}
      on:close={() => showTopup = false}
    />
  </FormBackdrop>
{/if}