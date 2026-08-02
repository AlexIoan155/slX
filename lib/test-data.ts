import { QUESTIONS } from "@/data/questions";
import type { Answers } from "@/types/domain";

/**
 * Produces a plausible full answer set without any backend.
 * `riskBias` from 0 (careful homeowner) to 1 (neglected home) controls how
 * often the generator leans toward the riskier option of each question.
 */
export function generateTestAnswers(riskBias = 0.5, seed = Date.now()): Answers {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  const answers: Answers = {};
  QUESTIONS.forEach((q) => {
    // Roughly rank options by how "risky" they are using a cheap heuristic:
    // sum of positive risk effects. Options with no effects sit in the middle.
    const scored = q.options
      .map((o, idx) => {
        const riskScore = Object.values(o.effects ?? {}).reduce((a, b) => a + Math.max(0, b), 0);
        return { idx, riskScore };
      })
      .sort((a, b) => a.riskScore - b.riskScore);

    const position = rand() < riskBias ? scored.length - 1 - Math.floor(rand() * 1.5) : Math.floor(rand() * 1.5);
    const clampedPos = Math.max(0, Math.min(scored.length - 1, position));
    const chosen = scored[clampedPos] ?? scored[0];
    answers[q.id] = q.options[chosen.idx]?.value ?? q.options[0].value;
  });

  return answers;
}

export const DEMO_PRESETS = {
  ingrijita: () => generateTestAnswers(0.12, 42),
  medie: () => generateTestAnswers(0.5, 7),
  neglijata: () => generateTestAnswers(0.88, 99),
};
