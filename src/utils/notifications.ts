// utils/notifications.ts

import { getTodaysQuote } from "@/services/quoteService";
import { getHealthStage } from '@/storage/healthStageStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { predictNextPeriodDate } from './cyclePrediction';

// Push/local notifications are unavailable in Expo Go on Android from SDK 53+.
// Guard every use of expo-notifications so the app doesn't crash there.
const isExpoGo = Constants.appOwnership === 'expo';
const skipNotifications = isExpoGo && Platform.OS === 'android';

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
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const scheduleQuoteReminders = async () => {
  if (!Notifications) return;

  const todaysQuote = getTodaysQuote();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Motivacion del dia',
      body: todaysQuote.quote,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
    },
  });
};

// Cancels only the period-reminder notification, without touching
// the daily quote reminder.
const PERIOD_REMINDER_ID_KEY = 'period_reminder_notification_id';

export const schedulePeriodReminder = async () => {
  if (!Notifications) return;

  const stage = await getHealthStage();
  if (stage !== 'menstruacion') return;

  // Cancel any previously scheduled period reminder before scheduling a new one
  await cancelPeriodReminder();

  const predictedDate = await predictNextPeriodDate();
  if (!predictedDate) return; // not enough history yet

  const reminderDate = new Date(`${predictedDate}T09:00:00`);
  reminderDate.setDate(reminderDate.getDate() - 3);

  const now = new Date();
  if (reminderDate <= now) return; // predicted date already passed / too soon

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Ya casi te viene',
      body: 'Prepárate con tus toallas sanitarias, tu período podría llegar en unos días.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
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

export const cancelQuoteReminders = async () => {
  if (!Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
};