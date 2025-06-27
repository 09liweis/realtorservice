<script lang="ts">
  import { initializeAuth } from "$lib/stores/auth";
  import { onMount } from "svelte";
  import DashboardNav from "./DashboardNav.svelte";

  onMount(() => {
    initializeAuth();
  });
</script>

<div class="min-h-screen bg-gray-50 flex flex-col md:flex-row">
  <!-- Left Navigation -->
  <div class="md:w-64">
    <DashboardNav />
  </div>

  <!-- Main Content Area -->
  <div class="flex-1 md:ml-0">
    <div class="bg-white shadow-sm border border-gray-200 min-h-[calc(100vh-4rem)] p-6">
      <slot />
    </div>
  </div>
</div>