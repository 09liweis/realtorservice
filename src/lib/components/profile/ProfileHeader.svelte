<script lang="ts">
  import { formatUserName, getUserInitials } from '$lib/helper';
  import type { UserProfile } from '$lib/types/user';
  export let profile: UserProfile;

  function getApprovalStatusStyle(approved: boolean): string {
    return approved 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
</script>

<div class="bg-primary rounded-2xl p-6 flex items-center space-x-4">
  <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
    {getUserInitials(profile)}
  </div>
  <div class="text-white">
    <h1 class="text-3xl font-bold mb-2">
      {formatUserName(profile)}
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