// utils/reminderScheduler.ts

import { ReminderOffset } from "@/storage/pregnancyStorage";
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Same guard as utils/notifications.ts — keep both in sync.
const isExpoGo = Constants.appOwnership === 'expo';
const skipNotifications = isExpoGo && Platform.OS === 'android';

type NotificationsModule = typeof import('expo-notifications');
let Notifications: NotificationsModule | null = null;

if (!skipNotifications) {
  Notifications = require('expo-notifications') as NotificationsModule;
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

export async function cancelReminder(notificationId?: string) {
  if (!notificationId || !Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.log("Error cancelling reminder:", error);
  }
}

export async function scheduleReminder(
  title: string,
  body: string,
  eventTimeISO: string,
  offset: ReminderOffset
): Promise<string | undefined> {
  if (offset === "none" || !Notifications) return undefined;

  const eventTime = new Date(eventTimeISO);
  const minutesBefore = OFFSET_MINUTES[offset];
  const triggerDate = new Date(eventTime.getTime() - minutesBefore * 60 * 1000);

  if (triggerDate <= new Date()) {
    // The reminder time has already passed — don't schedule anything
    return undefined;
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });

  return notificationId;
}