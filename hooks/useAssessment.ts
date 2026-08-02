"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES } from "@/constants/categories";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/data/questions";
import { createClient } from "@/lib/supabase/client";
import {
  getOrCreateInProgressAssessment,
  getAnswers,
  saveAnswer as saveAnswerToDb,
} from "@/services/assessment.service";
import type { AssessmentResult, Answers } from "@/types/domain";

/**
 * Drives the multi-step questionnaire. Answers are persisted to Supabase
 * as soon as the user picks them (so progress survives a refresh or a
 * switch to another device), with an in-memory copy for instant UI
 * feedback. Requires an authenticated user — the /evaluare route is
 * protected by middleware.ts, so `userId` is expected to be present.
 */
export function useAssessment(userId: string | null) {
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [answers, setAnswersState] = useState<Answers>({});
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);
  const supabase = useRef(createClient()).current;

  useEffect(() => {
    if (!userId) return;
    let active = true;

    (async () => {
      try {
        const assessment = await getOrCreateInProgressAssessment(supabase, userId);
        const existingAnswers = await getAnswers(supabase, assessment.id);
        if (!active) return;
        setAssessmentId(assessment.id);
        setAnswersState(existingAnswers);
      } catch (err) {
        if (!active) return;
        setSaveError(err instanceof Error ? err.message : "Nu am putut încărca evaluarea.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [userId, supabase]);

  const questionsByCategory = useMemo(() => {
    const map = new Map<string, typeof QUESTIONS>();
    CATEGORIES.forEach((c) => map.set(c.id, []));
    QUESTIONS.forEach((q) => map.get(q.categoryId)?.push(q));
    return map;
  }, []);

  const currentCategory = CATEGORIES[categoryIndex];
  const currentQuestions = questionsByCategory.get(currentCategory.id) ?? [];

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  const isCurrentCategoryComplete = currentQuestions.every((q) => Boolean(answers[q.id]));
  const isLastCategory = categoryIndex === CATEGORIES.length - 1;
  const isFirstCategory = categoryIndex === 0;

  const setAnswer = useCallback(
    (questionId: string, value: string) => {
      setAnswersState((prev) => ({ ...prev, [questionId]: value }));
      if (!assessmentId) return;
      saveAnswerToDb(supabase, assessmentId, questionId, value).catch((err) => {
        setSaveError(err instanceof Error ? err.message : "Nu am putut salva răspunsul.");
      });
    },
    [assessmentId, supabase]
  );

  const goNext = useCallback(() => {
    setCategoryIndex((i) => Math.min(CATEGORIES.length - 1, i + 1));
  }, []);

  const goPrev = useCallback(() => {
    setCategoryIndex((i) => Math.max(0, i - 1));
  }, []);

  const goToCategory = useCallback((index: number) => {
    setCategoryIndex(Math.max(0, Math.min(CATEGORIES.length - 1, index)));
  }, []);

  const submit = useCallback(async (): Promise<AssessmentResult> => {
    if (!userId || !assessmentId) {
      throw new Error("Evaluarea nu a putut fi identificată. Reîncarcă pagina și încearcă din nou.");
    }
    const res = await fetch(`/api/assessments/${assessmentId}/complete`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? "Nu am putut finaliza evaluarea.");
    }
    return data as AssessmentResult;
  }, [userId, assessmentId]);

  return {
    categories: CATEGORIES,
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
    totalQuestions: TOTAL_QUESTIONS,
    progressPercent,
    submit,
    loading,
    saveError,
  };
}
