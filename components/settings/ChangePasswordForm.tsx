"use client";

import { useState, type FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { updatePassword } from "@/services/auth.service";
import { updatePasswordSchema } from "@/lib/validation/auth";

export function ChangePasswordForm() {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = updatePasswordSchema.safeParse({ password, confirmPassword });
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
      await updatePassword(parsed.data.password);
      setPassword("");
      setConfirmPassword("");
      toast("Parola a fost actualizată.", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Nu am putut actualiza parola.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Parolă nouă"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        required
      />
      <Input
        label="Confirmă parola nouă"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={fieldErrors.confirmPassword}
        required
      />
      <Button type="submit" disabled={submitting} icon={<KeyRound size={16} />}>
        {submitting ? "Se actualizează..." : "Actualizează parola"}
      </Button>
    </form>
  );
}
