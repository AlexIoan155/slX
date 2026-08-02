import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe/client";
import { isStripeConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { getStripeCustomerId } from "@/services/subscription.service";

/**
 * Creates a Stripe Billing Portal session so the user can update payment
 * methods, downgrade, or cancel — Stripe's hosted UI handles all of that;
 * this app only needs to stay in sync via the webhook (see
 * app/api/stripe/webhook/route.ts, `customer.subscription.updated`).
 */
export async function POST() {
  const stripe = getStripeClient();
  if (!stripe || !isStripeConfigured()) {
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

  const customerId = await getStripeCustomerId(supabase, user.id);
  if (!customerId) {
    return NextResponse.json({ error: "Nu ai încă un abonament activ." }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${siteUrl}/setari`,
  });

  return NextResponse.json({ url: session.url });
}
