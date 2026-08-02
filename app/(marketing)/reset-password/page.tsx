import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Resetează parola — HomeRisk AI",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Resetează-ți parola"
      subtitle="Îți trimitem un link de resetare pe email."
      footer={
        <Link href="/login" className="font-medium text-ink hover:underline">
          Înapoi la autentificare
        </Link>
      }
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
