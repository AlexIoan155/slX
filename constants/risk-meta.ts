import type { RiskKey, RiskLevel } from "@/types/domain";

export const RISK_LABELS: Record<RiskKey, string> = {
  fire: "Incendiu",
  flood: "Inundație",
  electrical: "Scurtcircuit",
  theft: "Furt",
  mold: "Mucegai",
  plumbing: "Avarie instalații",
  accidents: "Accidente casnice",
};

export const RISK_DESCRIPTIONS: Record<RiskKey, string> = {
  fire: "Probabilitatea unui incendiu cauzat de instalații electrice, gaz, coș de fum sau neglijență la gătit.",
  flood: "Probabilitatea unor pagube produse de inundații, infiltrații sau ape mari.",
  electrical: "Probabilitatea unui scurtcircuit sau a unei defecțiuni electrice periculoase.",
  theft: "Probabilitatea unei efracții sau a unui furt din locuință.",
  mold: "Probabilitatea apariției sau extinderii mucegaiului din cauza umidității.",
  plumbing: "Probabilitatea unei avarii la instalația sanitară (conducte, robinete, scurgeri).",
  accidents: "Probabilitatea unor accidente casnice, inclusiv intoxicare cu monoxid de carbon.",
};

export const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  scazut: "Risc scăzut",
  moderat: "Risc moderat",
  ridicat: "Risc ridicat",
  critic: "Risc critic",
};

export const RISK_LEVEL_COLOR: Record<RiskLevel, { text: string; bg: string; ring: string }> = {
  scazut: { text: "text-risk-low", bg: "bg-risk-low/15", ring: "ring-risk-low/40" },
  moderat: { text: "text-risk-moderate", bg: "bg-risk-moderate/15", ring: "ring-risk-moderate/40" },
  ridicat: { text: "text-risk-high", bg: "bg-risk-high/15", ring: "ring-risk-high/40" },
  critic: { text: "text-risk-critical", bg: "bg-risk-critical/15", ring: "ring-risk-critical/40" },
};

export function levelFromScoreDescending(score: number): RiskLevel {
  // Used where a HIGHER number means MORE risk (e.g. a raw probability).
  if (score >= 70) return "critic";
  if (score >= 50) return "ridicat";
  if (score >= 30) return "moderat";
  return "scazut";
}

export function levelFromScoreAscending(score: number): RiskLevel {
  // Used where a HIGHER number means SAFER (e.g. the overall HomeRisk score).
  if (score >= 80) return "scazut";
  if (score >= 60) return "moderat";
  if (score >= 40) return "ridicat";
  return "critic";
}

export const PRIORITY_ORDER: Record<string, number> = {
  critica: 0,
  ridicata: 1,
  medie: 2,
  scazuta: 3,
};

export const PRIORITY_LABEL: Record<string, string> = {
  critica: "Critică",
  ridicata: "Ridicată",
  medie: "Medie",
  scazuta: "Scăzută",
};
