"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Card";
import { ScoreGauge } from "@/components/ui/ScoreGauge";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-28">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-glow-alert blur-3xl opacity-40" aria-hidden />

      <Container className="relative grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="border-alert-to/30 bg-alert-to/10 text-alert-to">
              <Sparkles size={13} />
              Analiză predictivă a riscurilor locuinței
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Prezicem riscurile locuinței <span className="text-gradient-alert">înainte să apară.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted"
          >
            HomeRisk AI analizează peste 50 de factori din locuința ta — electricitate, gaz,
            structură, apă, securitate — și îți arată exact unde ești expus, cât te costă și ce
            să rezolvi primul.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link href="/evaluare">
              <Button size="lg" icon={<ArrowRight size={18} />}>
                Începe evaluarea gratuită
              </Button>
            </Link>
            <a href="#dashboard">
              <Button size="lg" variant="secondary">
                Vezi un exemplu de raport
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-faint"
          >
            <span>54 de întrebări, ~7 minute</span>
            <span className="hidden h-1 w-1 rounded-full bg-ink-faint sm:block" />
            <span>Fără cont, fără card</span>
            <span className="hidden h-1 w-1 rounded-full bg-ink-faint sm:block" />
            <span>Rezultate instant</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto flex items-center justify-center"
        >
          <div className="glass animate-float rounded-[32px] p-10">
            <ScoreGauge score={78} size={260} />
            <p className="mt-6 text-center text-sm text-ink-muted">
              Locuință ta, evaluată în timp real
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
