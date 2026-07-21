

// storage/cycleTrackingStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "cycle_tracking_reset_date";

export async function getCycleResetDate(): Promise<string | null> {
  return await AsyncStorage.getItem(KEY);
}

export async function setCycleResetDate(date: string): Promise<void> {
  await AsyncStorage.setItem(KEY, date);
}

export async function clearCycleResetDate(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}