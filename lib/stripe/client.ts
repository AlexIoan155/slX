import "server-only";
import Stripe from "stripe";
import { isStripeConfigured } from "@/lib/env";

let stripeClient: Stripe | null = null;

/**
 * Returns a configured Stripe client, or `null` if billing hasn't been
 * activated yet (no STRIPE_SECRET_KEY set). Callers must handle the
 * `null` case explicitly rather than assuming Stripe is always available —
 * this is intentional scaffolding until payments are switched on.
 */
export function getStripeClient(): Stripe | null {
  if (!isStripeConfigured()) return null;
  if (stripeClient) return stripeClient;

  stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-02-24.acacia",
  });
  return stripeClient;
}
