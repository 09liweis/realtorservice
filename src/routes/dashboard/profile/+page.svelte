<script lang="ts">
  import { user } from '$lib/stores/auth';
  import { getUserProfile, updateUserProfile, getUserCredits, getCreditRecords } from '$lib/supabase';
  import { getPageTitle } from '$lib/types/constant';
  import Button from '$lib/components/common/Button.svelte';
  import Input from '$lib/components/common/Input.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
  import { onMount } from 'svelte';
  import type { UserProfile } from '$lib/types/user';
  import CreditTopup from '$lib/components/credit/CreditTopup.svelte';
  import CreditHistory from '$lib/components/CreditHistory.svelte';
    import { formatDate, sendRequest } from '$lib/helper';
    import type { CreditRecord } from '$lib/types/credit';

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
      
      const { error: updateError } = await updateUserProfile($user.id, {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        brokerage: profile.brokerage,
        reco_number: profile.reco_number,
        updated_at: new Date().toISOString()
      });
      
      if (updateError) {
        throw updateError;
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
  <div class="bg-primary rounded-2xl p-8 flex items-center space-x-6">
    <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
      {getInitials(profile.first_name, profile.last_name)}
    </div>
    <div class="text-white">
      <h1 class="text-3xl font-bold mb-2">
        {profile.first_name} {profile.last_name}
      </h1>
      <p class="text-blue-100 text-lg">{profile.role === 'realtor' ? 'Real Estate Professional' : profile.role}</p>
      <div class="flex items-center space-x-4 mt-2">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border {getApprovalStatusStyle(profile.realtor_approved)}">
          {#if profile.realtor_approved}
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            Approved Realtor
          {:else}
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
            </svg>
            Pending Approval
          {/if}
        </span>
      </div>
    </div>
  </div>

  <!-- Profile Content -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    <!-- Main Profile Information -->
    <div class="lg:col-span-2">
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

      <!-- Account Status -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Account Status</h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-600">Account Type</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
              {profile.role}
            </span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-600">Approval Status</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getApprovalStatusStyle(profile.realtor_approved)}">
              {profile.realtor_approved ? 'Approved' : 'Pending'}
            </span>
          </div>

          {#if profile.created_at}
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-600">Member Since</span>
              <span class="text-sm text-gray-900">{formatDate(profile.created_at)}</span>
            </div>
          {/if}

          {#if !profile.realtor_approved}
            <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-yellow-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                <div>
                  <h4 class="text-sm font-medium text-yellow-800">Pending Approval</h4>
                  <p class="text-sm text-yellow-700 mt-1">Your realtor account is pending approval. You'll receive an email once approved.</p>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div class="p-6 space-y-3">
          <a 
            href="/dashboard/listings" 
            class="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Manage Listings
          </a>
          
          <a 
            href="/dashboard/offers" 
            class="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
            View Offers
          </a>
          
          <a 
            href="/dashboard/openhouses" 
            class="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4l2 2 4-4m-6 4h6m-6 4h6"></path>
            </svg>
            Open Houses
          </a>
          
          <a 
            href="/dashboard/stagings" 
            class="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
            </svg>
            Staging Requests
          </a>
        </div>
      </div>

      <!-- Contact Support -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div class="text-center">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p class="text-sm text-gray-600 mb-4">
            Contact our support team for assistance with your account or platform features.
          </p>
          <a 
            href="mailto:support@realtorservice.ca" 
            class="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Contact Support
          </a>
        </div>
      </div>
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