<script lang="ts">
  import type { SocialMediaService } from "$lib/types/social";
  import SocialMediaServiceCard from "./SocialMediaServiceCard.svelte";

  export let socialMediaServices: SocialMediaService[] = [];
  export let loading = false;

</script>

{#if loading}
  <div class="flex justify-center py-12">
    <div
      class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"
    ></div>
  </div>
{:else if socialMediaServices.length === 0}
  <!-- Empty State -->
  <div class="text-center py-12 px-6">
    <div
      class="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
    >
      <svg
        class="h-8 w-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002 2V8M7 8h10M9 12h6m-6 4h6"
        ></path>
      </svg>
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">
      No social media services
    </h3>
    <p class="text-gray-500 text-sm">
      Create your first social media management service to boost your online
      presence.
    </p>
  </div>
{:else}
  <!-- Service Cards Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each socialMediaServices as service (service.id)}
      <SocialMediaServiceCard {service} on:edit on:delete />
    {/each}
  </div>
{/if}
