"use client";

import { useState, type FormEvent } from "react";
import { UserPlus, MailCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/hooks/useToast";
import { signUp, resendConfirmationEmail } from "@/services/auth.service";
import { registerSchema } from "@/lib/validation/auth";

export function RegisterForm() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = registerSchema.safeParse({ name, email, password, confirmPassword });
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
      await signUp(parsed.data.email, parsed.data.password, parsed.data.name);
      setConfirmationSent(parsed.data.email);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Crearea contului a eșuat.";
      toast(
        message.toLowerCase().includes("already registered") || message.toLowerCase().includes("already exists")
          ? "Există deja un cont cu acest email."
          : message,
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (!confirmationSent) return;
    setResending(true);
    try {
      await resendConfirmationEmail(confirmationSent);
      toast("Am retrimis emailul de confirmare.", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Nu am putut retrimite emailul.", "error");
    } finally {
      setResending(false);
    }
  }

  if (confirmationSent) {
    return (
      <Card className="p-6 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-shield-to/10 text-shield-to">
          <MailCheck size={20} />
        </span>
        <h2 className="mt-4 font-display font-semibold">Confirmă-ți adresa de email</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Am trimis un link de confirmare la <span className="text-ink">{confirmationSent}</span>. Deschide-l ca
          să îți activezi contul.
        </p>
        <Button variant="secondary" size="sm" className="mt-5" onClick={handleResend} disabled={resending}>
          {resending ? "Se retrimite..." : "Retrimite emailul"}
        </Button>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Input
        label="Nume"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={fieldErrors.name}
        required
      />
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
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        hint={!fieldErrors.password ? "Minim 8 caractere, cu literă mare, literă mică și cifră." : undefined}
        required
      />
      <Input
        label="Confirmă parola"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={fieldErrors.confirmPassword}
        required
      />

      <Button type="submit" className="w-full" disabled={submitting} icon={<UserPlus size={16} />}>
        {submitting ? "Se creează contul..." : "Creează cont"}
      </Button>
    </form>
  );
}
