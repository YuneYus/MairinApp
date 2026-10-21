// storage/pregnancyStorage.ts
//
// Vista de "embarazo" sobre el registro diario y los recordatorios (sync/store.ts).
// Las citas de un día son recordatorios de tipo "appointment" anotados en esa fecha.

import { calendarLabelsToChoices, choicesToCalendarLabels } from "@/sync/codes";
import {
  getDailyLog,
  getDailyLogs,
  getReminders,
  LocalDailyLog,
  LocalReminder,
  replaceRemindersForDay,
  updateDailyLog,
} from "@/sync/store";
import { cancelReminder } from "@/utils/reminderScheduler";

export type ReminderOffset =
  | "5min"
  | "10min"
  | "1hour"
  | "2hours"
  | "1day"
  | "2days"
  | "1week"
  | "none";

export type Appointment = {
  name: string;
  time: string; // full ISO datetime string, e.g. "2026-07-25T14:30:00"
  description: string;
  reminderOffset: ReminderOffset;
  notificationId?: string; // to allow cancelling/rescheduling
};

export type PregnancyEntry = {
  date: string;
  babyMovement: boolean;
  doctorAppointment: boolean;
  appointments: Appointment[];
  symptoms: string[];
  notes: string;
};

export const reminderToItem = (r: LocalReminder) => ({
  name: r.name,
  time: r.scheduledAt ?? "",
  description: r.description,
  reminderOffset: r.reminderOffset,
  notificationId: r.notificationId,
});

const toEntry = (log: LocalDailyLog, reminders: LocalReminder[]): PregnancyEntry => ({
  date: log.date,
  babyMovement: log.babyMovement,
  doctorAppointment: log.doctorAppointment,
  appointments: reminders
    .filter((r) => r.kind === "appointment" && r.logDate === log.date)
    .map(reminderToItem),
  symptoms: choicesToCalendarLabels(log.symptoms, "embarazo"),
  notes: log.notes,
});

export async function getPregnancyEntries(): Promise<PregnancyEntry[]> {
  const reminders = await getReminders();
  return Object.values(await getDailyLogs()).map((log) => toEntry(log, reminders));
}

export async function getPregnancyEntry(date: string): Promise<PregnancyEntry | null> {
  const log = await getDailyLog(date);
  return log ? toEntry(log, await getReminders()) : null;
}

/** Guarda un día y sus avisos; cancela las notificaciones de los avisos que se quitaron. */
export async function saveDayReminders(
  kind: LocalReminder["kind"],
  date: string,
  items: Appointment[]
): Promise<void> {
  const removed = await replaceRemindersForDay(
    kind,
    date,
    items.map((item) => ({
      name: item.name,
      scheduledAt: item.time || null,
      description: item.description,
      reminderOffset: item.reminderOffset,
      notificationId: item.notificationId,
    }))
  );
  const kept = new Set(items.map((item) => item.notificationId).filter(Boolean));
  for (const r of removed) {
    if (r.notificationId && !kept.has(r.notificationId)) await cancelReminder(r.notificationId);
  }
}

export async function savePregnancyEntry(entry: PregnancyEntry): Promise<void> {
  await updateDailyLog(entry.date, "embarazo", {
    stage: "embarazo",
    babyMovement: entry.babyMovement,
    doctorAppointment: entry.doctorAppointment,
    symptoms: calendarLabelsToChoices(entry.symptoms),
    notes: entry.notes,
  });
  await saveDayReminders("appointment", entry.date, entry.appointments);
}
