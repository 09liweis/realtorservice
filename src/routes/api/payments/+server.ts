import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

// You'll need to install stripe: npm install stripe
// For now, we'll create a mock implementation
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { amount, currency = 'usd', user_id, stripe_client_secret } = await request.json();

    // Validate input
    if (!amount || amount < 50) {
      return json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!user_id) {
      return json({ error: 'User ID required' }, { status: 400 });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);
    let paymentIntent;
    const paymentIntentOption = {
      amount: amount, // amount in cents
      currency: currency,
      metadata: {
        user_id: user_id,
        type: 'credit_topup'
      },
      payment_method_types: ['card'],
    }

    if (stripe_client_secret) {
        // Extract payment intent ID from client secret
        const paymentIntentId = stripe_client_secret.split('_secret_')[0];
  
        // Update existing payment intent
        paymentIntent = await stripe.paymentIntents.update(paymentIntentId, paymentIntentOption);
      } else {
        // Create payment intent
        paymentIntent = await stripe.paymentIntents.create(paymentIntentOption);
      }

    return json({
      client_secret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
};