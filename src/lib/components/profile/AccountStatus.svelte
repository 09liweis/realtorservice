<script lang="ts">
  import type { UserProfile } from '$lib/types/user';
  import { formatDate } from '$lib/helper';

  export let profile: UserProfile;

  function getApprovalStatusStyle(approved: boolean): string {
    return approved 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
</script>

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