// storage/menstruationStorage.ts
//
// Vista de "menstruación" sobre el registro diario (sync/store.ts).

import { emojiToMood, moodToEmoji } from "@/sync/codes";
import { getDailyLog, getDailyLogs, LocalDailyLog, updateDailyLog } from "@/sync/store";

export type MenstruationEntry = {
  date: string;
  period: boolean;
  exercise: boolean;
  mood: string; // emoji
  notes: string;
};

const toEntry = (log: LocalDailyLog): MenstruationEntry => ({
  date: log.date,
  period: log.period,
  exercise: log.exercise,
  mood: moodToEmoji(log.mood, "calendar"),
  notes: log.notes,
});

export async function getMenstruationEntries(): Promise<MenstruationEntry[]> {
  return Object.values(await getDailyLogs()).map(toEntry);
}

export async function getMenstruationEntry(date: string): Promise<MenstruationEntry | null> {
  const log = await getDailyLog(date);
  return log ? toEntry(log) : null;
}

export async function saveMenstruationEntry(entry: MenstruationEntry): Promise<void> {
  await updateDailyLog(entry.date, "menstruacion", {
    stage: "menstruacion",
    period: entry.period,
    exercise: entry.exercise,
    mood: emojiToMood(entry.mood),
    notes: entry.notes,
  });
}
