// utils/notifications.ts

import { getTodaysQuote } from "@/services/quoteService";
import { getHealthStage } from '@/storage/healthStageStorage';
import { getAppLanguage } from '@/storage/languageStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { predictNextPeriodDate } from './cyclePrediction';
import { ensureNotificationChannels, QUOTES_CHANNEL, REMINDERS_CHANNEL } from './reminderScheduler';

// Push/local notifications are unavailable in Expo Go on Android from SDK 53+,
// and are not available on web at all (no native notification module exists there).
// Guard every use of expo-notifications so the app doesn't crash there.
const isExpoGo = Constants.appOwnership === 'expo';
const skipNotifications =
  Platform.OS === 'web' || (isExpoGo && Platform.OS === 'android');

type NotificationsModule = typeof import('expo-notifications');
let Notifications: NotificationsModule | null = null;

if (!skipNotifications) {
  Notifications = require('expo-notifications') as NotificationsModule;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export const requestPermissions = async (): Promise<boolean> => {
  if (!Notifications) return false;
  await ensureNotificationChannels();
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Título que usaban versiones anteriores para la frase diaria (se limpian al actualizar).
const LEGACY_QUOTE_TITLES = ['Motivacion del dia'];
const QUOTE_DAYS_AHEAD = 14;
const QUOTE_HOUR = 9;

/** Cancela las notificaciones programadas de un tipo (marcadas con data.kind). */
async function cancelScheduledOfKind(kind: string, legacyTitles: string[] = []) {
  if (!Notifications) return;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const item of scheduled) {
    const data = item.content.data as { kind?: string } | null;
    if (data?.kind === kind || legacyTitles.includes(item.content.title ?? '')) {
      await Notifications.cancelScheduledNotificationAsync(item.identifier);
    }
  }
}

/**
 * Una notificación por día a las 9:00 durante las próximas dos semanas, cada una con la
 * frase de ese día. Se reprograma cada vez que se abre la app, así que no se acumulan.
 */
export const scheduleQuoteReminders = async () => {
  if (!Notifications) return;

  await cancelScheduledOfKind('quote', LEGACY_QUOTE_TITLES);
  await ensureNotificationChannels();

  const language = await getAppLanguage();
  const now = new Date();
  for (let offset = 0; offset < QUOTE_DAYS_AHEAD; offset++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, QUOTE_HOUR, 0, 0);
    if (date <= now) continue;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Motivación del día',
        body: getTodaysQuote(language, date).quote,
        data: { kind: 'quote' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: QUOTES_CHANNEL,
      },
    });
  }
};

// Cancels only the period-reminder notification, without touching
// the daily quote reminder.
const PERIOD_REMINDER_ID_KEY = 'period_reminder_notification_id';

export const schedulePeriodReminder = async () => {
  if (!Notifications) return;

  // Se cancela siempre primero: si la usuaria ya no está en la etapa de menstruación
  // (o no hay predicción), no debe quedar un aviso viejo programado.
  await cancelPeriodReminder();

  const stage = await getHealthStage();
  if (stage !== 'menstruacion') return;

  const predictedDate = await predictNextPeriodDate();
  if (!predictedDate) return; // not enough history yet

  const reminderDate = new Date(`${predictedDate}T09:00:00`);
  reminderDate.setDate(reminderDate.getDate() - 3);

  const now = new Date();
  if (reminderDate <= now) return; // predicted date already passed / too soon

  await ensureNotificationChannels();
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Ya casi te viene',
      body: 'Prepárate con tus toallas sanitarias, tu período podría llegar en unos días.',
      data: { kind: 'period' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
      channelId: REMINDERS_CHANNEL,
    },
  });

  await AsyncStorage.setItem(PERIOD_REMINDER_ID_KEY, notificationId);
};

export const cancelPeriodReminder = async () => {
  const id = await AsyncStorage.getItem(PERIOD_REMINDER_ID_KEY);
  if (id) {
    if (Notifications) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
    await AsyncStorage.removeItem(PERIOD_REMINDER_ID_KEY);
  }
};

/** Cancela solo las frases diarias (no las citas ni los suplementos). */
export const cancelQuoteReminders = async () => {
  await cancelScheduledOfKind('quote', LEGACY_QUOTE_TITLES);
};
