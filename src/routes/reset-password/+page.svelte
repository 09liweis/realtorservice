<script>
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';

  let password = '';
  let confirmPassword = '';
  let loading = false;
  let message = '';
  let error = '';
  let passwordsMatch = true;

  $: passwordsMatch = !confirmPassword || password === confirmPassword;

  onMount(() => {
    // Check if we have a hash in the URL which indicates a password reset
    const hash = window.location.hash.substring(1);
    if (!hash) {
      // If no hash is present, redirect to login
      goto('/login');
    }
  });

  async function handleSubmit() {
    try {
      if (!passwordsMatch) {
        error = 'Passwords do not match';
        return;
      }

      if (password.length < 6) {
        error = 'Password must be at least 6 characters';
        return;
      }

      loading = true;
      error = '';
      message = '';

      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        error = updateError.message;
      } else {
        message = 'Password has been successfully reset';
        password = '';
        confirmPassword = '';
        
        // Redirect to login after a short delay
        setTimeout(() => {
          goto('/login');
        }, 2000);
      }
    } catch (e) {
      error = 'An unexpected error occurred';
      console.error('Update password error:', e);
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Reset your password
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      Please enter your new password below
    </p>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
        <Input
          id="password"
          name="password"
          type="password"
          label="New Password"
          placeholder="Enter your new password"
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
          placeholder="Confirm your new password"
          autocomplete="new-password"
          required={true}
          minlength="6"
          error={!passwordsMatch}
          errorMessage={!passwordsMatch ? 'Passwords do not match' : ''}
          bind:value={confirmPassword}
        />

        {#if message}
          <div class="rounded-md bg-green-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">{message}</p>
              </div>
            </div>
          </div>
        {/if}

        {#if error}
          <div class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        {/if}

        <div>
          <Button type="submit" loading={loading} disabled={loading} fullWidth={true}>
            Reset Password
          </Button>
        </div>

        <div class="text-sm text-center">
          <a href="/login" class="font-medium text-primary hover:text-primary-hover">
            Return to login
          </a>
        </div>
      </form>
    </div>
  </div>
</div>