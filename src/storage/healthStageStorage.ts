// storage/healthStageStorage.ts
//
// La etapa es parte del perfil (sync/store.ts) y se sincroniza con el servidor.

import { getProfile, updateProfile } from "@/sync/store";

export type HealthStage = "menstruacion" | "embarazo" | "menopausia";

export async function getHealthStage(): Promise<HealthStage> {
  try {
    return (await getProfile()).healthStage;
  } catch (error) {
    console.log("Error reading health stage:", error);
    return "menstruacion";
  }
}

export async function setHealthStage(stage: HealthStage): Promise<void> {
  try {
    await updateProfile({ healthStage: stage });
  } catch (error) {
    console.log("Error saving health stage:", error);
  }
}
