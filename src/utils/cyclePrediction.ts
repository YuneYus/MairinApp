// utils/cyclePrediction.ts

import { getMenstruationEntries } from "@/storage/menstruationStorage";

function daysBetween(a: string, b: string) {
  const d1 = new Date(`${a}T00:00:00`).getTime();
  const d2 = new Date(`${b}T00:00:00`).getTime();
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function getPeriodStarts(
  entries: { date: string; period: boolean }[]
): string[] {
  const periodDates = entries
    .filter((e) => e.period)
    .map((e) => e.date)
    .sort();

  const starts: string[] = [];

  periodDates.forEach((date, index) => {
    if (index === 0) {
      starts.push(date);
      return;
    }
    const prev = periodDates[index - 1];
    if (daysBetween(prev, date) > 1) {
      starts.push(date);
    }
  });

  return starts;
}

// Returns the predicted date of the NEXT period, or null if there's
// not enough history yet to make a prediction (needs at least 2 starts).
export async function predictNextPeriodDate(): Promise<string | null> {
  const entries = await getMenstruationEntries();
  const starts = getPeriodStarts(entries);

  if (starts.length < 2) {
    return null; // not enough history to predict a cycle length
  }

  // Average gap between consecutive period starts
  const gaps: number[] = [];
  for (let i = 1; i < starts.length; i++) {
    gaps.push(daysBetween(starts[i - 1], starts[i]));
  }

  const avgGap = Math.round(
    gaps.reduce((sum, g) => sum + g, 0) / gaps.length
  );

  const lastStart = starts[starts.length - 1];
  return addDays(lastStart, avgGap);
}