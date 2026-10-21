// sync/store.ts
//
// Datos de salud en el teléfono, con la misma forma que el modelo del servidor
// (ver docs/modelo-de-datos.md del backend). Todo se guarda en el espacio de la
// cuenta activa y cada cambio se anota en la cola para subirlo.
//
// Las pantallas no usan este archivo directamente: usan los módulos de src/storage,
// que traducen entre esta forma y la que espera cada pantalla.

import type { HealthStage } from "@/storage/healthStageStorage";
import type { ReminderOffset } from "@/storage/pregnancyStorage";
import type { MoodCode, SymptomChoice } from "./codes";
import { enqueue } from "./queue";
import { scopedGet, scopedSet } from "./session";

// ---------- Registro diario ----------

export type LocalDailyLog = {
  date: string;
  stage: HealthStage;
  mood: MoodCode | "";
  exercise: boolean;
  notes: string;
  period: boolean;
  babyMovement: boolean;
  doctorAppointment: boolean;
  tookVitamins: boolean;
  symptoms: SymptomChoice[];
};

const DAILY_LOGS_KEY = "daily_logs";

export function emptyDailyLog(date: string, stage: HealthStage): LocalDailyLog {
  return {
    date,
    stage,
    mood: "",
    exercise: false,
    notes: "",
    period: false,
    babyMovement: false,
    doctorAppointment: false,
    tookVitamins: false,
    symptoms: [],
  };
}

export async function getDailyLogs(): Promise<Record<string, LocalDailyLog>> {
  return scopedGet<Record<string, LocalDailyLog>>(DAILY_LOGS_KEY, {});
}

export async function getDailyLog(date: string): Promise<LocalDailyLog | null> {
  return (await getDailyLogs())[date] ?? null;
}

/** Cambia algunos campos del día (lo crea si no existe) y lo deja pendiente de subir. */
export async function updateDailyLog(
  date: string,
  stageIfNew: HealthStage,
  patch: Partial<Omit<LocalDailyLog, "date">>
): Promise<LocalDailyLog> {
  const logs = await getDailyLogs();
  const log = { ...(logs[date] ?? emptyDailyLog(date, stageIfNew)), ...patch, date };
  logs[date] = log;
  await scopedSet(DAILY_LOGS_KEY, logs);
  await enqueue({ kind: "daily_log", date });
  return log;
}

export async function replaceDailyLogs(logs: Record<string, LocalDailyLog>): Promise<void> {
  await scopedSet(DAILY_LOGS_KEY, logs);
}

// ---------- Recordatorios (citas y suplementos) ----------

export type ReminderKind = "appointment" | "supplement";

export type LocalReminder = {
  localId: string;
  serverId?: number;
  kind: ReminderKind;
  name: string;
  scheduledAt: string | null;
  description: string;
  reminderOffset: ReminderOffset;
  logDate: string | null;
  notificationId?: string; // solo en este teléfono
};

const REMINDERS_KEY = "reminders";

export async function getReminders(): Promise<LocalReminder[]> {
  return scopedGet<LocalReminder[]>(REMINDERS_KEY, []);
}

export async function saveReminders(reminders: LocalReminder[]): Promise<void> {
  await scopedSet(REMINDERS_KEY, reminders);
}

/**
 * Reemplaza los recordatorios de un tipo anotados en un día (el calendario edita la lista completa).
 * Devuelve los que se quitaron, para cancelar sus notificaciones.
 */
export async function replaceRemindersForDay(
  kind: ReminderKind,
  logDate: string,
  items: Omit<LocalReminder, "localId" | "serverId" | "kind" | "logDate">[]
): Promise<LocalReminder[]> {
  const all = await getReminders();
  const removed = all.filter((r) => r.kind === kind && r.logDate === logDate);
  const kept = all.filter((r) => !(r.kind === kind && r.logDate === logDate));
  const added: LocalReminder[] = items.map((item) => ({ ...item, kind, logDate, localId: newId() }));
  await saveReminders([...kept, ...added]);
  await enqueue(
    ...removed.map((r) => ({ kind: "reminder" as const, localId: r.localId, serverId: r.serverId })),
    ...added.map((r) => ({ kind: "reminder" as const, localId: r.localId }))
  );
  return removed;
}

