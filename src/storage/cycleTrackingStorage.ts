// storage/cycleTrackingStorage.ts
//
// Fecha desde la que se cuentan los ciclos; es parte del perfil y se sincroniza.

import { getProfile, updateProfile } from "@/sync/store";

export async function getCycleResetDate(): Promise<string | null> {
  return (await getProfile()).cycleTrackingStart;
}

export async function setCycleResetDate(date: string): Promise<void> {
  await updateProfile({ cycleTrackingStart: date });
}

export async function clearCycleResetDate(): Promise<void> {
  await updateProfile({ cycleTrackingStart: null });
}
