// Formata uma data ISO (YYYY-MM-DD) para pt-PT, ex.: "2 de junho de 2026".
export function formatPostDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
