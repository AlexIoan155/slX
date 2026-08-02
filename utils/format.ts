export function formatRON(value: number): string {
  return new Intl.NumberFormat("ro-RO", {
    maximumFractionDigits: 0,
  }).format(value) + " RON";
}

export function formatRONRange(range: [number, number]): string {
  if (range[0] === range[1]) return formatRON(range[0]);
  return `${new Intl.NumberFormat("ro-RO").format(range[0])} - ${formatRON(range[1])}`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
