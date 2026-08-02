"use client";

import clsx from "clsx";
import * as Icons from "lucide-react";
import type { Category, Question } from "@/types/domain";

export function CategoryProgress({
  categories,
  currentIndex,
  answers,
  questionsByCategory,
  onSelect,
}: {
  categories: Category[];
  currentIndex: number;
  answers: Record<string, string>;
  questionsByCategory: Map<string, Question[]>;
  onSelect: (index: number) => void;
}) {
  return (
    <nav className="hidden lg:block lg:w-64 shrink-0">
      <ol className="space-y-1">
        {categories.map((cat, i) => {
          const questions = questionsByCategory.get(cat.id) ?? [];
          const answeredInCat = questions.filter((q) => Boolean(answers[q.id])).length;
          const complete = questions.length > 0 && answeredInCat === questions.length;
          const Icon = (Icons[cat.icon as keyof typeof Icons] ?? Icons.Circle) as Icons.LucideIcon;
          const active = i === currentIndex;

          return (
            <li key={cat.id}>
              <button
                onClick={() => onSelect(i)}
                className={clsx(
                  "focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                  active ? "bg-surface-elevated text-ink" : "text-ink-muted hover:bg-surface-elevated/60 hover:text-ink"
                )}
              >
                <span
                  className={clsx(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    complete ? "bg-shield-to/15 text-shield-to" : active ? "bg-alert-to/15 text-alert-to" : "bg-surface text-ink-faint"
                  )}
                >
                  {complete ? <Icons.Check size={14} /> : <Icon size={14} />}
                </span>
                <span className="flex-1 truncate">{cat.shortName}</span>
                <span className="font-mono text-xs text-ink-faint">
                  {answeredInCat}/{questions.length}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
