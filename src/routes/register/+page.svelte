<script lang="ts">
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/auth';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Button from '$lib/components/common/Button.svelte';
  import Input from '$lib/components/common/Input.svelte';
    import { getPageTitle } from '$lib/types/constant';
    import supabase from '$lib/db/client';
    import { sendRequest } from '$lib/helper';

  $: {
    if ($user) {
      goto('/dashboard');
    }
  }

  const redirectUrl = $page.url.searchParams.get('redirect');

  // Form data
  let firstName = '';
  let middleName = '';
  let lastName = '';
  let email = '';
  let brokerage = '';
  let reco_number = '';
  let phone = '';
  let password = '';
  
  // Error and loading states
  let error = '';
  let loading = false;
  let successMessage = '';
  let showForm = true;

  // Handle form submission
  async function handleRegister() {
    // Reset error
    error = '';
    successMessage = '';
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
      if (data?.user) {
        // Create user profile
        const {data:{error: UserProfileError}} = await sendRequest({
          url: '/api/user',
          body: {
            first_name: firstName,
            last_name: lastName,
            middle_name: middleName,
            email,
            phone,
            reco_number,
            brokerage,
            user_id: data.user.id,
          }
        })
        
        if (UserProfileError) throw UserProfileError;

        if (redirectUrl) {
          localStorage.setItem('redirect', redirectUrl);
        }

        // Hide form and show success message
        showForm = false;
        successMessage = 'Registration successful! Please check your email to verify your account.';
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
  <title>{getPageTitle('Register')}</title>
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
    
    {#if showForm}
      <form class="mt-8 space-y-5" on:submit|preventDefault={handleRegister}>
        <div class="space-y-4">
          <div class="grid gap-4 grid-cols-2">
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
              id="middle-name"
              name="middle-name"
              type="text"
              label="Middle Name (Optional)"
              placeholder="Middle Name"
              required={false}
              bind:value={middleName}
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
            id="phone"
            name="phone"
            type="phone"
            label="Phone Number"
            placeholder="Phone Number"
            autocomplete="phone"
            required={true}
            bind:value={phone}
          />

          <div class="grid gap-4 grid-cols-2">
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
          <p class="text-xs text-gray-500 mt-1">RECO number will be verified.</p>
          </div>
          
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

        </div>

      <div class="mt-6">
        <Button
          type="submit"
          variant="primary"
          {loading}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </Button>
      </div>

      <!-- Welcome Bonus Info -->
      <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          <div>
            <p class="text-sm font-medium text-blue-800">Welcome Bonus!</p>
            <p class="text-xs text-blue-600">Get free credits when you join our platform</p>
          </div>
        </div>
      </div>

    </form>
    {/if}

      {#if successMessage}
        <div class="text-green-600 text-sm text-center p-3 bg-green-50 rounded-lg border border-green-200 transition-all duration-300">
          <div class="flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            {successMessage}
          </div>
        </div>
      {/if}

      {#if error}
        <div class="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg border border-red-100 transition-all duration-300">{error}</div>
      {/if}
  </div>
</div>