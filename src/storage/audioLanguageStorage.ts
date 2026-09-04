// storage/audioLanguageStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

export type AudioOption = "es" | "none";

const KEY = "audio_language";

export async function getAudioLanguage(): Promise<AudioOption> {
  const value = await AsyncStorage.getItem(KEY);
  return value === "none" ? "none" : "es";
}

export async function setAudioLanguage(option: AudioOption): Promise<void> {
  await AsyncStorage.setItem(KEY, option);
}