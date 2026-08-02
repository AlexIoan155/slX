import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export const metadata: Metadata = {
  title: "Parolă nouă — HomeRisk AI",
};

export default function UpdatePasswordPage() {
  return (
    <AuthCard title="Alege o parolă nouă" subtitle="Vei fi redirecționat automat către dashboard.">
      <UpdatePasswordForm />
    </AuthCard>
  );
}
