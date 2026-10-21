// utils/dates.ts
//
// Fechas del calendario en la hora del teléfono (Nicaragua, UTC-6).
// No usar `toISOString().split("T")[0]`: da la fecha en UTC, así que
// después de las 6 p. m. devuelve el día siguiente.

const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-10-20" para la fecha local de `date` (hoy por defecto). */
export function localDateString(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Interpreta "2026-10-20" como medianoche local (no UTC). */
export function parseLocalDate(dateString: string): Date {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(dateString: string, days: number): string {
  const date = parseLocalDate(dateString);
  date.setDate(date.getDate() + days);
  return localDateString(date);
}

export function daysBetween(from: string, to: string): number {
  const ms = parseLocalDate(to).getTime() - parseLocalDate(from).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/** "15/05/1990" -> "1990-05-15"; null si no es una fecha válida. */
export function dmyToIso(text: string): string | null {
  const match = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(text.trim());
  if (!match) return /^\d{4}-\d{2}-\d{2}$/.test(text.trim()) ? text.trim() : null;
  const [, d, m, y] = match;
  const iso = `${y}-${pad(Number(m))}-${pad(Number(d))}`;
  const check = parseLocalDate(iso);
  return check.getDate() === Number(d) && check.getMonth() + 1 === Number(m) ? iso : null;
}

/** "1990-05-15" -> "15/05/1990". */
export function isoToDmy(iso: string | null | undefined): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
