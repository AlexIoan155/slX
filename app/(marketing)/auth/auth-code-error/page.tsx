import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";

export default function AuthCodeErrorPage() {
  return (
    <AuthCard title="Link invalid sau expirat">
      <div className="text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-risk-critical/10 text-risk-critical">
          <AlertTriangle size={20} />
        </span>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          Linkul de confirmare sau resetare nu mai este valabil. Cere unul nou și încearcă din nou.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/reset-password">
            <Button className="w-full">Cere un link nou</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" className="w-full">
              Înapoi la autentificare
            </Button>
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
