// storage/menstruationStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

export type MenstruationEntry = {
  date: string;
  period: boolean;
  exercise: boolean;
  mood: string;
  notes: string;
};

const KEY = "menstruation_entries";

export async function getMenstruationEntries(): Promise<MenstruationEntry[]> {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export async function getMenstruationEntry(
  date: string
): Promise<MenstruationEntry | null> {
  const entries = await getMenstruationEntries();
  return entries.find((item) => item.date === date) ?? null;
}

export async function saveMenstruationEntry(
  entry: MenstruationEntry
): Promise<void> {
  const entries = await getMenstruationEntries();
  const filtered = entries.filter((item) => item.date !== entry.date);
  filtered.push(entry);
  await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
}