<script lang="ts">
  import type { SocialMediaAccount } from '$lib/types/social';
  import Button from '$lib/components/Button.svelte';

  export let accounts: SocialMediaAccount[] = [];
  export let onEdit: (index: number) => void;
  export let onDelete: (index: number) => void;

  // Function to get platform icon
  function getPlatformIcon(platform: string): string {
    const icons: Record<string, string> = {
      'Facebook': 'fab fa-facebook',
      'Twitter': 'fab fa-twitter',
      'Instagram': 'fab fa-instagram',
      'LinkedIn': 'fab fa-linkedin',
      'YouTube': 'fab fa-youtube',
      'TikTok': 'fab fa-tiktok',
      'Pinterest': 'fab fa-pinterest',
      'Other': 'fas fa-link'
    };
    return icons[platform] || icons['Other'];
  }

  // Function to format date
  function formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

{#if accounts.length === 0}
  <div class="text-center py-8 text-gray-500">
    <p>No social media accounts</p>
  </div>
{:else}
  <div class="space-y-4">
    {#each accounts as account, index}
      <div class="bg-white shadow rounded-lg p-4">
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-4">
            <div class="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
              <i class="{getPlatformIcon(account.platform)} text-xl text-gray-600"></i>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">{account.accountName}</h3>
              <div class="mt-1">
                <a
                  href={account.accountUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {account.platform} Profile
                </a>
              </div>
              {#if account.created_at}
                <p class="text-sm text-gray-500 mt-1">
                  Added on {formatDate(account.created_at)}
                </p>
              {/if}
            </div>
          </div>
          <div class="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              on:click={() => onEdit(index)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              on:click={() => onDelete(index)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  /* Ensure Font Awesome icons display correctly */
  :global(.fab),
  :global(.fas) {
    font-family: 'Font Awesome 5 Free', 'Font Awesome 5 Brands';
  }
</style>