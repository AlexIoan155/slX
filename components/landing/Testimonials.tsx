"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

const TESTIMONIALS = [
  {
    name: "Ana Constantinescu",
    role: "Proprietară, casă în Voluntari",
    quote:
      "Am aflat că instalația electrică de 25 de ani era principalul risc din casă. Am rezolvat-o înainte să devină o problemă reală.",
  },
  {
    name: "Mihai Drăgan",
    role: "Proprietar, apartament în Cluj-Napoca",
    quote:
      "Recomandările cu cost estimat m-au ajutat să prioritizez exact ce merită bugetul din acest an.",
  },
  {
    name: "Ioana Petrescu",
    role: "Proprietară, casă în Brașov",
    quote:
      "Scorul HomeRisk mi-a dat în sfârșit o imagine clară, în loc de zeci de liste de verificare disparate.",
  },
];

export function Testimonials() {
  return (
    <section id="testimoniale" className="relative py-24">
      <Container>
        <div className="max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-[0.18em] text-alert-to">Testimoniale</span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Proprietari care și-au înțeles, în sfârșit, locuința.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="h-full p-7">
                <Quote size={20} className="text-alert-to/70" />
                <p className="mt-4 text-[15px] leading-relaxed text-ink">{t.quote}</p>
                <div className="mt-6 border-t border-surface-border pt-4">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-ink-muted">{t.role}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
