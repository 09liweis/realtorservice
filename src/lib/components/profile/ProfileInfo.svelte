<script lang="ts">
  import { user } from '$lib/stores/auth';
  import Button from '$lib/components/common/Button.svelte';
  import Input from '$lib/components/common/Input.svelte';
  import type { UserProfile } from '$lib/types/user';
  import { sendRequest } from '$lib/helper';

  export let profile: UserProfile;
  export let isEditing: boolean;
  export let loading: boolean;
  export let saving: boolean;
  export let error: string;
  export let successMessage: string;

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
  }
</script>

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