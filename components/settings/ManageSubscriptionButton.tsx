"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

export function ManageSubscriptionButton({ className }: { className?: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "Nu am putut deschide portalul de facturare.", "info");
        return;
      }
      if (data.url) window.location.href = data.url;
    } catch {
      toast("Nu am putut deschide portalul de facturare. Încearcă din nou mai târziu.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="secondary" className={className} onClick={handleClick} disabled={loading} icon={<CreditCard size={16} />}>
      {loading ? "Se deschide..." : "Gestionează abonamentul"}
    </Button>
  );
}
