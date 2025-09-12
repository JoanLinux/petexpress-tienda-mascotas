import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Initialize Supabase with service role key for database operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get session ID from request
    const { sessionId } = await req.json();

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      throw new Error("Payment not completed");
    }

    // Extract customer info from session metadata
    const customerInfo = {
      name: session.metadata?.customer_name || session.customer_details?.name || '',
      email: session.customer_details?.email || '',
      phone: session.metadata?.customer_phone || '',
      address: session.metadata?.customer_address || '',
      city: session.metadata?.customer_city || '',
      notes: session.metadata?.customer_notes || ''
    };

    // Get line items to recreate order items
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

    // Prepare items for database function
    const items = lineItems.data.map(item => ({
      id: crypto.randomUUID(), // Generate UUID for product_id (you might want to store this in metadata)
      name: item.description,
      price: (item.amount_total || 0) / 100, // Convert from centavos to pesos
      quantity: item.quantity
    }));

    // Calculate total amount
    const totalAmount = (session.amount_total || 0) / 100;

    // Create order using database function
    const { data: orderId, error: orderError } = await supabase
      .rpc('create_stripe_order', {
        p_customer_name: customerInfo.name,
        p_customer_email: customerInfo.email,
        p_customer_phone: customerInfo.phone,
        p_delivery_address: customerInfo.address,
        p_total_amount: totalAmount,
        p_order_type: 'delivery', // Default to delivery, you might want to store this in metadata
        p_notes: customerInfo.notes,
        p_user_id: null, // You might want to store user_id in session metadata
        p_stripe_session_id: sessionId,
        p_items: JSON.stringify(items)
      });

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // Create delivery tracking for delivery orders
    console.log('Creating delivery tracking for order:', orderId);
    const { error: trackingError } = await supabase
      .from('delivery_tracking')
      .insert({
        order_id: orderId,
        status: 'assigned',
        customer_latitude: null, // Por ahora null, se puede agregar later
        customer_longitude: null // Por ahora null, se puede agregar later
      });

    if (trackingError) {
      console.error('Error creating delivery tracking:', trackingError);
      // No lanzar error aquí para que el pedido se complete aunque falle el tracking
    } else {
      console.log('Delivery tracking created successfully for order:', orderId);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: orderId,
        message: "Order created successfully" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error processing Stripe success:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});