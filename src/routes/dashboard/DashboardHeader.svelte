<script lang="ts">
  import { user } from '$lib/stores/auth';
</script>

<div class="bg-primary rounded-2xl p-8 text-white">
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-6">
      <div>
        <h1 class="text-3xl font-bold mb-2">
          Welcome back, {($user?.name || '')}!
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