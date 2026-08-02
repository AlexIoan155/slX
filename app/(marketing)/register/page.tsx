import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Creează cont — HomeRisk AI",
  description: "Creează-ți gratuit contul HomeRisk AI și evaluează-ți locuința.",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Creează-ți contul"
      subtitle="Gratuit. Durează mai puțin de un minut."
      footer={
        <>
          Ai deja un cont?{" "}
          <Link href="/login" className="font-medium text-ink hover:underline">
            Autentifică-te
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
