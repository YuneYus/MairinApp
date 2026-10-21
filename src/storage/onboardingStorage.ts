// storage/onboardingStorage.ts

import { getProfile, updateProfile } from "@/sync/store";

export async function getOnboardingComplete(): Promise<boolean> {
  return (await getProfile()).onboardingComplete;
}

export async function setOnboardingComplete(): Promise<void> {
  await updateProfile({ onboardingComplete: true });
}
