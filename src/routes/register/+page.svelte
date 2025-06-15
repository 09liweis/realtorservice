<script>
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import Button from '$lib/components/Button.svelte';

  // If user is already logged in, redirect to dashboard
  onMount(() => {
    if ($user) {
      goto('/dashboard');
    }
  });

  // Form data
  let firstName = '';
  let lastName = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  
  // Error and loading states
  let error = '';
  let loading = false;
  let passwordsMatch = true;

  // Handle form submission
  async function handleRegister() {
    // Reset error
    error = '';
    
    // Validate password match
    if (password !== confirmPassword) {
      passwordsMatch = false;
      error = 'Passwords do not match';
      return;
    }
    
    passwordsMatch = true;
    loading = true;

    try {
      // Register user with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (signUpError) throw signUpError;

      // Registration successful
      if (data) {
        // Note: Email verification may be required based on Supabase settings
        goto('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      error = err.message || 'An error occurred during registration';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Register - Real Estate Agent Service</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
    <div>
      <h2 class="text-center text-3xl font-extrabold text-gray-800">
        Create Your Account
      </h2>
      <p class="mt-3 text-center text-sm text-gray-600">
        or
        <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
          Already have an account? Log in
        </a>
      </p>
    </div>
    
    <form class="mt-8 space-y-5" on:submit|preventDefault={handleRegister}>
      <div class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="first-name" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              id="first-name"
              name="first-name"
              type="text"
              required
              bind:value={firstName}
              class="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ease-in-out sm:text-sm"
              placeholder="First Name"
            />
          </div>
          
          <div>
            <label for="last-name" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              id="last-name"
              name="last-name"
              type="text"
              required
              bind:value={lastName}
              class="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ease-in-out sm:text-sm"
              placeholder="Last Name"
            />
          </div>
        </div>
        
        <div>
          <label for="email-address" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autocomplete="email"
            required
            bind:value={email}
            class="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ease-in-out sm:text-sm"
            placeholder="Email Address"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="new-password"
            required
            bind:value={password}
            class="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ease-in-out sm:text-sm"
            placeholder="Password"
            minlength="6"
          />
        </div>
        
        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autocomplete="new-password"
            required
            bind:value={confirmPassword}
            class={`appearance-none relative block w-full px-4 py-3 border ${!passwordsMatch ? 'border-red-500' : 'border-gray-300'} rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ease-in-out sm:text-sm`}
            placeholder="Confirm Password"
            minlength="6"
          />
        </div>
      </div>

      {#if error}
        <div class="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg border border-red-100 transition-all duration-300">{error}</div>
      {/if}

      <div class="mt-6">
        <Button
          type="submit"
          variant="primary"
          {loading}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </div>
    </form>
  </div>
</div>