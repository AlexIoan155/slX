"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { signInWithPassword } from "@/services/auth.service";
import { loginSchema } from "@/lib/validation/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password, rememberMe });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        errors[String(issue.path[0])] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      await signInWithPassword(parsed.data.email, parsed.data.password);
      const redirectTo = searchParams.get("redirectTo") || "/dashboard";
      toast("Autentificare reușită.", "success");
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Autentificare eșuată.";
      toast(
        message.toLowerCase().includes("invalid")
          ? "Email sau parolă incorectă."
          : message,
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        required
      />
      <Input
        label="Parolă"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        required
      />

      <div className="flex items-center justify-between text-sm">
        {/* Supabase persists sessions via a long-lived refresh-token cookie
            by default; this toggle reflects user intent today and is a
            hook point for a session-only mode later (see README). */}
        <label className="flex items-center gap-2 text-ink-muted">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="focus-ring h-4 w-4 rounded border-surface-border bg-surface-elevated accent-alert-to"
          />
          Ține-mă minte
        </label>
        <Link href="/reset-password" className="text-ink-muted hover:text-ink transition-colors">
          Ai uitat parola?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={submitting} icon={<LogIn size={16} />}>
        {submitting ? "Se autentifică..." : "Autentifică-te"}
      </Button>
    </form>
  );
}
