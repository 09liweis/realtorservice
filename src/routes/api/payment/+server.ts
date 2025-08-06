import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { checkAuth } from '$lib/server/apiAuth';
import supabase from '$lib/db/client';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }
    
    const { amount, stripe_client_secret, isPaid } = await request.json();

    // Validate input
    if (!amount || amount < 50) {
      return json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!user_id) {
      return json({ error: 'User ID required' }, { status: 400 });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);


    const paymentIntentId = stripe_client_secret?.split('_secret_')[0];
    let paymentIntent;

    if (isPaid) {
      //handle paid
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent?.status === "succeeded") {
        const totalNewCredits = amount >= 500 ? amount + 50 : amount;
        const {data, error} = await supabase.from('credit_records').update({
          amount: totalNewCredits,
          status: "done",
          notes:
            amount >= 500
              ? "Bonus 50 credits for topup over $500"
              : null,
        })
        .eq('user_id',user_id)
        .eq('tp','topup')
        .eq('stripe_client_secret',stripe_client_secret);
        
        if (error) {
          return json({error},{status:500});
        }

        await supabase.from('user_profiles').update({
          credits: authUser.credits + totalNewCredits
        }).eq('user_id', user_id);

        return json({msg: 'Credits updated'})
      } else {
        return json({error: 'Payment failed'},{status:500})
      }
    }


    const paymentIntentOption = {
      amount: amount * 100, // amount in cents
      currency: 'cad',
      metadata: {
        user_id,
        type: 'credit_topup'
      },
      payment_method_types: ['card'],
    }

    if (paymentIntentId) {
      // Update existing payment intent
      paymentIntent = await stripe.paymentIntents.update(paymentIntentId, paymentIntentOption);
      await supabase.from('credit_records').update({
        amount
      })
      .eq('stripe_client_secret',stripe_client_secret);
    } else {
      // Create payment intent
      paymentIntent = await stripe.paymentIntents.create(paymentIntentOption);
      await supabase.from('credit_records').insert({
        user_id,
        amount,
        tp: "topup",
        status: "pending",
        stripe_client_secret: paymentIntent.client_secret,
      })
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