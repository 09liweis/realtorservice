<script lang="ts">
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { 
    getListings, 
    getOfferProperties, 
    getOpenHouses, 
    getStagings,
    getCleanings,
    getUserVideoServices,
    getUserSocialMediaServices
  } from '$lib/supabase';
  import { getPageTitle } from '$lib/types/constant';
  import DashboardHeader from './DashboardHeader.svelte';
  import WelcomeBonusNotification from '$lib/components/dashboard/WelcomeBonusNotification.svelte';
  import ServiceStatsCard from '$lib/components/dashboard/ServiceStatsCard.svelte';
  import PerformanceChart from '$lib/components/dashboard/PerformanceChart.svelte';

  // Redirect if user is not logged in
  onMount(() => {
    if (!$user) {
      goto('/login');
    } else {
      loadDashboardData();
      checkForWelcomeBonus();
    }
  });

  // Dashboard data
  let dashboardStats = {
    listings: {
      total: 0,
      active: 0,
      sold: 0
    },
    services: {
      stagings: 0,
      cleanings: 0,
      videos: 0,
      social: 0
    },
    activities: {
      offers: 0,
      openHouses: 0
    },
    credits: {
      available: 0,
      used: 0
    }
  };

  let loading = true;
  let performanceData = [];

  // Welcome bonus notification
  let showWelcomeBonus = false;
  let welcomeBonusData = {
    appliedCoupons: [],
    totalCredits: 0
  };

  // Check for welcome bonus in URL params (from registration)
  function checkForWelcomeBonus() {
    const urlParams = new URLSearchParams(window.location.search);
    const welcomeCredits = urlParams.get('welcome_credits');
    const welcomeCoupons = urlParams.get('welcome_coupons');
    
    if (welcomeCredits && welcomeCoupons) {
      try {
        welcomeBonusData = {
          appliedCoupons: JSON.parse(decodeURIComponent(welcomeCoupons)),
          totalCredits: parseInt(welcomeCredits)
        };
        showWelcomeBonus = true;
        
        // Clean up URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      } catch (error) {
        console.error('Error parsing welcome bonus data:', error);
      }
    }
  }

  // Load dashboard data
  async function loadDashboardData() {
    if (!$user) return;
    
    try {
      loading = true;
      
      // Fetch all data in parallel
      const [
        listingsResult, 
        offersResult, 
        openHousesResult, 
        stagingsResult,
        cleaningsResult,
        videoResult,
        socialResult
      ] = await Promise.all([
        getListings({ user_id: $user.id }),
        getOfferProperties({ user_id: $user.id }),
        getOpenHouses({ user_id: $user.id }),
        getStagings({ user_id: $user.id }),
        getCleanings({ user_id: $user.id }),
        getUserVideoServices({ user_id: $user.id }),
        getUserSocialMediaServices({ user_id: $user.id })
      ]);

      // Process listings data
      const listings = listingsResult.data || [];
      dashboardStats.listings = {
        total: listings.length,
        active: listings.filter(l => !l.is_sold).length,
        sold: listings.filter(l => l.is_sold).length
      };

      // Process services data
      dashboardStats.services = {
        stagings: stagingsResult.data?.length || 0,
        cleanings: cleaningsResult.data?.length || 0,
        videos: videoResult.data?.length || 0,
        social: socialResult.data?.length || 0
      };

      // Process activities data
      dashboardStats.activities = {
        offers: offersResult.data?.length || 0,
        openHouses: openHousesResult.data?.length || 0
      };

      // Mock credit data (would come from API in real app)
      dashboardStats.credits = {
        available: 1250,
        used: 750
      };

      // Create performance data for chart
      performanceData = [
        { month: 'Jan', listings: 5, sales: 2 },
        { month: 'Feb', listings: 8, sales: 3 },
        { month: 'Mar', listings: 12, sales: 5 },
        { month: 'Apr', listings: 15, sales: 7 },
        { month: 'May', listings: 18, sales: 10 },
        { month: 'Jun', listings: 22, sales: 14 }
      ];

      // Create recent activity
      recentActivity = [
        { type: 'listing', action: 'New listing added', time: '2 hours ago', icon: '🏠' },
        { type: 'cleaning', action: 'Cleaning scheduled', time: '4 hours ago', icon: '🧹' },
        { type: 'video', action: 'Video service completed', time: '1 day ago', icon: '🎥' },
        { type: 'social', action: 'Social media post published', time: '2 days ago', icon: '📱' }
      ];

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      loading = false;
    }
  }

  // Navigation handlers
  function navigateToSection(path: string) {
    goto(path);
  }

  function handleCloseWelcomeBonus() {
    showWelcomeBonus = false;
  }
</script>

<svelte:head>
  <title>{getPageTitle('Dashboard')}</title>
</svelte:head>

