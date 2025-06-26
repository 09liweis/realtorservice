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
    <div class="px-4 py-6 sm:px-6 lg:px-8">
      <!-- Page Content -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-4rem)]">
        <div class="p-6 sm:p-8">
          <slot />
        </div>
      </div>
    </div>
  </div>
</div>