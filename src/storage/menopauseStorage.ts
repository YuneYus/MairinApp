// storage/menopauseStorage.ts
//
// Vista de "menopausia" sobre el registro diario y los recordatorios (sync/store.ts).
// Los suplementos de un día son recordatorios de tipo "supplement" anotados en esa fecha.

import { calendarLabelsToChoices, choicesToCalendarLabels } from "@/sync/codes";
import { getDailyLog, getDailyLogs, getReminders, LocalDailyLog, LocalReminder, updateDailyLog } from "@/sync/store";
import { ReminderOffset, reminderToItem, saveDayReminders } from "./pregnancyStorage";

export type Supplement = {
  name: string;
  time: string; // full ISO datetime string
  description: string;
  reminderOffset: ReminderOffset;
  notificationId?: string;
};

export type MenopauseEntry = {
  date: string;
  exercise: boolean;
  vitamins: boolean;
  supplements: Supplement[];
  symptoms: string[];
  notes: string;
};

const toEntry = (log: LocalDailyLog, reminders: LocalReminder[]): MenopauseEntry => ({
  date: log.date,
  exercise: log.exercise,
  vitamins: log.tookVitamins,
  supplements: reminders
    .filter((r) => r.kind === "supplement" && r.logDate === log.date)
    .map(reminderToItem),
  symptoms: choicesToCalendarLabels(log.symptoms, "menopausia"),
  notes: log.notes,
});

export async function getMenopauseEntries(): Promise<MenopauseEntry[]> {
  const reminders = await getReminders();
  return Object.values(await getDailyLogs()).map((log) => toEntry(log, reminders));
}

export async function getMenopauseEntry(date: string): Promise<MenopauseEntry | null> {
  const log = await getDailyLog(date);
  return log ? toEntry(log, await getReminders()) : null;
}

export async function saveMenopauseEntry(entry: MenopauseEntry): Promise<void> {
  await updateDailyLog(entry.date, "menopausia", {
    stage: "menopausia",
    exercise: entry.exercise,
    tookVitamins: entry.vitamins,
    symptoms: calendarLabelsToChoices(entry.symptoms),
    notes: entry.notes,
  });
  await saveDayReminders("supplement", entry.date, entry.supplements);
}
