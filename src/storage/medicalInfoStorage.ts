

// storage/medicalInfoStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

export type Cirugia = {
  reason: string;
  date: string;
};

export type MedicalInfo = {
  // Parte 1
  fullName: string;
  birthDate: string;
  height: string;
  weight: string;
  bloodType: string;
  occupation: string;
  city: string;
  phone: string;
  insurance: string;
  email: string;
  emergencyName: string;
  emergencyPhone: string;

  // Parte 2
  currentIllnesses: string;
  surgeryCount: string;
  surgeries: Cirugia[];

  // Parte 3
  firstPeriodAge: string;
  cycleDuration: string;
  bleedingDuration: string;
  painLevel: string;
  menstrualSymptoms: string[];
  pregnancyCount: string;
  pregnancySymptoms: string[];
  menopauseSymptoms: string[];

  // Parte 4
  medications: string;
  allergies: string;
};

export const emptyMedicalInfo: MedicalInfo = {
  fullName: "",
  birthDate: "",
  height: "",
  weight: "",
  bloodType: "",
  occupation: "",
  city: "",
  phone: "",
  insurance: "",
  email: "",
  emergencyName: "",
  emergencyPhone: "",

  currentIllnesses: "",
  surgeryCount: "",
  surgeries: [],

  firstPeriodAge: "",
  cycleDuration: "",
  bleedingDuration: "",
  painLevel: "",
  menstrualSymptoms: [],
  pregnancyCount: "",
  pregnancySymptoms: [],
  menopauseSymptoms: [],

  medications: "",
  allergies: "",
};

const KEY = "medical_info";

export async function getMedicalInfo(): Promise<MedicalInfo> {
  const data = await AsyncStorage.getItem(KEY);
  if (!data) return emptyMedicalInfo;
  return { ...emptyMedicalInfo, ...JSON.parse(data) };
}

export async function saveMedicalInfo(info: MedicalInfo): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(info));
}