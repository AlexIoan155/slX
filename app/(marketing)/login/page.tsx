import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Autentificare — HomeRisk AI",
  description: "Autentifică-te în contul tău HomeRisk AI.",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Bine ai revenit"
      subtitle="Autentifică-te pentru a-ți vedea scorul HomeRisk."
      footer={
        <>
          Nu ai încă un cont?{" "}
          <Link href="/register" className="font-medium text-ink hover:underline">
            Creează unul gratuit
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
