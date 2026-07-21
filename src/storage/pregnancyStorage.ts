// storage/pregnancyStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

export type Appointment = {
  name: string;
  time: string;
  description: string;
};

export type PregnancyEntry = {
  date: string;
  babyMovement: boolean;
  doctorAppointment: boolean;
  appointments: Appointment[];
  symptoms: string[];
  notes: string;
};

const KEY = "pregnancy_entries";

export async function getPregnancyEntries(): Promise<PregnancyEntry[]> {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export async function getPregnancyEntry(
  date: string
): Promise<PregnancyEntry | null> {
  const entries = await getPregnancyEntries();
  return entries.find((item) => item.date === date) ?? null;
}

export async function savePregnancyEntry(
  entry: PregnancyEntry
): Promise<void> {
  const entries = await getPregnancyEntries();
  const filtered = entries.filter((item) => item.date !== entry.date);
  filtered.push(entry);
  await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
}