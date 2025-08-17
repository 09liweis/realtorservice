<script lang="ts">
  import { user } from '$lib/stores/auth';
  import { getPageTitle } from '$lib/types/constant';
  import Button from '$lib/components/common/Button.svelte';
  import Input from '$lib/components/common/Input.svelte';
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
  let isEditing = false;
  let loading = false;
  let saving = false;
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

  async function handleSave() {
    if (!$user) return;
    
    try {
      saving = true;
      error = '';
      successMessage = '';
      
      const { data } = await sendRequest({
        url: '/api/user',
        method: 'PUT',
        body:{
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          brokerage: profile.brokerage,
          reco_number: profile.reco_number,
        }
      });
      
      if (data.error) {
        throw data.error;
      }
      
      successMessage = 'Profile updated successfully!';
      isEditing = false;
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage = '';
      }, 3000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      error = 'Failed to update profile';
    } finally {
      saving = false;
    }
  }

  function handleCancel() {
    isEditing = false;
    error = '';
    successMessage = '';
    // Reload profile to reset any changes
    loadUserProfile();
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

  function getInitials(firstName: string, lastName: string): string {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || '?';
  }

  function getApprovalStatusStyle(approved: boolean): string {
    return approved 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Profile Information</h2>
          {#if !isEditing}
            <Button onclick={() => isEditing = true} variant="secondary" class_name="px-4 py-2">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit Profile
            </Button>
          {/if}
        </div>

        <div class="p-6">
          {#if loading}
            <div class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          {:else if error}
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p>{error}</p>
            </div>
          {:else}
            
            {#if successMessage}
              <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  {successMessage}
                </div>
              </div>
            {/if}

            {#if isEditing}
              <!-- Edit Form -->
              <form on:submit|preventDefault={handleSave} class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    id="first_name"
                    label="First Name"
                    type="text"
                    bind:value={profile.first_name}
                    required={true}
                    disabled={saving}
                  />
                  
                  <Input
                    id="last_name"
                    label="Last Name"
                    type="text"
                    bind:value={profile.last_name}
                    required={true}
                    disabled={saving}
                  />
                </div>

                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  bind:value={profile.email}
                  disabled={true}
                  classes="bg-gray-50"
                />
                <p class="text-xs text-gray-500 -mt-4">Email cannot be changed. Contact support if you need to update your email.</p>

                <Input
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  bind:value={profile.phone}
                  disabled={saving}
                />

                <Input
                  id="brokerage"
                  label="Brokerage"
                  type="text"
                  bind:value={profile.brokerage}
                  disabled={saving}
                />

                <Input
                  id="reco_number"
                  label="RECO Number"
                  type="text"
                  bind:value={profile.reco_number}
                  disabled={saving}
                />

                <div class="flex items-center justify-end space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onclick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    loading={saving}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            {:else}
              <!-- View Mode -->
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <p class="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profile.first_name || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <p class="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profile.last_name || 'Not provided'}</p>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <p class="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profile.email || 'Not provided'}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <p class="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profile.phone || 'Not provided'}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Brokerage</label>
                  <p class="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profile.brokerage || 'Not provided'}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">RECO Number</label>
                  <p class="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg font-mono text-sm">{profile.reco_number || 'Not provided'}</p>
                </div>
              </div>
            {/if}
          {/if}
        </div>
      </div>

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