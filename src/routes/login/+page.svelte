<script>
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/auth';
  import { onMount } from 'svelte';

  // Redirect to dashboard if user is already logged in
  onMount(() => {
    if ($user) {
      goto('/dashboard');
    }
  });

  // Form data
  let email = '';
  let password = '';
  
  // Error and loading states
  let error = '';
  let loading = false;

  // Handle form submission
  async function handleLogin() {
    // Reset error
    error = '';
    loading = true;

    try {
      // Sign in user with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      // Login successful, redirect to dashboard
      if (data) {
        goto('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      error = err.message || 'Login failed, please check your credentials';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Login - Real Estate Agent Service</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
    <div>
      <h2 class="text-center text-3xl font-extrabold text-gray-800">
        Sign in to your account
      </h2>
      <p class="mt-3 text-center text-sm text-gray-600">
        or
        <a href="/register" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
          Create new account
        </a>
      </p>
    </div>
    
    <form class="mt-8 space-y-5" on:submit|preventDefault={handleLogin}>
      <div class="space-y-4">
        <div>
          <label for="email-address" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autocomplete="email"
            required
            bind:value={email}
            class="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ease-in-out sm:text-sm"
            placeholder="Email address"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            bind:value={password}
            class="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ease-in-out sm:text-sm"
            placeholder="Password"
          />
        </div>
      </div>

      <div class="flex items-center justify-between mt-4">
        <div class="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <a href="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            Forgot password?
          </a>
        </div>
      </div>

      {#if error}
        <div class="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg border border-red-100 transition-all duration-300">{error}</div>
      {/if}

      <div class="mt-6">
        <button
          type="submit"
          disabled={loading}
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
        >
          {#if loading}
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            Signing in...
          {:else}
            Sign in
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>