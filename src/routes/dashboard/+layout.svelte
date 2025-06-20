<script lang="ts">
  import { page } from "$app/stores";
  import { user, signOut } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import { initializeAuth } from "$lib/stores/auth";
  import { onMount } from "svelte";

  onMount(() => {
    initializeAuth();
  });

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

  // Mobile menu state
  let mobileMenuOpen = false;
  let userMenuOpen = false;

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

  // Close mobile menu when clicking outside
  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

  // Close user menu when clicking outside
  function closeUserMenu() {
    userMenuOpen = false;
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Top Navigation Bar -->
  <nav
    class="bg-white border-b border-gray-200 fixed w-full top-0 z-50 shadow-sm"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="flex items-center space-x-2">
              <div
                class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center"
              >
                <span class="text-white font-bold text-sm">RS</span>
              </div>
              <span class="text-xl font-bold text-gray-900 hidden sm:block"
                >Realtor Service</span
              >
            </a>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          {#each navItems as item}
            <a
              href={item.href}
              class="group relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 {isActive(
                item.href,
              )
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}"
            >
              <div class="flex items-center space-x-2">
                <span class="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </div>
              {#if isActive(item.href)}
                <div
                  class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                ></div>
              {/if}
            </a>
          {/each}
        </div>

        <!-- User Menu and Mobile Menu Button -->
        <div class="flex items-center space-x-4">
          <!-- User Menu -->
          <div class="relative">
            <button
              on:click={() => (userMenuOpen = !userMenuOpen)}
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div
                class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm"
              >
                {getUserInitials($user?.email || "")}
              </div>
              <div class="hidden sm:block text-left">
                <div class="text-sm font-medium text-gray-900">
                  {$user?.email?.split("@")[0] || "User"}
                </div>
                <div class="text-xs text-gray-500">Real Estate Agent</div>
              </div>
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            <!-- User Dropdown Menu -->
            {#if userMenuOpen}
              <div
                class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
              >
                <div class="px-4 py-3 border-b border-gray-100">
                  <div class="text-sm font-medium text-gray-900">
                    {$user?.email?.split("@")[0] || "User"}
                  </div>
                  <div class="text-xs text-gray-500">{$user?.email}</div>
                </div>
                <a
                  href="/dashboard/profile"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <svg
                    class="w-4 h-4 mr-3 text-gray-400"
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
                  Profile Settings
                </a>
                <a
                  href="/"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <svg
                    class="w-4 h-4 mr-3 text-gray-400"
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
                  Back to Website
                </a>
                <div class="border-t border-gray-100 mt-2 pt-2">
                  <button
                    on:click={handleSignOut}
                    class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <svg
                      class="w-4 h-4 mr-3"
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
                    Sign Out
                  </button>
                </div>
              </div>
            {/if}
          </div>

          <!-- Mobile Menu Button -->
          <button
            on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
            class="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {#if mobileMenuOpen}
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              {:else}
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              {/if}
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    {#if mobileMenuOpen}
      <div class="md:hidden border-t border-gray-200 bg-white">
        <div class="px-4 py-3 space-y-1">
          {#each navItems as item}
            <a
              href={item.href}
              on:click={closeMobileMenu}
              class="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 {isActive(
                item.href,
              )
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}"
            >
              <span class="text-xl">{item.icon}</span>
              <div>
                <div>{item.name}</div>
                <div class="text-xs text-gray-500">{item.description}</div>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </nav>

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

<!-- Click outside handlers -->
{#if userMenuOpen}
  <div class="fixed inset-0 z-40" on:click={closeUserMenu}></div>
{/if}

{#if mobileMenuOpen}
  <div class="fixed inset-0 z-30 md:hidden" on:click={closeMobileMenu}></div>
{/if}

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
