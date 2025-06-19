<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';

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
  let brokerage = '';
  let reco_number = '';
  let phone = '';
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
        const {error: UserProfileError} = await supabase.from('user_profiles')
          .insert({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            reco_number,
            brokerage,
            role: 'realtor',
            user_id: data?.user?.id
          });
        if (UserProfileError) throw UserProfileError;
        
        goto('/dashboard');
      }
    } catch (err:any) {
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

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-[#e6f3f3] py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
    <div>
      <h2 class="text-center text-3xl font-extrabold text-gray-800">
        Create Your Account
      </h2>
      <p class="mt-3 text-center text-sm text-gray-600">
        or
        <a href="/login" class="font-medium text-primary hover:text-primary-hover transition-colors duration-200">
          Already have an account? Log in
        </a>
      </p>
    </div>
    
    <form class="mt-8 space-y-5" on:submit|preventDefault={handleRegister}>
      <div class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="first-name"
            name="first-name"
            type="text"
            label="First Name"
            placeholder="First Name"
            required={true}
            bind:value={firstName}
          />
          
          <Input
            id="last-name"
            name="last-name"
            type="text"
            label="Last Name"
            placeholder="Last Name"
            required={true}
            bind:value={lastName}
          />
        </div>
        
        <Input
          id="email-address"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Email Address"
          autocomplete="email"
          required={true}
          bind:value={email}
        />

        <Input
          id="brokerage"
          name="brokerage"
          type="brokerage"
          label="Brokerage"
          placeholder="Brokerage"
          required={true}
          bind:value={brokerage}
        />

        <Input
          id="reco_number"
          name="reco_number"
          type="reco_number"
          label="Reco Number"
          placeholder="Reco Number"
          autocomplete="reco_number"
          required={true}
          bind:value={reco_number}
        />

        <Input
          id="phone"
          name="phone"
          type="phone"
          label="Phone Number"
          placeholder="Phone Number"
          autocomplete="phone"
          required={true}
          bind:value={phone}
        />
        
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Password"
          autocomplete="new-password"
          required={true}
          minlength="6"
          bind:value={password}
        />
        
        <Input
          id="confirm-password"
          name="confirm-password"
          type="password"
          label="Confirm Password"
          placeholder="Confirm Password"
          autocomplete="new-password"
          required={true}
          minlength="6"
          error={!passwordsMatch}
          errorMessage={!passwordsMatch ? 'Passwords do not match' : ''}
          bind:value={confirmPassword}
        />
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