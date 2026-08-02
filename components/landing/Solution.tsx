"use client";

import { motion } from "framer-motion";
import { Gauge, ListChecks, Wallet } from "lucide-react";
import { Container } from "@/components/ui/Container";

const ITEMS = [
  {
    icon: Gauge,
    title: "Un scor HomeRisk unic, de la 0 la 100",
    text: "Toate riscurile locuinței, condensate într-un singur indicator ușor de urmărit în timp.",
  },
  {
    icon: ListChecks,
    title: "Recomandări prioritizate, nu liste generice",
    text: "Fiecare recomandare are cost estimat, impact asupra scorului și motivul exact pentru care apare.",
  },
  {
    icon: Wallet,
    title: "Cost anual estimat al riscurilor, în RON",
    text: "Vezi în bani cât te costă neglijarea riscurilor, ca să prioritizezi corect bugetul de întreținere.",
  },
];

export function Solution() {
  return (
    <section className="relative py-24 bg-surface/40">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-medium uppercase tracking-[0.18em] text-shield-to">Soluția</span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              HomeRisk AI transformă 54 de răspunsuri într-un plan clar de acțiune.
            </h2>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-muted">
              Motorul nostru ponderează fiecare răspuns în funcție de impactul real asupra
              siguranței locuinței, apoi îl traduce în probabilități, scoruri și recomandări
              concrete — nu într-un chestionar static.
            </p>
          </div>

          <div className="space-y-4">
            {ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass flex gap-4 rounded-2xl p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-shield-to/10 text-shield-to">
                  <item.icon size={19} />
                </div>
                <div>
                  <h3 className="font-display font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
