<script lang="ts">
    import { fade } from "svelte/transition";

  export let variant: 'default' | 'detail' = 'default';
</script>

{#if variant === 'detail'}
  <!-- Detail Page Skeleton -->
  <div class="space-y-6 animate-pulse" in:fade={{ duration: 300 }}>
    <!-- Back Navigation Skeleton -->
    <div class="h-8 bg-gray-200 rounded w-24"></div>

    <!-- Header Section Skeleton -->
    <div class="h-16 bg-gray-200 rounded-xl"></div>

    <!-- Timeline Skeleton -->
    <div class="h-12 bg-gray-200 rounded-xl"></div>

    <!-- Content Grid Skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column Skeleton -->
      <div class="lg:col-span-2 space-y-6">
        <div class="h-64 bg-gray-200 rounded-xl"></div>
        <div class="h-32 bg-gray-200 rounded-xl"></div>
        <div class="h-24 bg-gray-200 rounded-xl"></div>
      </div>

      <!-- Right Column Skeleton -->
      <div class="lg:col-span-1">
        <div class="h-32 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  </div>
{:else}
  <!-- Default Skeleton -->
  <div class="flex justify-center items-center py-12">
    <div class="relative">
      <div class="animate-spin rounded-full h-12 w-12 border-2 border-gray-200"></div>
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600 absolute top-0 left-0"></div>
    </div>
  </div>
{/if}