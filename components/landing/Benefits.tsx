"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

const BENEFITS = [
  { stat: "54", label: "de întrebări acoperind 15 categorii de risc" },
  { stat: "7", label: "categorii de probabilitate calculate simultan" },
  { stat: "0-100", label: "scor HomeRisk, actualizat la fiecare răspuns" },
  { stat: "RON", label: "cost anual estimat al riscurilor neadresate" },
];

export function Benefits() {
  return (
    <section id="beneficii" className="relative py-24 bg-surface/40">
      <Container>
        <div className="max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-[0.18em] text-shield-to">Beneficii</span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Vezi exact ce contează, în locul unei liste nesfârșite de sfaturi.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="p-7">
                <div className="font-mono text-3xl font-semibold text-gradient-shield">{b.stat}</div>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{b.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
