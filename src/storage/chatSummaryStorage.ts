

// storage/chatSummaryStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "chat_summary";

export type ChatSummary = {
  date: string; // "2026-07-21"
  text: string;
};

export async function getTodaysChatSummary(): Promise<ChatSummary | null> {
  const data = await AsyncStorage.getItem(KEY);
  if (!data) return null;

  const parsed: ChatSummary = JSON.parse(data);
  const today = new Date().toISOString().split("T")[0];

  return parsed.date === today ? parsed : null;
}

export async function saveChatSummary(text: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  await AsyncStorage.setItem(KEY, JSON.stringify({ date: today, text }));
}