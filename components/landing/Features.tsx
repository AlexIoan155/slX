"use client";

import { motion } from "framer-motion";
import {
  Flame,
  Zap,
  Droplets,
  ShieldAlert,
  Wifi,
  FileCheck2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  { icon: Flame, title: "Risc de incendiu & gaz", text: "Detectoare, coș de fum, centrală și obiceiuri la gătit, într-un singur scor." },
  { icon: Zap, title: "Instalație electrică", text: "Vechime, siguranțe diferențiale și semne de suprasolicitare." },
  { icon: Droplets, title: "Apă, inundații & mucegai", text: "Conducte, senzori de scurgere, ventilație și expunere la inundații." },
  { icon: ShieldAlert, title: "Securitate & efracție", text: "Alarmă, camere, iluminat exterior și context de vecinătate." },
  { icon: Wifi, title: "Scor Smart Home", text: "Cât de conectată și automatizată este locuința ta astăzi." },
  { icon: FileCheck2, title: "Asigurare & întreținere", text: "Verifică dacă acoperirea și reviziile țin pasul cu riscurile reale." },
];

export function Features() {
  return (
    <section className="relative py-24 bg-surface/40">
      <Container>
        <div className="max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-[0.18em] text-shield-to">Funcționalități</span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            15 categorii de risc, analizate în profunzime.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <Card className="h-full p-7 hover:border-ink-faint/40 transition-colors">
                <f.icon size={20} className="text-alert-to" />
                <h3 className="mt-4 font-display font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
