"use client";

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[app error boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-16">
      <Container className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-risk-critical/10 text-risk-critical">
          <AlertOctagon size={26} />
        </span>
        <h1 className="mt-6 font-display text-2xl font-semibold">Ceva nu a mers bine</h1>
        <p className="mt-2 max-w-sm text-ink-muted">
          A apărut o eroare neașteptată. Poți încerca din nou sau te poți întoarce la pagina principală.
        </p>
        <div className="mt-8 flex gap-3">
          <Button variant="secondary" onClick={() => reset()}>
            Încearcă din nou
          </Button>
          <Button onClick={() => (window.location.href = "/")}>Înapoi acasă</Button>
        </div>
      </Container>
    </div>
  );
}
