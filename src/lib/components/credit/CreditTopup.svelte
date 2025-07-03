<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { user } from '$lib/stores/auth';
    import { calcUserCredits, getPendingTopUpCreditRecord, upsertCreditRecord } from '$lib/supabase';
    import { loadStripe } from '@stripe/stripe-js';
    import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';
    import Button from '../Button.svelte';
    import { sendRequest } from '$lib/helper';
  
    const dispatch = createEventDispatcher();
  
    // Topup options
    const topupOptions = [
      { amount: 500, label: '$500', description: 'Perfect for small projects' },
      { amount: 1000, label: '$1000', description: 'Most popular choice', popular: true },
      { amount: 2000, label: '$2000', description: 'Best value for agencies' }
    ];
  
    // Component state
    let selectedAmount = topupOptions[0].amount;
    let loading = false;
    let error = '';
    let processing = false;
  
    // Stripe elements
    let stripe: any = null;
    let elements: any = null;
    let cardElement: any = null;
    let clientSecret = '';
    let paymentElementMounted = false;
  
    // Initialize Stripe
    async function initializeStripe() {
      try {
        stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
        if (!stripe) {
          throw new Error('Failed to load Stripe');
        }
      } catch (err) {
        console.error('Error initializing Stripe:', err);
        error = 'Failed to initialize payment system';
      }
    }
  
    // Create payment intent
    async function createPaymentIntent(amount: number) {
      try {
        const {response, data:responseJson} = await sendRequest({url:'/api/payments',body:{
            amount: amount * 100, // Convert to cents
            user_id: $user?.id,
            stripe_client_secret: clientSecret
          }})
          
        if (!response.ok) {
          throw new Error(responseJson.error || 'Failed to create payment intent');
        }

        const {data:creditRecord,error} = await upsertCreditRecord({
          user_id: $user?.id,
          amount,
          tp: 'topup',
          status: 'pending',
          stripe_client_secret: responseJson.client_secret
        });
  
        return responseJson.client_secret;
      } catch (err) {
        console.error('Error creating payment intent:', err);
        throw err;
      }
    }
  
    // Setup payment element
    async function setupPaymentElement() {
      if (!stripe || !clientSecret) return;
  
      const appearance = {
        theme: 'stripe' as const,
        variables: {
          colorPrimary: '#0d7377',
          colorBackground: '#ffffff',
          colorText: '#1f2937',
          colorDanger: '#ef4444',
          fontFamily: 'system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px',
        },
      };
  
      elements = stripe.elements({ 
        clientSecret, 
        appearance 
      });
  
      const paymentElement = elements.create('payment');
      paymentElement.mount('#payment-element');
      paymentElementMounted = true;
  
      paymentElement.on('ready', () => {
        loading = false;
      });
  
      paymentElement.on('change', (event: any) => {
        if (event.error) {
          error = event.error.message;
        } else {
          error = '';
        }
      });
    }
  
    // Handle amount selection
    async function selectAmount(amount: number) {
      if (processing) return;

      error = '';
      loading = true;
      paymentElementMounted = false;
      selectedAmount = amount;
  
      try {
        await initializeStripe();
        clientSecret = await createPaymentIntent(amount);
        
        await setupPaymentElement();
      } catch (err: any) {
        error = err.message || 'Failed to setup payment';
        loading = false;
      }
    }
  
    // Handle payment submission
    async function handlePayment() {
      if (!stripe || !elements || processing) return;
  
      processing = true;
      error = '';
  
      try {
        const { error: submitError } = await elements.submit();
        if (submitError) {
          throw new Error(submitError.message);
        }
  
        const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.origin + '/dashboard/profile',
          },
          redirect: 'if_required'
        });
  
        if (confirmError) {
          throw new Error(confirmError.message);
        }
  
        if (paymentIntent && paymentIntent.status === 'succeeded') {
          // Payment successful, add credit record
          await upsertCreditRecord({
            user_id: $user?.id,
            amount: selectedAmount >= 500 ? selectedAmount + 500 : selectedAmount,
            tp: 'topup',
            stripe_client_secret: clientSecret,
            status: 'done'
          });

          await calcUserCredits($user?.id, selectedAmount);
  
          // Dispatch success event
          dispatch('success', { amount: selectedAmount });
        }
      } catch (err: any) {
        console.error('Payment error:', err);
        error = err.message || 'Payment failed. Please try again.';
      } finally {
        processing = false;
      }
    }
  
    // Handle close
    function handleClose() {
      dispatch('close');
    }
  
    // Initialize with default amount
    onMount(async ()=>{
      const {data:pendingTopupCreditRecord, error} = await getPendingTopUpCreditRecord({user_id:$user.id,tp:'topup',status:'pending'});
      if (pendingTopupCreditRecord) {
        selectedAmount = pendingTopupCreditRecord.amount;
        clientSecret = pendingTopupCreditRecord.stripe_client_secret;
      }
      selectAmount(selectedAmount);
    });
  </script>
  
  <div class="bg-white rounded-xl shadow-lg max-w-10xl mx-auto overflow-hidden">
    <!-- Header -->
    <div class="bg-primary px-6 py-4 text-white">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">Add Credits</h2>
        <button
          onclick={handleClose}
          class="text-white hover:text-gray-200 transition-colors duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <p class="text-blue-100 text-sm mt-1">Choose an amount to add to your account</p>
    </div>
  
    <div class="p-6">
      <!-- Amount Selection -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Select Amount</h3>
        <div class="grid grid-cols-3 md:grid-cols-1 gap-3">
          {#each topupOptions as option}
            <button
              onclick={() => selectAmount(option.amount)}
              disabled={loading || processing}
              class="relative p-4 border-2 rounded-lg transition-all duration-200 text-left {
                selectedAmount === option.amount
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xl font-bold text-gray-900">{option.label}</div>
                  <div class="text-sm text-gray-600">{option.description}</div>
                </div>
                <div class="flex items-center space-x-2">
                  {#if option.popular}
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Popular
                    </span>
                  {/if}
                  <div class="w-5 h-5 rounded-full border-2 {
                    selectedAmount === option.amount
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  } flex items-center justify-center">
                    {#if selectedAmount === option.amount}
                      <div class="w-2 h-2 bg-white rounded-full"></div>
                    {/if}
                  </div>
                </div>
              </div>
            </button>
          {/each}
        </div>
      </div>
  
      <!-- Payment Element -->
      <div class={`mb-6 ${clientSecret?'':'hidden'}`}>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
        <div class="border border-gray-200 rounded-lg p-4">
          {#if loading}
            <div class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span class="ml-3 text-gray-600">Loading payment form...</span>
            </div>
          {/if}
          <div id="payment-element" class="min-h-[200px]"></div>
        </div>
      </div>
      </div>
  
      <!-- Error Message -->
      {#if error}
        <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-red-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <h4 class="text-sm font-medium text-red-800">Payment Error</h4>
              <p class="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      {/if}
  
      <!-- Action Buttons -->
      <div class="flex space-x-3">
        <Button
          variant="secondary"
          onclick={handleClose}
          disabled={processing}
          class_name="flex-1"
        >
          Cancel
        </Button>
        <Button
          onclick={handlePayment}
          disabled={!paymentElementMounted || processing || loading}
          loading={processing}
          class_name="flex-1"
        >
          {processing ? 'Processing...' : `Pay $${selectedAmount}`}
        </Button>
      </div>
  
      <!-- Security Notice -->
      <div class="mt-4 text-center">
        <div class="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <span>Secured by Stripe • Your payment information is encrypted</span>
        </div>
      </div>
    </div>
  </div>