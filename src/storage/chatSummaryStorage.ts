// storage/chatSummaryStorage.ts
//
// Un resumen por día (antes solo se guardaba el de hoy); se sincroniza.

import { getChatSummaries, saveChatSummary as saveSummaryForDate } from "@/sync/store";
import { localDateString } from "@/utils/dates";

export type ChatSummary = {
  date: string; // "2026-07-21"
  text: string;
};

export async function getTodaysChatSummary(): Promise<ChatSummary | null> {
  const today = localDateString();
  const text = (await getChatSummaries())[today];
  return text !== undefined ? { date: today, text } : null;
}

export async function saveChatSummary(text: string): Promise<void> {
  await saveSummaryForDate(localDateString(), text);
}
