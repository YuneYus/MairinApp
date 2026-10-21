// sync/migrate.ts
//
// Se ejecuta una sola vez por teléfono al instalar esta versión. Pasa los datos que
// estaban guardados sin separar por cuenta (claves globales) al formato nuevo:
// - si había sesión iniciada, quedan en esa cuenta y se marcan para subir;
// - si no, quedan como datos de invitada.
// También borra datos que no deben existir más (la lista de contraseñas en texto plano).

import type { HealthStage } from "@/storage/healthStageStorage";
import { addDays, localDateString } from "@/utils/dates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calendarLabelsToChoices, emojiToMood, legacyMedicalLabelsToKeys, SymptomChoice } from "./codes";
import type { SyncOp } from "./queue";
import { isAccountScope, Scope, scopeKey, setScope, userIdFromToken } from "./session";
import {
  emptyDailyLog,
  emptyMedicalInfo,
  emptyProfile,
  LocalDailyLog,
  LocalDoctor,
  LocalProfile,
  LocalReminder,
  MedicalInfo,
  newId,
} from "./store";

const DONE_KEY = "storage_migrated_v2";

const LEGACY_KEYS = [
  "menstruation_entries",
  "pregnancy_entries",
  "menopause_entries",
  "mood_entries",
  "chat_summary",
  "healthStage",
  "onboarding_complete",
  "cycle_tracking_reset_date",
  "pregnancyWeek",
  "profile_info",
  "profile_photo_uri",
  "medical_info",
  "doctor",
  "pending_doctor_changes",
  "account_type",
  // Sin uso o inseguros: se borran sin migrar.
  "registered_users",
  "calendar_entries",
  "completedFlashcard",
];

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function uniqueChoices(choices: SymptomChoice[]): SymptomChoice[] {
  const seen = new Set<string>();
  return choices.filter((c) => {
    const id = "code" in c ? `code:${c.code}` : `custom:${c.customLabel}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function mergeNotes(current: string, extra: string | undefined): string {
  const text = (extra ?? "").trim();
  return text && !current.includes(text) ? `${current}\n${text}`.trim() : current;
}

export async function migrateLegacyData(): Promise<void> {
  if (await AsyncStorage.getItem(DONE_KEY)) return;

  const access = await AsyncStorage.getItem("access_token");
  const userId = access ? userIdFromToken(access) : null;
  const scope: Scope = userId ? `user:${userId}` : "guest";
  await setScope(scope);

  const stageRaw = await AsyncStorage.getItem("healthStage");
  const stage: HealthStage =
    stageRaw === "embarazo" || stageRaw === "menopausia" ? stageRaw : "menstruacion";

  // --- Registros diarios y recordatorios ---
  const logs: Record<string, LocalDailyLog> = {};
  const reminders: LocalReminder[] = [];
  const logFor = (date: string, logStage: HealthStage) => (logs[date] ??= emptyDailyLog(date, logStage));

  for (const e of await readJson<any[]>("menstruation_entries", [])) {
    const log = logFor(e.date, "menstruacion");
    log.period ||= !!e.period;
    log.exercise ||= !!e.exercise;
    log.mood ||= emojiToMood(e.mood);
    log.notes = mergeNotes(log.notes, e.notes);
  }

  for (const e of await readJson<any[]>("pregnancy_entries", [])) {
    const log = logFor(e.date, "embarazo");
    log.babyMovement ||= !!e.babyMovement;
    log.doctorAppointment ||= !!e.doctorAppointment;
    log.symptoms = uniqueChoices([...log.symptoms, ...calendarLabelsToChoices(e.symptoms ?? [])]);
    log.notes = mergeNotes(log.notes, e.notes);
    for (const a of e.appointments ?? []) {
      if (!a.name && !a.description) continue;
      reminders.push({
        localId: newId(),
        kind: "appointment",
        name: a.name ?? "",
        scheduledAt: a.time ?? null,
        description: a.description ?? "",
        reminderOffset: a.reminderOffset ?? "none",
        logDate: e.date,
        notificationId: a.notificationId,
      });
    }
  }

  for (const e of await readJson<any[]>("menopause_entries", [])) {
    const log = logFor(e.date, "menopausia");
    log.exercise ||= !!e.exercise;
    log.tookVitamins ||= !!e.vitamins;
    log.symptoms = uniqueChoices([...log.symptoms, ...calendarLabelsToChoices(e.symptoms ?? [])]);
    log.notes = mergeNotes(log.notes, e.notes);
    for (const s of e.supplements ?? []) {
      if (!s.name && !s.description) continue;
      reminders.push({
        localId: newId(),
        kind: "supplement",
        name: s.name ?? "",
        scheduledAt: s.time ?? null,
        description: s.description ?? "",
        reminderOffset: s.reminderOffset ?? "none",
        logDate: e.date,
        notificationId: s.notificationId,
      });
    }
  }

  for (const e of await readJson<any[]>("mood_entries", [])) {
    const log = logFor(e.date, stage);
    log.mood ||= emojiToMood(e.mood);
  }

  // --- Perfil ---
  const info = await readJson<any>("profile_info", {});
  const week = Number(await AsyncStorage.getItem("pregnancyWeek"));
  const profile: LocalProfile = {
    ...emptyProfile,
    firstName: info.firstName ?? "",
    lastName: info.lastName ?? "",
    email: info.email ?? "",
    phone: info.phone ?? "",
    birthDate: info.birthDate ?? "",
    healthStage: stage,
    onboardingComplete: (await AsyncStorage.getItem("onboarding_complete")) === "true",
    cycleTrackingStart: await AsyncStorage.getItem("cycle_tracking_reset_date"),
    pregnancyStartDate: week > 0 ? addDays(localDateString(), -week * 7) : null,
  };

  // --- Historial médico (el dolor y los síntomas se guardaban como texto traducido) ---
  const legacyMedical = await readJson<Partial<MedicalInfo> | null>("medical_info", null);
  const medical: MedicalInfo | null = legacyMedical && {
    ...emptyMedicalInfo,
    ...legacyMedical,
    painLevel: (String(legacyMedical.painLevel ?? "").match(/[1-5]/) ?? [""])[0],
    menstrualSymptoms: legacyMedicalLabelsToKeys(legacyMedical.menstrualSymptoms ?? [], "menstruacion"),
    pregnancySymptoms: legacyMedicalLabelsToKeys(legacyMedical.pregnancySymptoms ?? [], "embarazo"),
    menopauseSymptoms: legacyMedicalLabelsToKeys(legacyMedical.menopauseSymptoms ?? [], "menopausia"),
  };

  // --- Doctores ---
  const pendingDoctors = await readJson<any[]>("pending_doctor_changes", []);
  const unsyncedIds = new Set(pendingDoctors.filter((c) => c.method === "POST").map((c) => String(c.doctorId)));
  const isServerId = (id: string) => /^\d+$/.test(id) && Number(id) < 1e11 && !unsyncedIds.has(id);
  const doctors: LocalDoctor[] = (await readJson<any[]>("doctor", [])).map((d) => ({
    id: String(d.id),
    serverId: isServerId(String(d.id)) ? Number(d.id) : undefined,
    name: d.name ?? "",
    professionalism: d.professionalism ?? "",
    phonenumber: d.phonenumber ?? "",
    details: d.details ?? "",
    createdAt: d.createdAt ?? new Date().toISOString(),
  }));

  // --- Resumen del chat (antes solo se guardaba el del día) ---
  const summary = await readJson<{ date?: string; text?: string } | null>("chat_summary", null);
  const summaries: Record<string, string> = summary?.date ? { [summary.date]: summary.text ?? "" } : {};

  // --- Guardar en el espacio de la cuenta ---
  const values: Record<string, unknown> = {
    daily_logs: logs,
    reminders,
    profile,
    doctors,
    chat_summaries: summaries,
    ...(medical ? { medical_info: medical } : {}),
  };
  const photo = await AsyncStorage.getItem("profile_photo_uri");
  if (photo) values["device:profile_photo_uri"] = photo;
  const accountType = await AsyncStorage.getItem("account_type");
  if (accountType) values["device:account_type"] = accountType;

  if (isAccountScope(scope)) {
    const queue: SyncOp[] = [{ kind: "profile" }];
    if (medical) queue.push({ kind: "medical" });
    Object.keys(logs).forEach((date) => queue.push({ kind: "daily_log", date }));
    Object.keys(summaries).forEach((date) => queue.push({ kind: "chat_summary", date }));
    reminders.forEach((r) => queue.push({ kind: "reminder", localId: r.localId }));
    doctors
      .filter((d) => d.serverId === undefined || pendingDoctors.some((c) => String(c.doctorId) === d.id))
      .forEach((d) => queue.push({ kind: "doctor", localId: d.id, serverId: d.serverId }));
    pendingDoctors
      .filter((c) => c.method === "DELETE" && isServerId(String(c.doctorId)))
      .forEach((c) => queue.push({ kind: "doctor", localId: String(c.doctorId), serverId: Number(c.doctorId) }));
    values.sync_queue = queue.map((op, index) => ({ ...op, rev: index + 1 }));
  }

  const hasLegacyData = (await AsyncStorage.multiGet(LEGACY_KEYS)).some(([, value]) => value !== null);
  if (hasLegacyData) {
    await AsyncStorage.multiSet(
      Object.entries(values).map(([key, value]) => [scopeKey(scope, key), JSON.stringify(value)])
    );
  }
  await AsyncStorage.multiRemove(LEGACY_KEYS);
  await AsyncStorage.setItem(DONE_KEY, "true");
}
