<script lang="ts">
  import { initializeAuth } from "$lib/stores/auth";
  import { onMount } from "svelte";
  import DashboardNav from "./DashboardNav.svelte";
  import { writable } from "svelte/store";

  // Store to control mobile navigation visibility
  const showMobileNav = writable(false);

  // Toggle mobile navigation
  function toggleMobileNav() {
    showMobileNav.update(value => !value);
  }

  onMount(() => {
    initializeAuth();
  });
</script>

<div class="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
  <!-- Left Navigation - Fixed on desktop, hidden by default on mobile -->
  <div class="md:fixed md:h-screen md:w-64 md:z-10 {$showMobileNav ? 'fixed inset-0 z-50' : 'hidden md:block'}">
    <DashboardNav on:close={() => showMobileNav.set(false)} />
  </div>

  <!-- Main Content Area -->
  <div class="flex-1 md:ml-64">
    <div class="bg-white shadow-sm border border-gray-200 min-h-[calc(100vh-4rem)] p-6">
      <slot />
    </div>
  </div>
  
  <!-- Mobile Navigation Toggle Button (only visible on mobile) -->
  <button 
    onclick={toggleMobileNav}
    class="md:hidden fixed bottom-4 right-4 bg-primary text-white rounded-full p-3 shadow-lg z-20"
    aria-label="Toggle navigation"
  >
    {#if $showMobileNav}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    {/if}
  </button>
</div>