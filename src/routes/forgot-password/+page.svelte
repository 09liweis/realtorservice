<script>
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';

  let email = '';
  let loading = false;
  let message = '';
  let error = '';

  async function handleSubmit() {
    try {
      loading = true;
      error = '';
      message = '';

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        error = resetError.message;
      } else {
        message = 'Password reset instructions have been sent to your email';
        email = '';
      }
    } catch (e) {
      error = 'An unexpected error occurred';
      console.error('Reset password error:', e);
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-[#e6f3f3] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Forgot your password?
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      Enter your email address and we'll send you instructions to reset your password.
    </p>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="Enter your email address"
          autocomplete="email"
          required={true}
          bind:value={email}
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
            Send Reset Instructions
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