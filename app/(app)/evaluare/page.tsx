"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { CategoryProgress } from "@/components/assessment/CategoryProgress";
import { AssessmentSkeleton } from "@/components/assessment/AssessmentSkeleton";
import { useAssessment } from "@/hooks/useAssessment";
import { useUserContext } from "@/components/providers/UserProvider";
import { useToast } from "@/hooks/useToast";
import { QUESTIONS } from "@/data/questions";

export default function EvaluarePage() {
  const router = useRouter();
  const { userId } = useUserContext();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    categories,
    categoryIndex,
    currentCategory,
    currentQuestions,
    answers,
    setAnswer,
    goNext,
    goPrev,
    goToCategory,
    isCurrentCategoryComplete,
    isFirstCategory,
    isLastCategory,
    answeredCount,
    totalQuestions,
    progressPercent,
    submit,
    loading,
    saveError,
  } = useAssessment(userId);

  useEffect(() => {
    if (saveError) toast(saveError, "error");
  }, [saveError, toast]);

  const questionsByCategory = useMemo(() => {
    const map = new Map<string, typeof QUESTIONS>();
    categories.forEach((c) => map.set(c.id, []));
    QUESTIONS.forEach((q) => map.get(q.categoryId)?.push(q));
    return map;
  }, [categories]);

  const CategoryIcon = (Icons[currentCategory.icon as keyof typeof Icons] ?? Icons.Circle) as Icons.LucideIcon;

  async function handlePrimaryAction() {
    if (isLastCategory) {
      setSubmitting(true);
      try {
        await submit();
        router.push("/dashboard");
      } catch (err) {
        toast(err instanceof Error ? err.message : "Nu am putut finaliza evaluarea.", "error");
      } finally {
        setSubmitting(false);
      }
    } else {
      goNext();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (loading) {
    return <AssessmentSkeleton />;
  }

  if (!userId) return null;

  return (
    <div>
      <div className="sticky top-16 z-20 glass border-b border-surface-border">
        <Container className="flex h-14 items-center justify-between">
          <span className="text-sm font-medium">{currentCategory.name}</span>
          <div className="flex items-center gap-3 text-sm text-ink-muted">
            <span className="font-mono">
              {answeredCount}/{totalQuestions}
            </span>
            <div className="hidden h-2 w-40 overflow-hidden rounded-full bg-surface-elevated sm:block">
              <div
                className="h-full rounded-full bg-gradient-to-r from-alert-from to-alert-to transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </Container>
      </div>

      <Container className="flex gap-12 py-10">
        <CategoryProgress
          categories={categories}
          currentIndex={categoryIndex}
          answers={answers}
          questionsByCategory={questionsByCategory}
          onSelect={goToCategory}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-elevated text-alert-to">
              <CategoryIcon size={20} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-faint">
                Categoria {categoryIndex + 1} din {categories.length}
              </p>
              <h1 className="font-display text-xl font-semibold">{currentCategory.name}</h1>
            </div>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">{currentCategory.description}</p>

          <div className="mt-8 rounded-2xl border border-surface-border bg-surface px-6 sm:px-8">
            {currentQuestions.map((q, i) => (
              <QuestionCard
                key={q.id}
                index={i}
                question={q}
                value={answers[q.id]}
                onChange={(value) => setAnswer(q.id, value)}
              />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={goPrev}
              disabled={isFirstCategory}
              icon={<ArrowLeft size={16} />}
              iconPosition="left"
            >
              Înapoi
            </Button>
            <Button
              onClick={handlePrimaryAction}
              disabled={!isCurrentCategoryComplete || submitting}
              icon={<ArrowRight size={16} />}
            >
              {submitting ? "Se calculează..." : isLastCategory ? "Vezi rezultatele" : "Continuă"}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
