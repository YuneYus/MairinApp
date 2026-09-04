
// storage/moodStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

export type MoodEntry = {
  date: string;
  mood: string; // emoji
};

const KEY = "mood_entries";

export async function getMoodEntries(): Promise<MoodEntry[]> {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveTodaysMood(mood: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const entries = await getMoodEntries();
  const filtered = entries.filter((e) => e.date !== today);
  filtered.push({ date: today, mood });
  await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
}

export async function getTodaysMood(): Promise<string | null> {
  const today = new Date().toISOString().split("T")[0];
  const entries = await getMoodEntries();
  return entries.find((e) => e.date === today)?.mood ?? null;
}