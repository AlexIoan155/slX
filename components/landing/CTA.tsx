"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="relative py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[32px] border border-surface-border bg-surface-elevated px-8 py-16 text-center sm:px-16"
        >
          <div className="absolute -top-32 left-1/2 h-72 w-[520px] -translate-x-1/2 rounded-full bg-glow-alert blur-3xl opacity-50" aria-hidden />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Află riscul real al locuinței tale, în 7 minute.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[17px] text-ink-muted">
              Gratuit, fără cont și fără angajamente. Primești imediat scorul HomeRisk și
              recomandările personalizate.
            </p>
            <Link href="/evaluare" className="mt-8 inline-block">
              <Button size="lg" icon={<ArrowRight size={18} />}>
                Începe evaluarea gratuită
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
