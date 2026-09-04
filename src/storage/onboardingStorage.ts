

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "onboarding_complete";

export async function getOnboardingComplete(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEY);
  return value === "true";
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(KEY, "true");
}