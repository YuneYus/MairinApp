


// storage/languageStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

export type AppLanguage = "es" | "mis"| "en";

const KEY = "app_language";

export async function getAppLanguage(): Promise<AppLanguage> {
  const value = await AsyncStorage.getItem(KEY);
  if (value === "mis" || value === "en") return value;
  return "es";
}

export async function setAppLanguage(lang: AppLanguage): Promise<void> {
  await AsyncStorage.setItem(KEY, lang);
}