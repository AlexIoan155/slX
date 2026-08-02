import { z } from "zod";

// Fails fast (with a clear message) instead of surfacing cryptic runtime
// errors deep inside a Supabase or Stripe call when a variable is missing.
const serverSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({ message: "NEXT_PUBLIC_SUPABASE_URL trebuie să fie un URL valid" }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY lipsește"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  STRIPE_PREMIUM_PRICE_ID: z.string().min(1).optional(),
});

export type Env = z.infer<typeof serverSchema>;

let cached: Env | null = null;

/**
 * Reads and validates process.env once per server process. Call this from
 * server-only code (route handlers, server components, services) — never
 * from a Client Component.
 */
export function getEnv(): Env {
  if (cached) return cached;
  const parsed = serverSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_PREMIUM_PRICE_ID: process.env.STRIPE_PREMIUM_PRICE_ID,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `- ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(
      `Variabile de mediu lipsă sau invalide. Copiază .env.example în .env.local și completează-l:\n${issues}`
    );
  }

  cached = parsed.data;
  return cached;
}

/** True once the minimum Stripe env vars are present — lets the UI/API stay dormant until then. */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

/** True once a Premium price is configured — checkout needs this in addition to the base Stripe keys. */
export function isCheckoutConfigured(): boolean {
  return isStripeConfigured() && Boolean(process.env.STRIPE_PREMIUM_PRICE_ID);
}
