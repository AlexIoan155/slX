import { QUESTIONS } from "@/data/questions";
import { getRecommendationTemplate } from "@/data/recommendations";
import {
  PRIORITY_ORDER,
  RISK_DESCRIPTIONS,
  RISK_LABELS,
  levelFromScoreAscending,
  levelFromScoreDescending,
} from "@/constants/risk-meta";
import type {
  ActiveRecommendation,
  Answers,
  AssessmentResult,
  DetectedRisk,
  DomainScores,
  RiskKey,
  RiskProbabilities,
} from "@/types/domain";

const RISK_BASELINE = 26;
const DOMAIN_BASELINE = { safety: 62, maintenance: 62, smartHome: 50 };

// Relative weight of each risk in the overall HomeRisk score. Must sum to 1.
const RISK_WEIGHTS: Record<RiskKey, number> = {
  fire: 0.2,
  electrical: 0.16,
  flood: 0.12,
  plumbing: 0.14,
  mold: 0.12,
  theft: 0.12,
  accidents: 0.14,
};

// RON estimated annual exposure per probability point above the "safe" baseline.
const COST_PER_POINT: Record<RiskKey, number> = {
  fire: 48,
  electrical: 42,
  flood: 55,
  plumbing: 36,
  mold: 18,
  theft: 30,
  accidents: 26,
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function emptyProbabilities(): RiskProbabilities {
  return {
    fire: RISK_BASELINE,
    flood: RISK_BASELINE,
    electrical: RISK_BASELINE,
    theft: RISK_BASELINE,
    mold: RISK_BASELINE,
    plumbing: RISK_BASELINE,
    accidents: RISK_BASELINE,
  };
}

/**
 * Runs every answered question through its weighted effects and returns the
 * raw (unclamped) probability + domain accumulators, plus the set of
 * recommendation ids triggered by the user's specific answers.
 */
function accumulate(answers: Answers) {
  const probabilities = emptyProbabilities();
  const domain: DomainScores = { ...DOMAIN_BASELINE };
  const triggered = new Map<string, string[]>(); // recommendation id -> reasons

  for (const question of QUESTIONS) {
    const answerValue = answers[question.id];
    if (!answerValue) continue;
    const option = question.options.find((o) => o.value === answerValue);
    if (!option) continue;

    if (option.effects) {
      (Object.keys(option.effects) as RiskKey[]).forEach((key) => {
        probabilities[key] += option.effects![key] ?? 0;
      });
    }
    if (option.domainEffects) {
      (Object.keys(option.domainEffects) as (keyof DomainScores)[]).forEach((key) => {
        domain[key] += option.domainEffects![key] ?? 0;
      });
    }
    if (option.triggers) {
      option.triggers.forEach((id) => {
        const reasons = triggered.get(id) ?? [];
        reasons.push(question.text);
        triggered.set(id, reasons);
      });
    }
  }

  return { probabilities, domain, triggered };
}

function computeHomeRiskScore(probabilities: RiskProbabilities, domain: DomainScores): number {
  const riskAvg = (Object.keys(probabilities) as RiskKey[]).reduce(
    (sum, key) => sum + probabilities[key] * RISK_WEIGHTS[key],
    0
  );
  const domainPenalty =
    (100 - domain.safety) * 0.15 + (100 - domain.maintenance) * 0.1 + (100 - domain.smartHome) * 0.05;
  const raw = 100 - riskAvg * 0.7 - domainPenalty;
  return clamp(raw);
}

function computeAnnualCost(probabilities: RiskProbabilities): number {
  const cost = (Object.keys(probabilities) as RiskKey[]).reduce((sum, key) => {
    const excess = Math.max(0, probabilities[key] - 20);
    return sum + excess * COST_PER_POINT[key];
  }, 0);
  return Math.round(cost / 50) * 50;
}

function buildDetectedRisks(probabilities: RiskProbabilities): DetectedRisk[] {
  return (Object.keys(probabilities) as RiskKey[])
    .map((key) => ({
      key,
      label: RISK_LABELS[key],
      probability: probabilities[key],
      level: levelFromScoreDescending(probabilities[key]),
      description: RISK_DESCRIPTIONS[key],
    }))
    .filter((r) => r.probability >= 30)
    .sort((a, b) => b.probability - a.probability);
}

function buildRecommendations(triggered: Map<string, string[]>): ActiveRecommendation[] {
  const list: ActiveRecommendation[] = [];
  triggered.forEach((reasons, id) => {
    const template = getRecommendationTemplate(id);
    if (!template) return;
    list.push({ ...template, reasons });
  });
  return list.sort((a, b) => {
    const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (p !== 0) return p;
    return b.scoreImpact - a.scoreImpact;
  });
}

export function computeAssessment(answers: Answers): AssessmentResult {
  const { probabilities: rawProbabilities, domain: rawDomain, triggered } = accumulate(answers);

  const probabilities = Object.fromEntries(
    (Object.keys(rawProbabilities) as RiskKey[]).map((key) => [key, clamp(rawProbabilities[key])])
  ) as unknown as RiskProbabilities;

  const domainScores: DomainScores = {
    safety: clamp(rawDomain.safety),
    maintenance: clamp(rawDomain.maintenance),
    smartHome: clamp(rawDomain.smartHome),
  };

  const homeRiskScore = computeHomeRiskScore(probabilities, domainScores);
  const riskLevel = levelFromScoreAscending(homeRiskScore);
  const estimatedAnnualCostRON = computeAnnualCost(probabilities);
  const detectedRisks = buildDetectedRisks(probabilities);
  const recommendations = buildRecommendations(triggered);
  const interventionPriority = detectedRisks.length > 0 ? detectedRisks[0].level : "scazut";

  return {
    homeRiskScore,
    riskLevel,
    probabilities,
    domainScores,
    estimatedAnnualCostRON,
    interventionPriority,
    detectedRisks,
    recommendations,
    answeredAt: new Date().toISOString(),
    answersCount: Object.keys(answers).length,
  };
}
