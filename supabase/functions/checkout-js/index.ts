import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.17.0?target=deno";

// Initialize Stripe
const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
  apiVersion: "2022-11-15",
});

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // change this in production
  "Access-Control-Allow-Headers": "Content-Type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { customer_email, items } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd", // ✅ use USD
          product_data: {
            name: item.name,
          },
          unit_amount: item.price, // already in cents
        },
        quantity: item.quantity,
      })),
      success_url: "http://localhost:5173/placeOrder",
      cancel_url: "http://localhost:5173/checkout",
      customer_email,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("❌ Stripe error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
