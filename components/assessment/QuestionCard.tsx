"use client";

import clsx from "clsx";
import { Check } from "lucide-react";
import type { Question } from "@/types/domain";

export function QuestionCard({
  question,
  value,
  onChange,
  index,
}: {
  question: Question;
  value?: string;
  onChange: (value: string) => void;
  index: number;
}) {
  return (
    <div className="border-b border-surface-border py-7 first:pt-0 last:border-b-0">
      <div className="flex gap-4">
        <span className="mt-0.5 font-mono text-sm text-ink-faint">{String(index + 1).padStart(2, "0")}</span>
        <div className="flex-1">
          <p className="font-display text-[17px] font-medium leading-snug">{question.text}</p>
          {question.helpText && <p className="mt-1.5 text-sm text-ink-muted">{question.helpText}</p>}

          <div
            className={clsx(
              "mt-4 flex flex-wrap gap-2.5",
              question.options.length > 2 && "sm:max-w-xl"
            )}
            role="radiogroup"
            aria-label={question.text}
          >
            {question.options.map((option) => {
              const selected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onChange(option.value)}
                  className={clsx(
                    "focus-ring flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors",
                    selected
                      ? "border-alert-to/50 bg-alert-to/10 text-ink"
                      : "border-surface-border bg-surface-elevated text-ink-muted hover:border-ink-faint/50 hover:text-ink"
                  )}
                >
                  {selected && <Check size={14} className="text-alert-to" />}
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
