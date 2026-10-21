// storage/moodStorage.ts
//
// El ánimo de la tarjeta de inicio es el mismo campo del registro diario que usa el calendario.

import { emojiToMood, moodToEmoji } from "@/sync/codes";
import { getDailyLog, getDailyLogs, getProfile, updateDailyLog } from "@/sync/store";
import { localDateString } from "@/utils/dates";

export type MoodEntry = {
  date: string;
  mood: string; // emoji
};

export async function getMoodEntries(): Promise<MoodEntry[]> {
  return Object.values(await getDailyLogs())
    .filter((log) => log.mood)
    .map((log) => ({ date: log.date, mood: moodToEmoji(log.mood, "tracker") }));
}

export async function saveTodaysMood(mood: string): Promise<void> {
  const { healthStage } = await getProfile();
  await updateDailyLog(localDateString(), healthStage, { mood: emojiToMood(mood) });
}

export async function getTodaysMood(): Promise<string | null> {
  const log = await getDailyLog(localDateString());
  return log?.mood ? moodToEmoji(log.mood, "tracker") : null;
}
