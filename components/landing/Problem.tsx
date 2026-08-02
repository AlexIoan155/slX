"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, EyeOff } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

const POINTS = [
  {
    icon: EyeOff,
    title: "Riscurile sunt invizibile până devin urgențe",
    text: "O instalație electrică veche sau o infiltrație mică nu dau semne evidente — până la un scurtcircuit sau o inundație.",
  },
  {
    icon: Clock,
    title: "Reviziile se amână la nesfârșit",
    text: "Fără o imagine clară a priorităților, verificările importante rămân mereu „pentru luna viitoare”.",
  },
  {
    icon: AlertTriangle,
    title: "Costurile reale ies la iveală prea târziu",
    text: "O daună neasigurată sau o reparație de urgență costă de câteva ori mai mult decât prevenția.",
  },
];

export function Problem() {
  return (
    <section className="relative py-24">
      <Container>
        <div className="max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-[0.18em] text-alert-to">Problema</span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Majoritatea locuințelor ascund riscuri pe care nimeni nu le urmărește.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="h-full p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-alert-to/10 text-alert-to">
                  <p.icon size={20} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-muted">{p.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
