<script lang="ts">
  import { page } from "$app/stores";
  import { user, signOut } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import Logo from "$lib/components/Logo.svelte";
  import Link from "$lib/components/Link.svelte";
  import { derived } from "svelte/store";
  import { createEventDispatcher } from "svelte";
  import { scale } from 'svelte/transition';
  import { spring } from 'svelte/motion';
    import { DASHBOARD_STAGINGS_URL } from "$lib/types/constant";

  // Create event dispatcher for close events
  const dispatch = createEventDispatcher();

  // Spring animation for hover effect
  const hoverScale = spring({ x: 1, y: 1 });

  // Base navigation items with icons and descriptions
  const baseNavItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "🏠",
      description: "Overview & Analytics",
    },
    {
      name: "Social Media",
      href: "/dashboard/social_media_services",
      icon: "🌐",
      description: "Manage Social Links",
    },
    {
      name: "Video Services",
      href: "/dashboard/video_services",
      icon: "🎬",
      description: "Video Editing Services",
    },
    {
      name: "Stagings",
      href: DASHBOARD_STAGINGS_URL,
      icon: "✨",
      description: "Property Staging",
    },
    {
      name: "Cleanings",
      href: "/dashboard/cleanings",
      icon: "🧽",
      description: "Cleaning Services",
    }
  ];

  // Admin navigation item
  const adminNavItem = {
    name: "Admin Panel",
    href: "/dashboard/admin",
    icon: "⚙️",
    description: "System Administration",
  };

  const realtorNavItems = [
    {
      name: "Listings",
      href: "/dashboard/listings",
      icon: "📋",
      description: "Manage Properties",
    },
    {
      name: "Open Houses",
      href: "/dashboard/openhouses",
      icon: "🚪",
      description: "Schedule & Track",
    },
    {
      name: "Offers",
      href: "/dashboard/offers",
      icon: "💰",
      description: "Review & Negotiate",
    },
  ]

  // Derive navigation items based on user role
  $: navItems = $user?.isAdmin 
    ? [...baseNavItems, adminNavItem] 
    : [...baseNavItems, ...realtorNavItems];

  // Check if current path matches navigation item
  function isActive(href: string) {
    if (href === "/dashboard") {
      return $page.url.pathname === href;
    }
    return $page.url.pathname.startsWith(href);
  }

  // Handle sign out
  async function handleSignOut() {
    const { success } = await signOut();
    if (success) {
      goto("/");
    }
  }
</script>

<!-- Left Sidebar Navigation -->
<nav class="h-full bg-white border-r border-gray-200 flex flex-col w-full md:w-64 overflow-hidden">
  <!-- Logo and Brand -->
  <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
    <!-- Close button for mobile -->
    <button 
      class="md:hidden text-gray-500 hover:text-gray-700 transition-transform duration-300 ease-in-out hover:rotate-90"
      onclick={() => dispatch('close')}
      aria-label="Close navigation"
      in:scale={{ duration: 200, start: 0.5 }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <!-- User Profile -->
  <div class="px-6 py-4 border-b border-gray-200">
    <div class="flex items-center space-x-3">
      <div>
        <div class="text-sm font-medium text-gray-900">
          {$user?.name || "User"}
        </div>
        <div class="text-xs text-gray-500">Real Estate Agent</div>
      </div>
    </div>
  </div>

  <!-- Navigation Items -->
  <div class="flex-1 overflow-y-auto">
    <div class="px-2 py-4 space-y-1">
      {#each navItems as item, i}
        <div in:scale={{delay: 100 + i * 50, duration: 300, start: 0.95}}>
          <Link
            href={item.href}
            className="space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform {isActive(
              item.href,
            )
              ? 'bg-blue-50 text-blue-700 translate-x-1'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:translate-x-1'}"
          >
            <span class="text-lg transition-transform duration-300 ease-in-out {isActive(item.href) ? 'scale-110' : 'hover:scale-110'}">{item.icon}</span>
            <div class="hidden md:block">
              <div>{item.name}</div>
              <div class="text-xs text-gray-500">{item.description}</div>
            </div>
            <div class="md:hidden text-sm font-medium">{item.name}</div>
          </Link>
        </div>
      {/each}
    </div>
  </div>

  <!-- Bottom Actions -->
  <div class="px-2 py-4 border-t border-gray-200 space-y-1">
    <div in:scale={{delay: 300, duration: 300, start: 0.95}}>
      <Link
        href="/dashboard/profile"
        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 ease-in-out transform hover:translate-x-1"
      >
        <svg
          class="w-5 h-5 text-gray-400 transition-transform duration-300 ease-in-out hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          ></path>
        </svg>
        <span>Profile Settings</span>
      </Link>
    </div>
    
    <div in:scale={{delay: 350, duration: 300, start: 0.95}}>
      <Link
        href="/"
        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 ease-in-out transform hover:translate-x-1"
      >
        <svg
          class="w-5 h-5 text-gray-400 transition-transform duration-300 ease-in-out hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          ></path>
        </svg>
        <span>Back to Website</span>
      </Link>
    </div>
    
    <div in:scale={{delay: 400, duration: 300, start: 0.95}}>
      <button
        onclick={handleSignOut}
        class="cursor-pointer flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-300 ease-in-out transform hover:translate-x-1"
      >
        <svg
          class="w-5 h-5 text-red-500 transition-transform duration-300 ease-in-out hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          ></path>
        </svg>
        <span>Sign Out</span>
      </button>
    </div>
  </div>
</nav>

<style>
  /* Smooth transitions for all interactive elements */
  * {
    transition-property: color, background-color, border-color,
      text-decoration-color, fill, stroke, opacity, box-shadow, transform,
      filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }

  /* Custom scrollbar for better aesthetics */
  :global(html) {
    scroll-behavior: smooth;
  }

  :global(::-webkit-scrollbar) {
    width: 6px;
    height: 6px;
  }

  :global(::-webkit-scrollbar-track) {
    background: #f1f5f9;
  }

  :global(::-webkit-scrollbar-thumb) {
    background: #cbd5e1;
    border-radius: 3px;
  }

  :global(::-webkit-scrollbar-thumb:hover) {
    background: #94a3b8;
  }
</style>