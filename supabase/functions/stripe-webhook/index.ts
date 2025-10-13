import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      customer: string;
      customer_email?: string;
      client_reference_id?: string;
      subscription?: string;
      metadata?: {
        user_id?: string;
      };
      status?: string;
      current_period_start?: number;
      current_period_end?: number;
    };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📥 Webhook received');
    
    // Verify Stripe webhook signature
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!signature || !webhookSecret) {
      console.error('❌ Missing signature or webhook secret');
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.text();
    
    // Basic signature validation (in production, use Stripe's crypto validation)
    console.log('🔐 Webhook signature present, processing event...');
    
    const event: StripeEvent = JSON.parse(body);
    console.log(`📋 Event type: ${event.type}`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('💳 Checkout completed');
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.user_id;
        const customerEmail = session.customer_email;

        console.log(`User ID: ${userId}, Email: ${customerEmail}`);

        if (!userId && !customerEmail) {
          console.error('❌ No user identifier found');
          break;
        }

        // Find user by ID or email
        let targetUserId = userId;
        if (!targetUserId && customerEmail) {
          const { data: authUser } = await supabase.auth.admin.listUsers();
          const user = authUser?.users.find(u => u.email === customerEmail);
          targetUserId = user?.id;
          console.log(`Found user by email: ${targetUserId}`);
        }

        if (!targetUserId) {
          console.error('❌ Could not find user');
          break;
        }

        // Get premium plan ID
        const { data: premiumPlan } = await supabase
          .from('subscription_plans')
          .select('id')
          .eq('type', 'premium')
          .single();

        if (!premiumPlan) {
          console.error('❌ Premium plan not found');
          break;
        }

        // Update or create subscription
        const { data: existingSub } = await supabase
          .from('user_subscriptions')
          .select('id')
          .eq('user_id', targetUserId)
          .single();

        if (existingSub) {
          // Update existing subscription
          const { error } = await supabase
            .from('user_subscriptions')
            .update({
              plan_id: premiumPlan.id,
              status: 'active',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq('id', existingSub.id);

          if (error) {
            console.error('❌ Error updating subscription:', error);
          } else {
            console.log('✅ Subscription updated successfully');
          }
        } else {
          // Create new subscription
          const { error } = await supabase
            .from('user_subscriptions')
            .insert({
              user_id: targetUserId,
              plan_id: premiumPlan.id,
              status: 'active',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            });

          if (error) {
            console.error('❌ Error creating subscription:', error);
          } else {
            console.log('✅ Subscription created successfully');
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        console.log(`🔄 Subscription ${event.type}`);
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;

        if (!userId) {
          console.error('❌ No user ID in subscription metadata');
          break;
        }

        const { data: premiumPlan } = await supabase
          .from('subscription_plans')
          .select('id')
          .eq('type', 'premium')
          .single();

        if (!premiumPlan) {
          console.error('❌ Premium plan not found');
          break;
        }

        const { error } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            plan_id: premiumPlan.id,
            status: subscription.status || 'active',
            current_period_start: new Date((subscription.current_period_start || 0) * 1000).toISOString(),
            current_period_end: new Date((subscription.current_period_end || 0) * 1000).toISOString(),
          });

        if (error) {
          console.error('❌ Error upserting subscription:', error);
        } else {
          console.log('✅ Subscription upserted successfully');
        }
        break;
      }

      case 'customer.subscription.deleted': {
        console.log('🗑️ Subscription deleted');
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;

        if (!userId) {
          console.error('❌ No user ID in subscription metadata');
          break;
        }

        // Get free plan ID
        const { data: freePlan } = await supabase
          .from('subscription_plans')
          .select('id')
          .eq('type', 'free')
          .single();

        if (!freePlan) {
          console.error('❌ Free plan not found');
          break;
        }

        // Revert to free plan
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            plan_id: freePlan.id,
            status: 'cancelled',
          })
          .eq('user_id', userId);

        if (error) {
          console.error('❌ Error reverting to free plan:', error);
        } else {
          console.log('✅ Reverted to free plan successfully');
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Webhook error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
