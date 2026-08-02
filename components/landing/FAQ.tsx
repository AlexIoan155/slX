"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";

const FAQS = [
  {
    q: "Cât durează evaluarea?",
    a: "În medie 6-8 minute, pentru toate cele 54 de întrebări împărțite pe 15 categorii. Poți reveni oricând să continui de unde ai rămas.",
  },
  {
    q: "Am nevoie de cont pentru a folosi HomeRisk AI?",
    a: "Nu. Evaluarea și dashboardul funcționează direct în browser, fără cont și fără card. Datele rămân salvate local, pe dispozitivul tău.",
  },
  {
    q: "Cum calculați scorul HomeRisk?",
    a: "Fiecare răspuns are o pondere specifică și influențează simultan mai multe probabilități de risc (incendiu, inundație, scurtcircuit etc.), combinate apoi într-un scor unic de la 0 la 100.",
  },
  {
    q: "De unde vine costul anual estimat?",
    a: "Este o estimare orientativă, calculată din probabilitățile de risc curente și din costurile tipice ale intervențiilor asociate, exprimată în RON.",
  },
  {
    q: "Recomandările sunt personalizate?",
    a: "Da. Fiecare recomandare apare doar dacă răspunsurile tale au declanșat riscul asociat, cu motivul exact afișat lângă ea.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 bg-surface/40">
      <Container className="max-w-3xl">
        <div className="text-center">
          <span className="text-sm font-medium uppercase tracking-[0.18em] text-shield-to">Întrebări frecvente</span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Tot ce vrei să știi înainte să începi.
          </h2>
        </div>

        <div className="mt-12 divide-y divide-surface-border rounded-2xl border border-surface-border bg-surface">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="focus-ring flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-medium">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-ink-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-[15px] leading-relaxed text-ink-muted">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
