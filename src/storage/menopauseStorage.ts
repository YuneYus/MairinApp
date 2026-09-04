// storage/menopauseStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReminderOffset } from "./pregnancyStorage";

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

const KEY = "menopause_entries";

export async function getMenopauseEntries(): Promise<MenopauseEntry[]> {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export async function getMenopauseEntry(
  date: string
): Promise<MenopauseEntry | null> {
  const entries = await getMenopauseEntries();
  return entries.find((item) => item.date === date) ?? null;
}

export async function saveMenopauseEntry(
  entry: MenopauseEntry
): Promise<void> {
  const entries = await getMenopauseEntries();
  const filtered = entries.filter((item) => item.date !== entry.date);
  filtered.push(entry);
  await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
}