<script lang="ts">
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { getListings, getOfferProperties, getOpenHouses, getStagings } from '$lib/supabase';
    import { getPageTitle } from '$lib/types/constant';

  // Redirect if user is not logged in
  onMount(() => {
    if (!$user) {
      goto('/login');
    } else {
      loadDashboardData();
    }
  });

  // Dashboard data
  let dashboardStats = {
    totalListings: 0,
    activeListings: 0,
    soldListings: 0,
    totalOffers: 0,
    openHouses: 0,
    stagingRequests: 0
  };

  let recentActivity = [];
  let loading = true;

  // Load dashboard data
  async function loadDashboardData() {
    if (!$user) return;
    
    try {
      loading = true;
      
      // Fetch all data in parallel
      const [listingsResult, offersResult, openHousesResult, stagingsResult] = await Promise.all([
        getListings({ user_id: $user.id }),
        getOfferProperties({ user_id: $user.id }),
        getOpenHouses({ user_id: $user.id }),
        getStagings({ user_id: $user.id })
      ]);

      // Process listings data
      const listings = listingsResult.data || [];
      dashboardStats.totalListings = listings.length;
      dashboardStats.activeListings = listings.filter(l => !l.is_sold).length;
      dashboardStats.soldListings = listings.filter(l => l.is_sold).length;

      // Process other data
      dashboardStats.totalOffers = offersResult.data?.length || 0;
      dashboardStats.openHouses = openHousesResult.data?.length || 0;
      dashboardStats.stagingRequests = stagingsResult.data?.length || 0;

      // Create recent activity (mock data for now)
      recentActivity = [
        { type: 'listing', action: 'New listing added', time: '2 hours ago', icon: '🏠' },
        { type: 'offer', action: 'Offer received', time: '4 hours ago', icon: '💰' },
        { type: 'staging', action: 'Staging completed', time: '1 day ago', icon: '✨' },
        { type: 'openhouse', action: 'Open house scheduled', time: '2 days ago', icon: '🚪' }
      ];

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      loading = false;
    }
  }

  // Get user display name
  function getUserDisplayName(email: string): string {
    if (!email) return 'User';
    const name = email.split('@')[0];
    return name.split('.').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
  }

  // Get user initials
  function getUserInitials(email: string): string {
    if (!email) return 'U';
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email[0].toUpperCase();
  }

  // Quick action handlers
  function navigateToSection(path: string) {
    goto(path);
  }
</script>

<svelte:head>
  <title>{getPageTitle('Dashboard')}</title>
</svelte:head>

