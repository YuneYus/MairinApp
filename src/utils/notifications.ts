// utils/notifications.ts

import { getHealthStage } from '@/storage/healthStageStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { predictNextPeriodDate } from './cyclePrediction';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

import { getTodaysQuote } from "@/services/quoteService";

export const requestPermissions = async (): Promise<boolean> => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const scheduleQuoteReminders = async () => {
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
    await Notifications.cancelScheduledNotificationAsync(id);
    await AsyncStorage.removeItem(PERIOD_REMINDER_ID_KEY);
  }
};

export const cancelQuoteReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};