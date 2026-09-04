// storage/healthStageStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

export type HealthStage = "menstruacion" | "embarazo" | "menopausia";

const STORAGE_KEY = "healthStage";

export async function getHealthStage(): Promise<HealthStage> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);

    if (
      value === "menstruacion" ||
      value === "embarazo" ||
      value === "menopausia"
    ) {
      return value;
    }

    return "menstruacion"; // default
  } catch (error) {
    console.log("Error reading health stage:", error);
    return "menstruacion";
  }
}

export async function setHealthStage(stage: HealthStage): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, stage);
  } catch (error) {
    console.log("Error saving health stage:", error);
  }
}