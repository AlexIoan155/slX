import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe/client";
import {
  syncSubscriptionFromStripe,
  recordPayment,
  getUserIdByStripeCustomerId,
  type StripeSubscriptionSync,
} from "@/services/subscription.service";
import type { SubscriptionPlan, SubscriptionStatus } from "@/types/database";

/**
 * Verifies and processes Stripe webhook events. Excluded from middleware's
 * auth-redirect matcher (see middleware.ts) since Stripe calls this
 * unauthenticated and proves its identity via the signature instead.
 *
 * Dormant until STRIPE_WEBHOOK_SECRET is set — returns 503 so Stripe
 * retries later rather than silently accepting unverifiable events.
 *
 * Covers the full subscription lifecycle:
 *   checkout.session.completed   -> first Premium activation
 *   customer.subscription.updated -> plan/status changes (incl. downgrades
 *                                     scheduled via the Customer Portal)
 *   customer.subscription.deleted -> cancellation takes effect (period end)
 *   invoice.paid                  -> successful renewal/charge -> payments
 *   invoice.payment_failed        -> failed charge -> payments + past_due
 */
export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook-ul Stripe nu este încă activat." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Semnătură lipsă." }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Semnătură invalidă.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        if (userId && session.subscription && session.customer) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          await syncSubscriptionFromStripe(toSync(userId, subscription));
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(subscription);
        if (userId) {
          await syncSubscriptionFromStripe(toSync(userId, subscription));
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(subscription);
        if (userId) {
          await syncSubscriptionFromStripe({
            userId,
            plan: "free",
            status: "canceled",
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
            currentPeriodEnd: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : null,
          });
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const userId = invoice.subscription
          ? await resolveUserIdFromCustomer(invoice.customer as string)
          : null;
        if (userId) {
          await recordPayment({
            userId,
            stripePaymentIntentId: (invoice.payment_intent as string) ?? null,
            amountRON: Math.round(invoice.amount_paid / 100),
            status: "succeeded",
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const userId = invoice.subscription
          ? await resolveUserIdFromCustomer(invoice.customer as string)
          : null;
        if (userId) {
          await recordPayment({
            userId,
            stripePaymentIntentId: (invoice.payment_intent as string) ?? null,
            amountRON: Math.round(invoice.amount_due / 100),
            status: "failed",
          });
        }
        break;
      }

      default:
        // Unhandled event types are acknowledged (200) so Stripe doesn't
        // keep retrying events this app doesn't act on.
        break;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[stripe webhook] handler failed", err);
    return NextResponse.json({ error: "Procesarea evenimentului a eșuat." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/** Every subscription created via our checkout carries `metadata.userId` (see app/api/stripe/checkout/route.ts). */
async function resolveUserId(subscription: Stripe.Subscription): Promise<string | null> {
  const metadataUserId = subscription.metadata?.userId;
  if (metadataUserId) return metadataUserId;
  return resolveUserIdFromCustomer(subscription.customer as string);
}

async function resolveUserIdFromCustomer(stripeCustomerId: string): Promise<string | null> {
  return getUserIdByStripeCustomerId(stripeCustomerId);
}

const STATUS_MAP: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
  active: "active",
  trialing: "trialing",
  past_due: "past_due",
  incomplete: "incomplete",
  canceled: "canceled",
  // These don't have a dedicated column value; map to the closest existing
  // status rather than growing the DB enum for edge cases that are rare in
  // practice (unpaid retries, expired incomplete checkouts, paused subs).
  unpaid: "past_due",
  incomplete_expired: "canceled",
  paused: "past_due",
};

function toSync(userId: string, subscription: Stripe.Subscription): StripeSubscriptionSync {
  const status = STATUS_MAP[subscription.status];
  const plan: SubscriptionPlan = status === "canceled" ? "free" : "premium";
  return {
    userId,
    plan,
    status,
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    currentPeriodEnd: subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null,
  };
}
