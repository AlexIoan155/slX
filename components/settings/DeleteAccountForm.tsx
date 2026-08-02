"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import { signOut } from "@/services/auth.service";

const CONFIRM_WORD = "ȘTERGE";

export function DeleteAccountForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function handleDelete() {
    if (confirmation.trim().toUpperCase() !== CONFIRM_WORD) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ștergerea a eșuat.");

      await signOut().catch(() => {
        // The account (and its session) is already gone server-side;
        // a client-side signOut failure here is not actionable.
      });
      toast("Contul tău a fost șters.", "info");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Ștergerea a eșuat.", "error");
      setDeleting(false);
    }
  }

  if (!expanded) {
    return (
      <Button
        variant="secondary"
        size="sm"
        icon={<Trash2 size={15} />}
        onClick={() => setExpanded(true)}
        aria-expanded={false}
      >
        Șterge contul
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-risk-critical/30 bg-risk-critical/5 p-4" role="alertdialog" aria-label="Confirmă ștergerea contului">
      <div className="flex items-start gap-2.5 text-sm text-risk-critical" role="alert">
        <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden />
        <p>
          Această acțiune este ireversibilă. Toate evaluările, istoricul și datele contului tău vor fi
          șterse permanent.
        </p>
      </div>
      <div className="mt-4">
        <Input
          label={`Scrie „${CONFIRM_WORD}" ca să confirmi`}
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
        />
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => setExpanded(false)} disabled={deleting}>
          Anulează
        </Button>
        <Button
          size="sm"
          onClick={handleDelete}
          disabled={confirmation.trim().toUpperCase() !== CONFIRM_WORD || deleting}
          className="!bg-risk-critical !from-risk-critical !to-risk-critical"
          icon={<Trash2 size={15} />}
        >
          {deleting ? "Se șterge..." : "Șterge definitiv contul"}
        </Button>
      </div>
    </div>
  );
}
