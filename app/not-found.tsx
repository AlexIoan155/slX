import Link from "next/link";
import { Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-16">
      <Container className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-elevated text-alert-to">
          <Compass size={26} />
        </span>
        <h1 className="mt-6 font-display text-4xl font-semibold">404</h1>
        <p className="mt-2 text-ink-muted">Pagina pe care o cauți nu există sau a fost mutată.</p>
        <Link href="/" className="mt-8">
          <Button>Înapoi acasă</Button>
        </Link>
      </Container>
    </div>
  );
}
