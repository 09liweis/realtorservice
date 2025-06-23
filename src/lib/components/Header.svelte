<script>
  import { page } from "$app/stores";
  import { user, signOut } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import { derived } from "svelte/store";
  import Link from "$lib/components/Link.svelte";
    import Logo from "./Logo.svelte";

  let mobileMenuOpen = $state(false);
  let userMenuOpen = $state(false);

  // Public navigation items
  const publicNavigation = [
    { name: "Listings", href: "/listings" },
    { name: "Services", href: "#services" },
    { name: "About", href: "/about" },
  ];

  // Navigation items for logged-in users
  const privateNavigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Listings", href: "/dashboard/listings" },
    { name: "Offers", href: "/dashboard/offers" },
  ];

  // Get navigation items based on login status
  const navigation = derived(user, ($user) =>
    $user ? [...publicNavigation, ...privateNavigation] : publicNavigation,
  );

  async function handleSignOut() {
    const { success } = await signOut();
    if (success) {
      goto("/");
      userMenuOpen = false;
    }
  }
</script>

{#if !$page.url.pathname.startsWith("/dashboard")}
  <header
    class="bg-white border-b border-gray-100 fixed w-full top-0 z-50 shadow-sm"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <Logo cssClass="h-18" />

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          {#each publicNavigation as item}
            <Link
              href={item.href}
              className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200 {$page
                .url.pathname === item.href
                ? 'text-primary font-semibold'
                : ''}"
            >
              {item.name}
            </Link>
          {/each}
        </div>

        <!-- Auth Buttons / User Menu -->
        <div class="flex items-center space-x-4">
          {#if $user}
            <!-- User Menu -->
            <div class="relative">
              <button
                onclick={() => (userMenuOpen = !userMenuOpen)}
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div
                  class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm"
                >
                  {$user.email?.split("@")[0]?.[0]?.toUpperCase() || "U"}
                </div>
                <span class="hidden md:block text-sm font-medium text-gray-700">
                  {$user.email?.split("@")[0] || "User"}
                </span>
              </button>

              {#if userMenuOpen}
                <div
                  class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div class="px-4 py-3 border-b border-gray-100">
                    <div class="text-sm font-medium text-gray-900">
                      {$user.email?.split("@")[0] || "User"}
                    </div>
                    <div class="text-xs text-gray-500">
                      {$user.email}
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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
                      />
                    </svg>
                    Dashboard
                  </Link>
                  <div class="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onclick={handleSignOut}
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
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            <!-- Login/Register Buttons -->
            <div class="flex items-center space-x-3">
              <Link
                href="/login"
                className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Register
              </Link>
            </div>
          {/if}
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
            class="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      {#if mobileMenuOpen}
        <div class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <!-- Mobile Auth Section -->
            {#if $user}
              <div class="border-t border-gray-200 mt-4 pt-4">
                <div class="px-3 py-2 text-sm text-gray-500">
                  {$user.email}
                </div>
                <button
                  onclick={() => {
                    handleSignOut();
                    mobileMenuOpen = false;
                  }}
                  class="text-red-600 hover:text-red-800 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign Out
                </button>
              </div>
            {:else}
              <div class="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <Link
                  href="/login"
                  onclick={() => (mobileMenuOpen = false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onclick={() => (mobileMenuOpen = false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary-hover transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </nav>
  </header>
{/if}

<!-- Click outside handler for user menu -->
{#if userMenuOpen}
  <div class="fixed inset-0 z-40" onclick={() => (userMenuOpen = false)}></div>
{/if}