<div class="space-y-8">
  <!-- Welcome Header -->
  <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-6">
        <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <span class="text-2xl font-bold text-white">
            {getUserInitials($user?.email || '')}
          </span>
        </div>
        <div>
          <h1 class="text-3xl font-bold mb-2">
            Welcome back, {getUserDisplayName($user?.email || '')}!
          </h1>
          <p class="text-blue-100 text-lg">
            Here's what's happening with your real estate business today
          </p>
          <div class="flex items-center space-x-4 mt-3 text-sm text-blue-100">
            <div class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              <span>{$user?.email}</span>
            </div>
            <div class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
              </svg>
              <span>Real Estate Professional</span>
            </div>
          </div>
        </div>
      </div>
      <div class="hidden lg:block">
        <div class="text-right">
          <div class="text-3xl font-bold">{new Date().getDate()}</div>
          <div class="text-blue-100">
            {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Statistics Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Total Listings -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Total Listings</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '...' : dashboardStats.totalListings}
          </p>
          <p class="text-sm text-green-600 mt-1">
            <span class="font-medium">{dashboardStats.activeListings}</span> active
          </p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <span class="text-2xl">🏠</span>
        </div>
      </div>
      <div class="mt-4">
        <button 
          on:click={() => navigateToSection('/dashboard/listings')}
          class="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Manage Listings →
        </button>
      </div>
    </div>

    <!-- Offers -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Properties with Offers</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '...' : dashboardStats.totalOffers}
          </p>
          <p class="text-sm text-orange-600 mt-1">
            <span class="font-medium">Active</span> negotiations
          </p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <span class="text-2xl">💰</span>
        </div>
      </div>
      <div class="mt-4">
        <button 
          on:click={() => navigateToSection('/dashboard/offers')}
          class="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          Review Offers →
        </button>
      </div>
    </div>

    <!-- Open Houses -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Open Houses</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '...' : dashboardStats.openHouses}
          </p>
          <p class="text-sm text-purple-600 mt-1">
            <span class="font-medium">Scheduled</span> events
          </p>
        </div>
        <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <span class="text-2xl">🚪</span>
        </div>
      </div>
      <div class="mt-4">
        <button 
          on:click={() => navigateToSection('/dashboard/openhouses')}
          class="text-purple-600 hover:text-purple-700 text-sm font-medium"
        >
          Manage Events →
        </button>
      </div>
    </div>

    <!-- Staging Requests -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Staging Requests</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '...' : dashboardStats.stagingRequests}
          </p>
          <p class="text-sm text-pink-600 mt-1">
            <span class="font-medium">Active</span> projects
          </p>
        </div>
        <div class="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
          <span class="text-2xl">✨</span>
        </div>
      </div>
      <div class="mt-4">
        <button 
          on:click={() => navigateToSection('/dashboard/stagings')}
          class="text-pink-600 hover:text-pink-700 text-sm font-medium"
        >
          View Stagings →
        </button>
      </div>
    </div>

    <!-- Sold Properties -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Sold Properties</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '...' : dashboardStats.soldListings}
          </p>
          <p class="text-sm text-green-600 mt-1">
            <span class="font-medium">This month</span>
          </p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <span class="text-2xl">🎉</span>
        </div>
      </div>
      <div class="mt-4">
        <span class="text-green-600 text-sm font-medium">
          Great work! 🎯
        </span>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
      <div class="text-center">
        <div class="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl">⚡</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
        <p class="text-sm text-gray-600 mb-4">Get things done faster</p>
        <div class="space-y-2">
          <button 
            on:click={() => navigateToSection('/dashboard/listings')}
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Add New Listing
          </button>
          <button 
            on:click={() => navigateToSection('/dashboard/openhouses')}
            class="w-full bg-white text-gray-700 py-2 px-4 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
          >
            Schedule Open House
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Recent Activity and Performance -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Recent Activity -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <p class="text-sm text-gray-600 mt-1">Your latest business updates</p>
      </div>
      <div class="p-6">
        {#if loading}
          <div class="space-y-4">
            {#each Array(4) as _}
              <div class="animate-pulse flex items-center space-x-4">
                <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="space-y-4">
            {#each recentActivity as activity}
              <div class="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span class="text-lg">{activity.icon}</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p class="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Performance Overview -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Performance Overview</h2>
        <p class="text-sm text-gray-600 mt-1">Your business metrics at a glance</p>
      </div>
      <div class="p-6">
        <div class="space-y-6">
          <!-- Success Rate -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700">Success Rate</span>
              <span class="text-sm font-bold text-green-600">
                {dashboardStats.totalListings > 0 ? Math.round((dashboardStats.soldListings / dashboardStats.totalListings) * 100) : 0}%
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-green-500 h-2 rounded-full transition-all duration-500"
                style="width: {dashboardStats.totalListings > 0 ? (dashboardStats.soldListings / dashboardStats.totalListings) * 100 : 0}%"
              ></div>
            </div>
          </div>

          <!-- Active Listings -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700">Active Listings</span>
              <span class="text-sm font-bold text-blue-600">{dashboardStats.activeListings}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style="width: {dashboardStats.totalListings > 0 ? (dashboardStats.activeListings / dashboardStats.totalListings) * 100 : 0}%"
              ></div>
            </div>
          </div>

          <!-- Engagement Score -->
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-700">Engagement Score</h3>
                <p class="text-2xl font-bold text-gray-900 mt-1">8.5/10</p>
              </div>
              <div class="text-3xl">📈</div>
            </div>
            <p class="text-xs text-gray-600 mt-2">Based on client interactions and activity</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Tips and Recommendations -->
  <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
    <div class="flex items-start space-x-4">
      <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <span class="text-2xl">💡</span>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Today's Recommendations</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white rounded-lg p-4 border border-amber-200">
            <h4 class="font-medium text-gray-900 mb-1">Follow up on offers</h4>
            <p class="text-sm text-gray-600">You have {dashboardStats.totalOffers} properties with pending offers that need attention.</p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-amber-200">
            <h4 class="font-medium text-gray-900 mb-1">Schedule open houses</h4>
            <p class="text-sm text-gray-600">Consider scheduling open houses for your active listings to increase visibility.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>