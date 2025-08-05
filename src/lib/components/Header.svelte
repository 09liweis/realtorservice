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
    { name: "About Us", href: "/about" },
    { 
      name: "Realtor Services", 
      submenu: [
        { name: "Listing Service", href: "/realtor-services/listing",
          submenu: [
            { name: "Painting & Renovating", href: "/realtor-services/listing/painting" },
            { name: "Cleaning", href: "/realtor-services/listing/cleaning" },
            { name: "Staging", href: "/realtor-services/listing/staging" },
            { name: "Photographing & Media Services", href: "/realtor-services/listing/photographing" },
            { name: "Sign Post Installation", href: "/realtor-services/listing/sign-post" }
          ]
        },
        { name: "Social Media & Branding Service", href: "/realtor-services/social-media",
          submenu: [
            { name: "Logo/Business Card/Website Design", href: "/realtor-services/social-media/design" },
            { name: "Social Media Account Management", href: "/realtor-services/social-media/management" },
            { name: "Video Editing Service", href: "/realtor-services/social-media/video" }
          ]
        }
      ]
    },
    { 
      name: "Assignment & Coming Soon", 
      href: "/listings",
      submenu: [
        { name: "Assignment Sales Listing", href: "/listings?listing_type=Assignment Sale" },
        { name: "Coming Soon Listing", href: "/listings?listing_type=Coming Soon" }
      ]
    },
    { 
      name: "Realtor Tools", 
      submenu: [
        { name: "Mortgage Calculator", href: "/mortgage-calculator" },
        { name: "Open House Registration Tool", href: "/realtor-tools/open-house" },
        { name: "Offer Management Tool", href: "/realtor-tools/offer-management" },
        { name: "Downloadable Tools", href: "/realtor-tools/downloadable",
          submenu: [
            { name: "New Realtor Starter Kit", href: "/realtor-tools/downloadable/starter-kit" },
            { name: "Buyer Presentation Package", href: "/realtor-tools/downloadable/buyer-package" },
            { name: "Seller Presentation Package", href: "/realtor-tools/downloadable/seller-package" },
            { name: "Handbook for Landlord/Buyer/Seller", href: "/realtor-tools/downloadable/handbook" }
          ]
        }
      ]
    },
    { 
      name: "Market Insights", 
      submenu: [
        { name: "Bank of Canada Policy Rate", href: "/market-insights/bank-rate" },
        { name: "Mortgage Rate", href: "/market-insights/mortgage-rate" },
        { name: "Market Stats Update", href: "/market-insights/market-stats" },
        { name: "Policy Update", href: "/market-insights/policy-update" }
      ]
    }
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

<header
  class="bg-white border-b border-gray-100 w-full top-0 z-50 shadow-sm"
>
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center">
      <!-- Logo -->
      <Logo cssClass="h-18" />

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-8">
        {#each publicNavigation as item}
          <div class="relative group">
            <Link
              href={item.href}
              className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200 {$page
                .url.pathname === item.href
                ? 'text-primary font-semibold'
                : ''}"
            >
              {item.name}
              {#if item.submenu}
                <svg class="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              {/if}
            </Link>
            {#if item.submenu}
              <div class="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {#each item.submenu as subItem}
                  <div class="relative group">
                    <Link
                      href={subItem.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {subItem.name}
                      {#if subItem.submenu}
                        <svg class="w-4 h-4 float-right" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      {/if}
                    </Link>
                    {#if subItem.submenu}
                      <div class="absolute left-full top-0 ml-1 w-56 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        {#each subItem.submenu as nestedItem}
                          <Link
                            href={nestedItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {nestedItem.name}
                          </Link>
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
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
                class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm uppercase"
              >
                {$user?.initial}
              </div>
              <span class="hidden md:block text-sm font-medium text-gray-700">
                {$user?.name}
              </span>
            </button>

            {#if userMenuOpen}
              <div
                class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
              >
                <div class="px-4 py-3 border-b border-gray-100">
                  <div class="text-sm font-medium text-gray-900">
                    {$user?.name}
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
            className="border text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
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
        {#each publicNavigation as item}
          <div class="space-y-1">
            <Link
              href={item.href}
              onclick={() => (mobileMenuOpen = false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
            >
              {item.name}
            </Link>
            {#if item.submenu}
              <div class="pl-4 space-y-1">
                {#each item.submenu as subItem}
                  <div class="space-y-1">
                    <Link
                      href={subItem.href}
                      onclick={() => (mobileMenuOpen = false)}
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
                    >
                      {subItem.name}
                    </Link>
                    {#if subItem.submenu}
                      <div class="pl-4 space-y-1">
                        {#each subItem.submenu as nestedItem}
                          <Link
                            href={nestedItem.href}
                            onclick={() => (mobileMenuOpen = false)}
                            className="block px-3 py-2 rounded-md text-xs font-medium text-gray-500 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
                          >
                            {nestedItem.name}
                          </Link>
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
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

<!-- Click outside handler for user menu -->
{#if userMenuOpen}
  <div class="fixed inset-0 z-40" onclick={() => (userMenuOpen = false)}></div>
{/if}