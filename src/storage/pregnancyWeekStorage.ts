// storage/pregnancyWeekStorage.ts
//
// Stores which week of pregnancy the user is currently on. Mirrors the
// pattern used by storage/healthStageStorage.ts — I don't have that file's
// actual contents, so this assumes AsyncStorage. If healthStageStorage.ts
// uses something else (SecureStore, MMKV, a Zustand store, etc.), swap the
// implementation below to match it so both stay consistent.
 
import AsyncStorage from "@react-native-async-storage/async-storage";
 
const PREGNANCY_WEEK_KEY = "pregnancyWeek";
 
export async function getPregnancyWeek(): Promise<number | null> {
  const value = await AsyncStorage.getItem(PREGNANCY_WEEK_KEY);
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
 
export async function setPregnancyWeek(week: number): Promise<void> {
  await AsyncStorage.setItem(PREGNANCY_WEEK_KEY, String(week));
}
 
export async function clearPregnancyWeek(): Promise<void> {
  await AsyncStorage.removeItem(PREGNANCY_WEEK_KEY);
}