// ---------- Perfil ----------

export type LocalProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  healthStage: HealthStage;
  onboardingComplete: boolean;
  cycleTrackingStart: string | null;
  pregnancyStartDate: string | null;
};

export const emptyProfile: LocalProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: "",
  healthStage: "menstruacion",
  onboardingComplete: false,
  cycleTrackingStart: null,
  pregnancyStartDate: null,
};

const PROFILE_KEY = "profile";

export async function getProfile(): Promise<LocalProfile> {
  return { ...emptyProfile, ...(await scopedGet<Partial<LocalProfile>>(PROFILE_KEY, {})) };
}

export async function updateProfile(patch: Partial<LocalProfile>, options = { sync: true }): Promise<LocalProfile> {
  const profile = { ...(await getProfile()), ...patch };
  await scopedSet(PROFILE_KEY, profile);
  if (options.sync) await enqueue({ kind: "profile" });
  return profile;
}

// ---------- Historial médico ----------
// Misma forma que usa el formulario (app/(tabs)/perfil/medical.tsx).
// painLevel guarda "1".."5"; las listas de síntomas guardan claves de traducción
// (o el texto que escribió la usuaria en "Otros").

export type Cirugia = {
  reason: string;
  date: string; // DD/MM/AAAA
};

export type MedicalInfo = {
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
  currentIllnesses: string;
  surgeryCount: string;
  surgeries: Cirugia[];
  firstPeriodAge: string;
  cycleDuration: string;
  bleedingDuration: string;
  painLevel: string;
  menstrualSymptoms: string[];
  pregnancyCount: string;
  pregnancySymptoms: string[];
  menopauseSymptoms: string[];
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

const MEDICAL_KEY = "medical_info";

export async function getMedical(): Promise<MedicalInfo> {
  return { ...emptyMedicalInfo, ...(await scopedGet<Partial<MedicalInfo>>(MEDICAL_KEY, {})) };
}

export async function saveMedical(info: MedicalInfo, options = { sync: true }): Promise<void> {
  await scopedSet(MEDICAL_KEY, info);
  if (options.sync) await enqueue({ kind: "medical" });
}

// ---------- Resúmenes del chat ----------

const CHAT_SUMMARIES_KEY = "chat_summaries";

export async function getChatSummaries(): Promise<Record<string, string>> {
  return scopedGet<Record<string, string>>(CHAT_SUMMARIES_KEY, {});
}

export async function saveChatSummary(date: string, text: string): Promise<void> {
  const summaries = await getChatSummaries();
  summaries[date] = text;
  await scopedSet(CHAT_SUMMARIES_KEY, summaries);
  await enqueue({ kind: "chat_summary", date });
}

export async function replaceChatSummaries(summaries: Record<string, string>): Promise<void> {
  await scopedSet(CHAT_SUMMARIES_KEY, summaries);
}

// ---------- Doctores ----------

export type LocalDoctor = {
  id: string; // id local (estable, se usa en las rutas de la app)
  serverId?: number;
  name: string;
  professionalism: string;
  phonenumber: string;
  details: string;
  createdAt: string;
};

const DOCTORS_KEY = "doctors";

export async function getDoctorsLocal(): Promise<LocalDoctor[]> {
  return scopedGet<LocalDoctor[]>(DOCTORS_KEY, []);
}

export async function saveDoctorsLocal(doctors: LocalDoctor[]): Promise<void> {
  await scopedSet(DOCTORS_KEY, doctors);
}

// ---------- Solo de este teléfono (no se sincroniza) ----------

export async function getDeviceValue(key: string): Promise<string | null> {
  return scopedGet<string | null>(`device:${key}`, null);
}

export async function setDeviceValue(key: string, value: string): Promise<void> {
  await scopedSet(`device:${key}`, value);
}

// ---------- Utilidades ----------

/** UUID v4: el servidor lo recibe como client_id para no duplicar registros al reintentar. */
export function newId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    return (char === "x" ? random : (random & 0x3) | 0x8).toString(16);
  });
}
