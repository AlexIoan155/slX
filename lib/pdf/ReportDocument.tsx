import { Document, Page, Text, View, StyleSheet, Svg, Circle, Rect } from "@react-pdf/renderer";
import {
  RISK_LABELS,
  RISK_LEVEL_LABEL,
  PRIORITY_LABEL,
} from "@/constants/risk-meta";
import type { AssessmentResult, RiskKey, RiskLevel } from "@/types/domain";

const COLORS = {
  ink: "#12151C",
  muted: "#5C6472",
  faint: "#9098A6",
  border: "#E4E6EA",
  surface: "#F6F7F9",
  alertFrom: "#FF5A36",
  alertTo: "#FFB020",
  shieldFrom: "#22D3EE",
  shieldTo: "#34D399",
};

const LEVEL_COLOR: Record<RiskLevel, string> = {
  scazut: "#0F9D6A",
  moderat: "#B87A00",
  ridicat: "#D9591F",
  critic: "#D22B1F",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: COLORS.ink,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandMark: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: COLORS.alertTo,
    marginRight: 8,
  },
  brandName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
  },
  metaText: {
    fontSize: 9,
    color: COLORS.faint,
    textAlign: "right",
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: COLORS.muted,
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 10,
    color: COLORS.muted,
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
  },
  statBlock: {
    marginLeft: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    marginTop: 18,
  },
  probRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  probLabel: {
    width: 130,
    fontSize: 9,
    color: COLORS.muted,
  },
  probTrack: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
  },
  probValue: {
    width: 34,
    fontSize: 9,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
  },
  recCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  recTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  recTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    maxWidth: 380,
  },
  recPriority: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  recExplanation: {
    fontSize: 9,
    color: COLORS.muted,
    marginBottom: 6,
  },
  recMetaRow: {
    flexDirection: "row",
  },
  recMeta: {
    fontSize: 8.5,
    color: COLORS.muted,
    marginRight: 18,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: COLORS.faint,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
});

function ScoreGauge({ score, level }: { score: number; level: RiskLevel }) {
  const size = 90;
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = LEVEL_COLOR[level];

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={COLORS.border}
        strokeWidth={stroke}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
}

function ProbabilityBar({ label, value }: { label: string; value: number }) {
  const barWidth = 300;
  const filled = Math.round((value / 100) * barWidth);
  const color = value >= 70 ? LEVEL_COLOR.critic : value >= 50 ? LEVEL_COLOR.ridicat : value >= 30 ? LEVEL_COLOR.moderat : LEVEL_COLOR.scazut;

  return (
    <View style={styles.probRow}>
      <Text style={styles.probLabel}>{label}</Text>
      <View style={styles.probTrack}>
        <Svg width={barWidth} height={6}>
          <Rect x={0} y={0} width={barWidth} height={6} rx={3} fill={COLORS.border} />
          <Rect x={0} y={0} width={filled} height={6} rx={3} fill={color} />
        </Svg>
      </View>
      <Text style={styles.probValue}>{value}%</Text>
    </View>
  );
}

function formatRON(value: number): string {
  return `${new Intl.NumberFormat("ro-RO").format(value)} RON`;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

export function ReportDocument({ result, userName }: { result: AssessmentResult; userName: string | null }) {
  return (
    <Document title="Raport HomeRisk AI" author="HomeRisk AI">
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark} />
            <Text style={styles.brandName}>HomeRisk AI</Text>
          </View>
          <View>
            <Text style={styles.metaText}>Raport generat pentru {userName ?? "utilizator"}</Text>
            <Text style={styles.metaText}>{formatDate(result.answeredAt)}</Text>
          </View>
        </View>

        <Text style={styles.title}>Raport de evaluare a riscurilor locuinței</Text>
        <Text style={styles.subtitle}>
          Pe baza a {result.answersCount} răspunsuri, colectate pe 15 categorii de risc.
        </Text>

        <View style={styles.scoreRow}>
          <ScoreGauge score={result.homeRiskScore} level={result.riskLevel} />
          <View style={styles.statBlock}>
            <Text style={styles.scoreLabel}>Scor HomeRisk</Text>
            <Text style={{ fontSize: 24, fontFamily: "Helvetica-Bold", marginBottom: 8 }}>
              {result.homeRiskScore}/100
            </Text>
            <Text style={styles.scoreLabel}>Nivel de risc</Text>
            <Text style={[styles.scoreValue, { color: LEVEL_COLOR[result.riskLevel] }]}>
              {RISK_LEVEL_LABEL[result.riskLevel]}
            </Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.scoreLabel}>Cost anual estimat</Text>
            <Text style={styles.scoreValue}>{formatRON(result.estimatedAnnualCostRON)}</Text>
            <Text style={[styles.scoreLabel, { marginTop: 8 }]}>Prioritate intervenție</Text>
            <Text style={[styles.scoreValue, { color: LEVEL_COLOR[result.interventionPriority] }]}>
              {RISK_LEVEL_LABEL[result.interventionPriority]}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Probabilități pe categorii de risc</Text>
        {(Object.keys(result.probabilities) as RiskKey[]).map((key) => (
          <ProbabilityBar key={key} label={RISK_LABELS[key]} value={result.probabilities[key]} />
        ))}

        <Text style={styles.sectionTitle}>
          Recomandări prioritizate ({result.recommendations.length})
        </Text>
        {result.recommendations.length === 0 ? (
          <Text style={{ fontSize: 9, color: COLORS.muted }}>
            Nicio recomandare — locuința este într-o stare foarte bună.
          </Text>
        ) : (
          result.recommendations.map((rec) => (
            <View key={rec.id} style={styles.recCard} wrap={false}>
              <View style={styles.recTitleRow}>
                <Text style={styles.recTitle}>{rec.title}</Text>
                <Text style={[styles.recPriority, { color: LEVEL_COLOR[priorityToLevel(rec.priority)] }]}>
                  {PRIORITY_LABEL[rec.priority]}
                </Text>
              </View>
              <Text style={styles.recExplanation}>{rec.explanation}</Text>
              <View style={styles.recMetaRow}>
                <Text style={styles.recMeta}>
                  Cost estimativ: {rec.estimatedCostRON[0] === 0 ? "fără cost" : formatRON(rec.estimatedCostRON[0])} - {formatRON(rec.estimatedCostRON[1])}
                </Text>
                <Text style={styles.recMeta}>Impact scor: +{rec.scoreImpact} pct</Text>
                <Text style={styles.recMeta}>Economii/an: {formatRON(rec.estimatedAnnualSavingsRON)}</Text>
              </View>
            </View>
          ))
        )}

        <View style={styles.footer} fixed>
          <Text>HomeRisk AI — Prezicem riscurile locuinței înainte să apară.</Text>
          <Text
            render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} din ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}

function priorityToLevel(priority: string): RiskLevel {
  switch (priority) {
    case "critica":
      return "critic";
    case "ridicata":
      return "ridicat";
    case "medie":
      return "moderat";
    default:
      return "scazut";
  }
}
