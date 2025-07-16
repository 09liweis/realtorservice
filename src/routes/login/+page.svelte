<script>
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/auth';
  import Button from '$lib/components/common/Button.svelte';
  import Input from '$lib/components/common/Input.svelte';
  import Link from '$lib/components/Link.svelte';
    import { getPageTitle } from '$lib/types/constant';
    import supabase from '$lib/db/client';

  // Redirect to dashboard if user is already logged in
  $: {
    if ($user) {
      goto('/dashboard');
    }
  }

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
  <title>{getPageTitle('Login')}</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-[#e6f3f3] py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
    <div>
      <h2 class="text-center text-3xl font-extrabold text-gray-800">
        Sign in to your account
      </h2>
      <p class="mt-3 text-center text-sm text-gray-600">
        or
        <Link href="/register">
          Create new account
        </Link>
      </p>
    </div>
    
    <form class="mt-8 space-y-5" on:submit|preventDefault={handleLogin}>
      <div class="space-y-4">
        <Input
          id="email-address"
          name="email"
          type="email"
          label="Email address"
          placeholder="Email address"
          required={true}
          bind:value={email}
        />
        
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Password"
          required={true}
          bind:value={password}
        />
      </div>

      <div class="flex items-center justify-between mt-4">
        <!-- <div class="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div> -->

        <div class="text-sm">
          <Link href="/forgot-password">
            Forgot password?
          </Link>
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
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>
    </form>
  </div>
</div>