// utils/reminderScheduler.ts
//
// Avisos de citas médicas y suplementos (notificaciones locales del teléfono).

import type { ReminderOffset } from "@/storage/pregnancyStorage";
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Same guard as utils/notifications.ts — keep both in sync.
const isExpoGo = Constants.appOwnership === 'expo';
const skipNotifications = Platform.OS === 'web' || (isExpoGo && Platform.OS === 'android');

type NotificationsModule = typeof import('expo-notifications');
let Notifications: NotificationsModule | null = null;

if (!skipNotifications) {
  Notifications = require('expo-notifications') as NotificationsModule;
}

export type ReminderKind = "appointment" | "supplement" | "period";

// Canales de Android: la usuaria puede silenciar la frase del día sin perder las citas.
export const REMINDERS_CHANNEL = "recordatorios";
export const QUOTES_CHANNEL = "motivacion";

let channelsReady: Promise<void> | null = null;

export function ensureNotificationChannels(): Promise<void> {
  if (!Notifications || Platform.OS !== "android") return Promise.resolve();
  const N = Notifications;
  channelsReady ??= (async () => {
    await N.setNotificationChannelAsync(REMINDERS_CHANNEL, {
      name: "Citas y recordatorios",
      importance: N.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#A4195B",
    });
    await N.setNotificationChannelAsync(QUOTES_CHANNEL, {
      name: "Frase del día",
      importance: N.AndroidImportance.DEFAULT,
    });
  })().catch((error) => {
    channelsReady = null;
    console.log("Error creating notification channels:", error);
  });
  return channelsReady;
}

/** true si se pueden mostrar notificaciones; si aún no se preguntó, pide el permiso. */
export async function ensureNotificationPermission(): Promise<boolean> {
  if (!Notifications) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

const OFFSET_MINUTES: Record<ReminderOffset, number> = {
  "5min": 5,
  "10min": 10,
  "1hour": 60,
  "2hours": 120,
  "1day": 60 * 24,
  "2days": 60 * 24 * 2,
  "1week": 60 * 24 * 7,
  none: 0,
};

export const REMINDER_OPTIONS: { key: ReminderOffset; label: string }[] = [
  { key: "5min", label: "5 minutos antes" },
  { key: "10min", label: "10 minutos antes" },
  { key: "1hour", label: "1 hora antes" },
  { key: "2hours", label: "2 horas antes" },
  { key: "1day", label: "1 día antes" },
  { key: "2days", label: "2 días antes" },
  { key: "1week", label: "1 semana antes" },
  { key: "none", label: "Sin recordatorio" },
];

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function clock(date: Date): string {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours % 12 || 12}:${minutes} ${hours < 12 ? "a. m." : "p. m."}`;
}

/** "hoy a las 9:00 a. m.", "mañana a las …", "el 5 de noviembre a las …" visto desde el momento del aviso. */
export function whenText(event: Date, from: Date): string {
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(event) - startOfDay(from)) / 86400000);
  const day = days === 0 ? "hoy" : days === 1 ? "mañana" : `el ${event.getDate()} de ${MONTHS[event.getMonth()]}`;
  return `${day} a las ${clock(event)}`;
}

export function reminderContent(kind: Exclude<ReminderKind, "period">, name: string, event: Date, notifyAt: Date) {
  const when = whenText(event, notifyAt);
  return kind === "appointment"
    ? { title: "Recordatorio de cita médica", body: `Tu cita con ${name.trim() || "tu doctor(a)"} es ${when}.` }
    : { title: "Recordatorio de suplemento", body: `Toma tu suplemento${name.trim() ? `: ${name.trim()}` : ""}, ${when}.` };
}

/** Momento del aviso, o null si no hay aviso o ya pasó. */
export function reminderTriggerDate(eventTimeISO: string | null | undefined, offset: ReminderOffset): Date | null {
  if (!eventTimeISO || offset === "none") return null;
  const event = new Date(eventTimeISO);
  if (Number.isNaN(event.getTime())) return null;
  const trigger = new Date(event.getTime() - OFFSET_MINUTES[offset] * 60 * 1000);
  return trigger > new Date() ? trigger : null;
}

export async function cancelReminder(notificationId?: string) {
  if (!notificationId || !Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.log("Error cancelling reminder:", error);
  }
}

/** Programa el aviso de una cita o suplemento. Devuelve el id, o undefined si no se programó. */
export async function scheduleReminder(
  kind: Exclude<ReminderKind, "period">,
  name: string,
  eventTimeISO: string | null | undefined,
  offset: ReminderOffset
): Promise<string | undefined> {
  const triggerDate = reminderTriggerDate(eventTimeISO, offset);
  if (!triggerDate || !Notifications) return undefined;

  await ensureNotificationChannels();
  const { title, body } = reminderContent(kind, name, new Date(eventTimeISO!), triggerDate);
  return Notifications.scheduleNotificationAsync({
    content: { title, body, sound: "default", data: { kind } },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: REMINDERS_CHANNEL,
    },
  });
}
