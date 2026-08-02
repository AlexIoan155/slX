import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe/client";
import { isCheckoutConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { getStripeCustomerId } from "@/services/subscription.service";

/**
 * Creates a Stripe Checkout session for the Premium plan. Intentionally
 * dormant: returns 503 until STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 * and STRIPE_PREMIUM_PRICE_ID are all configured, matching the
 * "architecture only, no live payments yet" requirement. The Premium page
 * (/premium) already calls this — nothing further to wire once billing is
 * switched on.
 */
export async function POST() {
  const stripe = getStripeClient();
  if (!stripe || !isCheckoutConfigured()) {
    return NextResponse.json(
      { error: "Plățile nu sunt încă active. Configurează variabilele Stripe pentru a activa acest endpoint." },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
  }

  const priceId = process.env.STRIPE_PREMIUM_PRICE_ID as string;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Reuse the existing Stripe customer if this user has subscribed before
  // (e.g. canceled and is re-subscribing), instead of letting Stripe create
  // a duplicate customer record on every checkout attempt.
  const existingCustomerId = await getStripeCustomerId(supabase, user.id);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: existingCustomerId ?? undefined,
    customer_email: existingCustomerId ? undefined : (user.email ?? undefined),
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    // Stamped onto the resulting Subscription object itself (not just this
    // Checkout Session), so every later webhook event for this
    // subscription — updates, cancellations, renewals — can identify the
    // Supabase user without a second lookup.
    subscription_data: {
      metadata: { userId: user.id },
    },
    success_url: `${siteUrl}/dashboard?upgraded=1`,
    cancel_url: `${siteUrl}/preturi`,
  });

  return NextResponse.json({ url: session.url });
}
