// storage/pregnancyWeekStorage.ts
//
// Se guarda la fecha de inicio del embarazo (no la semana): así la semana avanza sola
// con el tiempo y es la misma en todos los teléfonos de la usuaria.

import { getProfile, updateProfile } from "@/sync/store";
import { addDays, daysBetween, localDateString } from "@/utils/dates";

const MAX_WEEK = 40;

export async function getPregnancyWeek(): Promise<number | null> {
  const start = (await getProfile()).pregnancyStartDate;
  if (!start) return null;
  const week = Math.floor(daysBetween(start, localDateString()) / 7);
  return Math.min(Math.max(week, 1), MAX_WEEK);
}

export async function setPregnancyWeek(week: number): Promise<void> {
  await updateProfile({ pregnancyStartDate: addDays(localDateString(), -week * 7) });
}

export async function clearPregnancyWeek(): Promise<void> {
  await updateProfile({ pregnancyStartDate: null });
}
