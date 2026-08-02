"use client";

import { useState, type FormEvent } from "react";
import { MailCheck, SendHorizontal } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { sendPasswordReset } from "@/services/auth.service";
import { resetPasswordSchema } from "@/lib/validation/auth";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = resetPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Email invalid");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await sendPasswordReset(parsed.data.email);
      setSent(true);
    } catch {
      // Deliberately generic: never reveal whether an email exists in the
      // system, to avoid leaking which addresses are registered.
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <Card className="p-6 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-shield-to/10 text-shield-to">
          <MailCheck size={20} />
        </span>
        <h2 className="mt-4 font-display font-semibold">Verifică-ți emailul</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Dacă există un cont asociat cu <span className="text-ink">{email}</span>, vei primi un link pentru
          resetarea parolei.
        </p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error ?? undefined}
        required
      />
      <Button type="submit" className="w-full" disabled={submitting} icon={<SendHorizontal size={16} />}>
        {submitting ? "Se trimite..." : "Trimite link de resetare"}
      </Button>
    </form>
  );
}
