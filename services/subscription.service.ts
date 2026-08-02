import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/server";
import type { Database, SubscriptionRow, SubscriptionStatus, SubscriptionPlan, PaymentStatus } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getSubscription(supabase: Client, userId: string): Promise<SubscriptionRow | null> {
  const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Looks up the Stripe customer id already on file for this user (if any),
 * so the checkout route can reuse it instead of asking Stripe to create a
 * duplicate customer on a second subscribe attempt.
 */
export async function getStripeCustomerId(supabase: Client, userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data?.stripe_customer_id ?? null;
}

/**
 * Reverse lookup used by the webhook as a fallback when a Stripe event
 * doesn't carry `metadata.userId` (defensive — checkout always stamps it,
 * see app/api/stripe/checkout/route.ts, but portal-initiated edge cases
 * are cheaper to cover here than to risk silently dropping an event).
 */
export async function getUserIdByStripeCustomerId(stripeCustomerId: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", stripeCustomerId)
    .maybeSingle();
  if (error) throw error;
  return data?.user_id ?? null;
}

export interface StripeSubscriptionSync {
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  currentPeriodEnd: string | null;
}

/**
 * Mirrors Stripe's subscription state into `subscriptions` + the
 * lightweight `profiles.subscription` flag. Called exclusively from the
 * webhook handler (app/api/stripe/webhook/route.ts) after the event
 * signature has been verified — never from a client-triggered path.
 *
 * Uses the admin client because `subscriptions` has no client-facing write
 * policy — only a verified Stripe webhook is allowed to change billing
 * state.
 */
export async function syncSubscriptionFromStripe(sync: StripeSubscriptionSync): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("subscriptions").upsert(
    {
      user_id: sync.userId,
      plan: sync.plan,
      status: sync.status,
      stripe_customer_id: sync.stripeCustomerId,
      stripe_subscription_id: sync.stripeSubscriptionId,
      current_period_end: sync.currentPeriodEnd,
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;

  await admin.from("profiles").update({ subscription: sync.plan }).eq("id", sync.userId);
}

export interface StripePaymentRecord {
  userId: string;
  stripePaymentIntentId: string | null;
  amountRON: number;
  status: PaymentStatus;
}

/**
 * Records a payment (success or failure) into `payments`, linked to the
 * user's current subscription row if one exists. Uses the admin client for
 * the same reason as `syncSubscriptionFromStripe`.
 */
export async function recordPayment(record: StripePaymentRecord): Promise<void> {
  const admin = createAdminClient();
  const { data: subscription } = await admin
    .from("subscriptions")
    .select("id")
    .eq("user_id", record.userId)
    .maybeSingle();

  const { error } = await admin.from("payments").insert({
    user_id: record.userId,
    subscription_id: subscription?.id ?? null,
    stripe_payment_intent_id: record.stripePaymentIntentId,
    amount_ron: record.amountRON,
    status: record.status,
  });
  if (error) throw error;
}
