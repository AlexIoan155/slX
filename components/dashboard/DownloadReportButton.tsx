"use client";

import { useState } from "react";
import Link from "next/link";
import { FileDown, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

export function DownloadReportButton({ isPremium }: { isPremium: boolean }) {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  if (!isPremium) {
    return (
      <Link href="/premium">
        <Button variant="secondary" size="sm" icon={<Lock size={14} />}>
          Raport PDF (Premium)
        </Button>
      </Link>
    );
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch("/api/reports/pdf");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast(data.error ?? "Nu am putut genera raportul PDF.", "error");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const filename = res.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ?? "homerisk-raport.pdf";
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast("Nu am putut genera raportul PDF. Încearcă din nou.", "error");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleDownload} disabled={downloading} icon={<FileDown size={14} />}>
      {downloading ? "Se generează..." : "Descarcă raport PDF"}
    </Button>
  );
}
