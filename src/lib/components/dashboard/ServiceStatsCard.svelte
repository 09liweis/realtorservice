<script lang="ts">
  import { user } from '$lib/stores/auth';
  import { fade } from 'svelte/transition';

  export let title: string;
  export let value: number | { count: number, is_user_unread?: boolean, is_admin_unread?: boolean };
  export let change: number;
  export let changeLabel: string = '';
  export let icon: string;
  export let color: string;
  export let loading: boolean;
  
  // Color mappings
  const colorClasses = {
    bg: {
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      purple: 'bg-purple-100',
      orange: 'bg-orange-100',
      indigo: 'bg-indigo-100',
      pink: 'bg-pink-100',
      amber: 'bg-amber-100'
    },
    text: {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      indigo: 'text-indigo-600',
      pink: 'text-pink-600',
      amber: 'text-amber-600'
    },
    hover: {
      blue: 'hover:bg-blue-50',
      green: 'hover:bg-green-50',
      purple: 'hover:bg-purple-50',
      orange: 'hover:bg-orange-50',
      indigo: 'hover:bg-indigo-50',
      pink: 'hover:bg-pink-50',
      amber: 'hover:bg-amber-50'
    }
  };
</script>

<div 
  transition:fade
  class="bg-white relative rounded-xl shadow-sm p-6 border border-gray-200 cursor-pointer {colorClasses.hover[color]} transition-colors duration-200"
>
  {#if typeof value !== 'number' && (value.is_user_unread || value.is_admin_unread)}
    <div class="flex space-x-2 mt-2 absolute top-0 right-0 z-10">
      {#if $user?.isAdmin}
        <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">{value.is_admin_unread}</span>
      {:else}
        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{value.is_user_unread}</span>
      {/if}
    </div>
  {/if}
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm font-medium text-gray-600">{title}</p>
      <p class="text-3xl font-bold text-gray-900 mt-2">
        {loading ? '...' : typeof value === 'number' ? value.toLocaleString() : value.count.toLocaleString()}
      </p>
      
      {#if changeLabel}
        <p class="text-sm {colorClasses.text[color]} mt-1">
          <span class="font-medium">{change}</span> {changeLabel}
        </p>
      {/if}
      <slot />
    </div>
    <div class="w-12 h-12 {colorClasses.bg[color]} rounded-xl flex items-center justify-center">
      <span class="text-2xl">{icon}</span>
    </div>
  </div>
</div>