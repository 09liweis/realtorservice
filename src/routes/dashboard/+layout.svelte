<script lang="ts">
  import { initializeAuth } from "$lib/stores/auth";
  import { onMount } from "svelte";
  import DashboardNav from "./DashboardNav.svelte";

  onMount(() => {
    initializeAuth();
  });
</script>

<div class="min-h-screen bg-gray-50">
  <DashboardNav />

  <!-- Main Content Area -->
  <div class="max-w-7xl mx-auto px-4 pt-16">
    <!-- Page Content -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-8rem)]"
    >
      <div class="p-6 sm:p-8">
        <slot />
      </div>
    </div>
  </div>
</div>