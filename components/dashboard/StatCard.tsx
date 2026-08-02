import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import clsx from "clsx";

export function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  accent = "text-ink",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sublabel?: string;
  accent?: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-elevated">
        <Icon size={18} className="text-ink-muted" />
      </div>
      <div className={clsx("mt-4 font-mono text-2xl font-semibold", accent)}>{value}</div>
      <div className="mt-1 text-sm text-ink-muted">{label}</div>
      {sublabel && <div className="mt-0.5 text-xs text-ink-faint">{sublabel}</div>}
    </Card>
  );
}
