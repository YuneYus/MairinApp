

import AsyncStorage from "@react-native-async-storage/async-storage";

export type AudioOption = "es" | "miskito" | "none";

const KEY = "audio_language";

export async function getAudioLanguage(): Promise<AudioOption> {
  const value = await AsyncStorage.getItem(KEY);
  if (value === "es" || value === "miskito" || value === "none") {
    return value;
  }
  return "es";
}

export async function setAudioLanguage(option: AudioOption): Promise<void> {
  await AsyncStorage.setItem(KEY, option);
}