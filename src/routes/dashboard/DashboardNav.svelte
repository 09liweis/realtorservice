<script lang="ts">
  import { page } from "$app/stores";
  import { user, signOut } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import Logo from "$lib/components/Logo.svelte";

  // Navigation items with icons and descriptions
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "🏠",
      description: "Overview & Analytics",
    },
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
    {
      name: "Stagings",
      href: "/dashboard/stagings",
      icon: "✨",
      description: "Property Staging",
    },
  ];

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

  // Get user initials for avatar
  function getUserInitials(email: string): string {
    if (!email) return "U";
    const parts = email.split("@")[0].split(".");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email[0].toUpperCase();
  }
</script>

<!-- Left Sidebar Navigation -->
<nav class="h-full bg-white border-r border-gray-200 flex flex-col">
  <!-- Logo and Brand -->
  <div class="px-6 py-4 border-b border-gray-200">
    <Logo size="md" showText={true} />
  </div>

  <!-- User Profile -->
  <div class="px-6 py-4 border-b border-gray-200">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
        {getUserInitials($user?.email || "")}
      </div>
      <div>
        <div class="text-sm font-medium text-gray-900">
          {$user?.email?.split("@")[0] || "User"}
        </div>
        <div class="text-xs text-gray-500">Real Estate Agent</div>
      </div>
    </div>
  </div>

  <!-- Navigation Items -->
  <div class="flex-1 overflow-y-auto">
    <div class="px-2 py-4 space-y-1">
      {#each navItems as item}
        <a
          href={item.href}
          class="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 {isActive(
            item.href,
          )
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}"
        >
          <span class="text-lg">{item.icon}</span>
          <div>
            <div>{item.name}</div>
            <div class="text-xs text-gray-500">{item.description}</div>
          </div>
        </a>
      {/each}
    </div>
  </div>

  <!-- Bottom Actions -->
  <div class="px-2 py-4 border-t border-gray-200 space-y-1">
    <a
      href="/dashboard/profile"
      class="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    >
      <svg
        class="w-5 h-5 text-gray-400"
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
    </a>
    <a
      href="/"
      class="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    >
      <svg
        class="w-5 h-5 text-gray-400"
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
    </a>
    <button
      on:click={handleSignOut}
      class="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
    >
      <svg
        class="w-5 h-5 text-red-500"
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