<div class="space-y-8">
  <DashboardHeader />

  <!-- Main Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Listings Stats -->
    <ServiceStatsCard 
      title="Listings"
      value={dashboardStats.listings.total}
      change={dashboardStats.listings.active}
      changeLabel="Active"
      icon="🏠"
      color="blue"
      loading={loading}
      on:click={() => navigateToSection('/dashboard/listings')}
    >
      <div class="text-sm text-gray-600 mt-1">
        <span class="font-medium text-green-600">{dashboardStats.listings.sold}</span> sold
      </div>
    </ServiceStatsCard>

    <!-- Offers Stats -->
    <ServiceStatsCard 
      title="Offers"
      value={dashboardStats.activities.offers}
      change={0}
      icon="💰"
      color="green"
      loading={loading}
      on:click={() => navigateToSection('/dashboard/offers')}
    >
      <div class="text-sm text-gray-600 mt-1">
        <span class="font-medium">Active</span> negotiations
      </div>
    </ServiceStatsCard>

    <!-- Staging Stats -->
    <ServiceStatsCard 
      title="Staging"
      value={dashboardStats.services.stagings}
      change={0}
      icon="✨"
      color="purple"
      loading={loading}
      on:click={() => navigateToSection('/dashboard/stagings')}
    >
      <div class="text-sm text-gray-600 mt-1">
        <span class="font-medium">Active</span> projects
      </div>
    </ServiceStatsCard>

    <!-- Cleaning Stats -->
    <ServiceStatsCard 
      title="Cleaning"
      value={dashboardStats.services.cleanings}
      change={0}
      icon="🧹"
      color="orange"
      loading={loading}
      on:click={() => navigateToSection('/dashboard/cleanings')}
    >
      <div class="text-sm text-gray-600 mt-1">
        <span class="font-medium">Scheduled</span> services
      </div>
    </ServiceStatsCard>
  </div>

  <!-- Performance Section -->
  <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Performance</h2>
        <p class="text-sm text-gray-600">Your business growth over time</p>
      </div>
      <div class="flex space-x-2">
        <button class="text-xs font-medium px-3 py-1 bg-gray-100 rounded-full">6M</button>
        <button class="text-xs font-medium px-3 py-1 text-gray-500 hover:text-gray-900">1Y</button>
        <button class="text-xs font-medium px-3 py-1 text-gray-500 hover:text-gray-900">All</button>
      </div>
    </div>
    <PerformanceChart data={performanceData} loading={loading} />
  </div>

  <!-- Secondary Services Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Video Services -->
    <ServiceStatsCard 
      title="Video Services"
      value={dashboardStats.services.videos}
      change={0}
      icon="🎥"
      color="indigo"
      loading={loading}
      on:click={() => navigateToSection('/dashboard/videos')}
    >
      <div class="text-sm text-gray-600 mt-1">
        <span class="font-medium">Media</span> production
      </div>
    </ServiceStatsCard>

    <!-- Social Media -->
    <ServiceStatsCard 
      title="Social Media"
      value={dashboardStats.services.social}
      change={0}
      icon="📱"
      color="pink"
      loading={loading}
      on:click={() => navigateToSection('/dashboard/social')}
    >
      <div class="text-sm text-gray-600 mt-1">
        <span class="font-medium">Posts</span> published
      </div>
    </ServiceStatsCard>

    <!-- Credits -->
    <ServiceStatsCard 
      title="Credits"
      value={dashboardStats.credits.available}
      change={dashboardStats.credits.used}
      changeLabel="Used"
      icon="🪙"
      color="amber"
      loading={loading}
      on:click={() => navigateToSection('/dashboard/profile')}
    >
      <div class="text-sm text-gray-600 mt-1">
        <span class="font-medium">Balance</span> available
      </div>
    </ServiceStatsCard>

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
            on:click={() => navigateToSection('/dashboard/listings/new')}
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Add Listing
          </button>
          <button 
            on:click={() => navigateToSection('/dashboard/services')}
            class="w-full bg-white text-gray-700 py-2 px-4 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
          >
            Book Service
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Recommendations -->
  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
    <div class="flex items-start space-x-4">
      <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <span class="text-2xl">💡</span>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg p-4 border border-blue-200">
            <h4 class="font-medium text-gray-900 mb-1">Boost listings</h4>
            <p class="text-sm text-gray-600">Use social media to promote your active listings.</p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-blue-200">
            <h4 class="font-medium text-gray-900 mb-1">Schedule cleanings</h4>
            <p class="text-sm text-gray-600">Regular cleanings improve property presentation.</p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-blue-200">
            <h4 class="font-medium text-gray-900 mb-1">Use credits</h4>
            <p class="text-sm text-gray-600">You have {dashboardStats.credits.available} credits available to use.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Welcome Bonus Notification -->
<WelcomeBonusNotification 
  appliedCoupons={welcomeBonusData.appliedCoupons}
  totalCredits={welcomeBonusData.totalCredits}
  show={showWelcomeBonus}
  on:close={handleCloseWelcomeBonus}
/>