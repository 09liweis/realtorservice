<script lang="ts">
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { getPageTitle } from '$lib/types/constant';
  import DashboardHeader from './DashboardHeader.svelte';
  import WelcomeBonusNotification from '$lib/components/dashboard/WelcomeBonusNotification.svelte';
  import ServiceStatsCard from '$lib/components/dashboard/ServiceStatsCard.svelte';
  import { sendRequest } from '$lib/helper';

  // Redirect if user is not logged in
  onMount(() => {
    loadDashboardData();
    checkForWelcomeBonus();
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

      const {data:{error, dashboardStats:data}} = await sendRequest({
        url: '/api/dashboard',
        method: 'GET'
      });

      dashboardStats = data;
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      loading = false;
    }
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
      link={'/dashboard/listings'}
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
      link={'/dashboard/offers'}
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
      link={'/dashboard/stagings'}
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
      link={'/dashboard/cleanings'}
    >
      <div class="text-sm text-gray-600 mt-1">
        <span class="font-medium">Scheduled</span> services
      </div>
    </ServiceStatsCard>
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
      link={'/dashboard/video_services'}
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
      link={'/dashboard/social_media_services'}
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
      link={'/dashboard/profile'}
    >
      <div class="text-sm text-gray-600 mt-1">
        <span class="font-medium">Balance</span> available
      </div>
    </ServiceStatsCard>
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