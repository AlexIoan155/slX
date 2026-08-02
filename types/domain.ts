// Core domain types shared across the HomeRisk AI engine, data and UI layers.

export type RiskKey =
  | "fire"
  | "flood"
  | "electrical"
  | "theft"
  | "mold"
  | "plumbing"
  | "accidents";

export type DomainScoreKey = "safety" | "maintenance" | "smartHome";

export interface AnswerOption {
  /** Stable value stored as the user's answer. */
  value: string;
  /** Label shown in Romanian in the UI. */
  label: string;
  /** How much this choice moves each risk probability (positive = more risk). */
  effects?: Partial<Record<RiskKey, number>>;
  /** How much this choice moves each 0-100 domain score (positive = better). */
  domainEffects?: Partial<Record<DomainScoreKey, number>>;
  /** If chosen, this recommendation id becomes eligible to appear in results. */
  triggers?: string[];
}

export interface Question {
  id: string;
  categoryId: string;
  text: string;
  helpText?: string;
  options: AnswerOption[];
}

export interface Category {
  id: string;
  name: string;
  shortName: string;
  icon: string; // lucide-react icon name
  description: string;
  /** Original brief topics folded into this grouped category, kept for traceability. */
  covers: string[];
}

export type Answers = Record<string, string>;

export interface RecommendationTemplate {
  id: string;
  title: string;
  category: RiskKey | "general";
  priority: "critica" | "ridicata" | "medie" | "scazuta";
  estimatedCostRON: [number, number];
  scoreImpact: number; // points added back to HomeRisk score if implemented
  estimatedAnnualSavingsRON: number;
  explanation: string;
}

export interface ActiveRecommendation extends RecommendationTemplate {
  reasons: string[];
}

export interface RiskProbabilities {
  fire: number;
  flood: number;
  electrical: number;
  theft: number;
  mold: number;
  plumbing: number;
  accidents: number;
}

export interface DomainScores {
  safety: number;
  maintenance: number;
  smartHome: number;
}

export type RiskLevel = "scazut" | "moderat" | "ridicat" | "critic";

export interface DetectedRisk {
  key: RiskKey;
  label: string;
  probability: number;
  level: RiskLevel;
  description: string;
}

export interface AssessmentResult {
  homeRiskScore: number;
  riskLevel: RiskLevel;
  probabilities: RiskProbabilities;
  domainScores: DomainScores;
  estimatedAnnualCostRON: number;
  interventionPriority: RiskLevel;
  detectedRisks: DetectedRisk[];
  recommendations: ActiveRecommendation[];
  answeredAt: string;
  answersCount: number;
}
