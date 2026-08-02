"use client";

import { motion } from "framer-motion";
import { ClipboardList, Cpu, LayoutDashboard } from "lucide-react";
import { Container } from "@/components/ui/Container";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Răspunzi la întrebări despre locuință",
    text: "Un formular împărțit pe 15 categorii — de la electricitate la vecinătate — care durează în jur de 7 minute.",
  },
  {
    icon: Cpu,
    title: "Motorul HomeRisk calculează scorurile",
    text: "Fiecare răspuns are o pondere proprie și influențează simultan mai multe riscuri, nu doar unul singur.",
  },
  {
    icon: LayoutDashboard,
    title: "Primești dashboardul complet",
    text: "Scor general, probabilități pe fiecare risc, cost anual estimat și recomandări prioritizate.",
  },
];

export function HowItWorks() {
  return (
    <section id="cum-functioneaza" className="relative py-24">
      <Container>
        <div className="max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-[0.18em] text-alert-to">Cum funcționează</span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            De la răspunsuri la un plan de acțiune, în trei pași.
          </h2>
        </div>

        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-surface-border to-transparent md:block" />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-surface-border bg-surface-elevated">
                <step.icon size={26} className="text-alert-to" />
              </div>
              <h3 className="mt-6 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-muted">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
