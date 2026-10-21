// sync/engine.ts
//
// Sube la cola de cambios y descarga los datos del servidor.
//
// Reglas:
// - Cada cambio se guarda primero en el teléfono; subirlo es asíncrono. Sin conexión
//   la app funciona igual y los cambios esperan en la cola.
// - Si un registro tiene un cambio pendiente en el teléfono, gana el del teléfono;
//   si no, gana el del servidor (así llegan los cambios hechos en otro dispositivo).
// - Errores (ver docs/api.md del backend):
//     sin conexión / 5xx / 401   -> se detiene y reintenta después
//     404 al borrar               -> ya estaba borrado
//     otros 4xx                   -> el servidor nunca lo aceptará: se descarta para no
//                                    bloquear los demás cambios

import { clearTokens } from "@/storage/authTokenStorage";
import type { HealthStage } from "@/storage/healthStageStorage";
import { schedulePeriodReminder } from "@/utils/notifications";
import { cancelReminder, scheduleReminder } from "@/utils/reminderScheduler";
import { dmyToIso, isoToDmy } from "@/utils/dates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { ApiError, authedRequest, isNetworkError } from "@/services/apiClient";
import { choicesToMedicalItems, medicalItemsToChoices, SymptomChoice } from "./codes";
import { enqueue, getQueue, opKey, pendingKeys, removeSent, setOnEnqueue, SyncOp } from "./queue";
import {
  getScope,
  isAccountScope,
  isSessionExpired,
  keysOfScope,
  scopeKey,
  setScope,
  setSessionExpired,
  setStorageReady,
  userIdFromToken,
} from "./session";
import {
  getChatSummaries,
  getDailyLogs,
  getDoctorsLocal,
  getMedical,
  getProfile,
  getReminders,
  LocalDailyLog,
  LocalDoctor,
  LocalProfile,
  LocalReminder,
  MedicalInfo,
  newId,
  replaceChatSummaries,
  replaceDailyLogs,
  saveDoctorsLocal,
  saveMedical,
  saveReminders,
  updateProfile,
} from "./store";

// ---------- Conversión entre el teléfono y la API ----------

const symptomsToApi = (choices: SymptomChoice[]) =>
  choices.map((c) => ("code" in c ? { code: c.code } : { custom_label: c.customLabel }));

const symptomsFromApi = (items: any[]): SymptomChoice[] =>
  (items ?? []).map((s) => (s.code ? { code: s.code } : { customLabel: s.custom_label }));

function dailyLogToApi(log: LocalDailyLog) {
  return {
    stage: log.stage,
    mood: log.mood,
    exercise: log.exercise,
    notes: log.notes,
    period: log.period,
    baby_movement: log.babyMovement,
    doctor_appointment: log.doctorAppointment,
    took_vitamins: log.tookVitamins,
    symptoms: symptomsToApi(log.symptoms),
  };
}

function dailyLogFromApi(d: any): LocalDailyLog {
  return {
    date: d.date,
    stage: d.stage,
    mood: d.mood ?? "",
    exercise: !!d.exercise,
    notes: d.notes ?? "",
    period: !!d.period,
    babyMovement: !!d.baby_movement,
    doctorAppointment: !!d.doctor_appointment,
    tookVitamins: !!d.took_vitamins,
    symptoms: symptomsFromApi(d.symptoms),
  };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function reminderToApi(r: LocalReminder) {
  return {
    client_id: UUID_RE.test(r.localId) ? r.localId : undefined,
    kind: r.kind,
    name: r.name.slice(0, 200),
    scheduled_at: r.scheduledAt || null,
    description: r.description,
    reminder_offset: r.reminderOffset,
    log_date: r.logDate,
  };
}

function reminderFromApi(d: any, existing?: LocalReminder): LocalReminder {
  return {
    localId: existing?.localId ?? d.client_id ?? newId(),
    serverId: d.id,
    kind: d.kind,
    name: d.name ?? "",
    scheduledAt: d.scheduled_at,
    description: d.description ?? "",
    reminderOffset: d.reminder_offset ?? "none",
    logDate: d.log_date,
    notificationId: existing?.notificationId,
  };
}

function doctorToApi(d: LocalDoctor) {
  return {
    client_id: UUID_RE.test(d.id) ? d.id : undefined,
    name: d.name.slice(0, 200),
    professionalism: d.professionalism.slice(0, 200),
    phonenumber: d.phonenumber.slice(0, 30),
    details: d.details,
  };
}

function doctorFromApi(d: any, existing?: LocalDoctor): LocalDoctor {
  return {
    id: existing?.id ?? d.client_id ?? `srv-${d.id}`,
    serverId: d.id,
    name: d.name ?? "",
    professionalism: d.professionalism ?? "",
    phonenumber: d.phonenumber ?? "",
    details: d.details ?? "",
    createdAt: d.created_at ?? new Date().toISOString(),
  };
}

function profileToApi(p: LocalProfile) {
  const birth = p.birthDate ? dmyToIso(p.birthDate) : null;
  return {
    first_name: p.firstName.slice(0, 150),
    last_name: p.lastName.slice(0, 150),
    phone: p.phone.slice(0, 30),
    // Si la fecha escrita no se entiende, no se envía (para no borrar la del servidor).
    ...(p.birthDate === "" ? { birth_date: null } : birth ? { birth_date: birth } : {}),
    health_stage: p.healthStage,
    onboarding_complete: p.onboardingComplete,
    cycle_tracking_start: p.cycleTrackingStart,
    pregnancy_start_date: p.pregnancyStartDate,
  };
}

function profileFromApi(d: any, local: LocalProfile): LocalProfile {
  return {
    ...local,
    firstName: d.first_name ?? "",
    lastName: d.last_name ?? "",
    email: d.email ?? local.email,
    phone: d.phone ?? "",
    birthDate: d.birth_date ?? "",
    healthStage: d.health_stage ?? local.healthStage,
    onboardingComplete: !!d.onboarding_complete,
    cycleTrackingStart: d.cycle_tracking_start ?? null,
    pregnancyStartDate: d.pregnancy_start_date ?? null,
  };
}

function numbersIn(text: string): number[] {
  return (String(text ?? "").match(/\d+(?:[.,]\d+)?/g) ?? []).map((n) => Number(n.replace(",", ".")));
}

/** "160cm" -> 160, "1.60" -> 160 (metros), "" -> null. */
function decimalOrNull(text: string, metersToCm = false): string | null {
  let value = numbersIn(text)[0];
  if (value === undefined) return null;
  if (metersToCm && value < 3) value *= 100;
  return value > 0 && value < 1000 ? value.toFixed(1) : null;
}

/** "29 días" -> 29, "5-7 días" -> 6 (promedio), "" -> null. */
function intOrNull(text: string): number | null {
  const numbers = numbersIn(text).slice(0, 2);
  if (!numbers.length) return null;
  const value = Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length);
  return value >= 0 && value <= 32767 ? value : null;
}

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const STAGE_LISTS: [HealthStage, "menstrualSymptoms" | "pregnancySymptoms" | "menopauseSymptoms"][] = [
  ["menstruacion", "menstrualSymptoms"],
  ["embarazo", "pregnancySymptoms"],
  ["menopausia", "menopauseSymptoms"],
];

function medicalToApi(m: MedicalInfo) {
  const blood = m.bloodType.replace(/\s/g, "").toUpperCase();
  const pain = numbersIn(m.painLevel)[0];
  return {
    occupation: m.occupation.slice(0, 200),
    city: m.city.slice(0, 200),
    insurance: m.insurance.slice(0, 200),
    emergency_name: m.emergencyName.slice(0, 200),
    emergency_phone: m.emergencyPhone.slice(0, 30),
    height_cm: decimalOrNull(m.height, true),
    weight_kg: decimalOrNull(m.weight),
    blood_type: BLOOD_TYPES.includes(blood) ? blood : "",
    current_illnesses: m.currentIllnesses,
    age_at_first_period: intOrNull(m.firstPeriodAge),
    cycle_length_days: intOrNull(m.cycleDuration),
    bleeding_days: intOrNull(m.bleedingDuration),
    menstrual_pain_level: pain >= 1 && pain <= 5 ? Math.trunc(pain) : null,
    pregnancies: intOrNull(m.pregnancyCount),
    medications: m.medications,
    allergies: m.allergies,
    surgeries: m.surgeries
      .filter((s) => s.reason.trim() || s.date.trim())
      .map((s) => ({ reason: s.reason.slice(0, 200), performed_on: dmyToIso(s.date) })),
    usual_symptoms: STAGE_LISTS.flatMap(([stage, field]) =>
      symptomsToApi(medicalItemsToChoices(m[field], stage)).map((s) => ({ stage, ...s }))
    ),
  };
}

const plainNumber = (value: string | number | null | undefined) =>
  value === null || value === undefined ? "" : String(Number(value));

function medicalFromApi(d: any, local: MedicalInfo): MedicalInfo {
  const surgeries = (d.surgeries ?? []).map((s: any) => ({ reason: s.reason ?? "", date: isoToDmy(s.performed_on) }));
  const symptomsFor = (stage: HealthStage) =>
    choicesToMedicalItems(
      symptomsFromApi((d.usual_symptoms ?? []).filter((s: any) => s.stage === stage)),
      stage
    );
  return {
    ...local, // nombre, nacimiento, teléfono y correo vienen del perfil, no de aquí
    height: plainNumber(d.height_cm),
    weight: plainNumber(d.weight_kg),
    bloodType: d.blood_type ?? "",
    occupation: d.occupation ?? "",
    city: d.city ?? "",
    insurance: d.insurance ?? "",
    emergencyName: d.emergency_name ?? "",
    emergencyPhone: d.emergency_phone ?? "",
    currentIllnesses: d.current_illnesses ?? "",
    surgeries,
    surgeryCount: surgeries.length ? String(surgeries.length) : "",
    firstPeriodAge: plainNumber(d.age_at_first_period),
    cycleDuration: plainNumber(d.cycle_length_days),
    bleedingDuration: plainNumber(d.bleeding_days),
    painLevel: plainNumber(d.menstrual_pain_level),
    pregnancyCount: plainNumber(d.pregnancies),
    menstrualSymptoms: symptomsFor("menstruacion"),
    pregnancySymptoms: symptomsFor("embarazo"),
    menopauseSymptoms: symptomsFor("menopausia"),
    medications: d.medications ?? "",
    allergies: d.allergies ?? "",
  };
}

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
});

// ---------- Subir cambios ----------

type Outcome = "done" | "stop";

async function sendOp(op: SyncOp): Promise<Outcome> {
  switch (op.kind) {
    case "profile":
      await authedRequest("/profile/", json("PATCH", profileToApi(await getProfile())));
      return "done";

    case "medical":
      await authedRequest("/medical-info/", json("PUT", medicalToApi(await getMedical())));
      return "done";

    case "daily_log": {
      const log = (await getDailyLogs())[op.date];
      const url = `/api/daily-logs/${op.date}/`;
      await authedRequest(url, log ? json("PUT", dailyLogToApi(log)) : json("DELETE"));
      return "done";
    }

    case "chat_summary": {
      const text = (await getChatSummaries())[op.date];
      const url = `/api/chat-summaries/${op.date}/`;
      await authedRequest(url, text !== undefined ? json("PUT", { text }) : json("DELETE"));
      return "done";
    }

    case "reminder":
      return sendEntity(op, "/api/reminders/", getReminders, saveReminders, (r) => r.localId, reminderToApi, reminderFromApi);

    case "doctor":
      return sendEntity(op, "/api/doctors/", getDoctorsLocal, saveDoctorsLocal, (d) => d.id, doctorToApi, doctorFromApi);
  }
}

/** Crear/actualizar/borrar un recordatorio o doctor (registros con id del servidor). */
async function sendEntity<T extends { serverId?: number }>(
  op: { localId: string; serverId?: number },
  baseUrl: string,
  load: () => Promise<T[]>,
  save: (items: T[]) => Promise<void>,
  idOf: (item: T) => string,
  toApi: (item: T) => object,
  fromApi: (data: any, existing?: T) => T
): Promise<Outcome> {
  const items = await load();
  const item = items.find((i) => idOf(i) === op.localId);
  const serverId = item?.serverId ?? op.serverId;

  if (!item) {
    if (serverId) await authedRequest(`${baseUrl}${serverId}/`, json("DELETE"));
    return "done";
  }

  let data: any;
  try {
    data = serverId
      ? await authedRequest(`${baseUrl}${serverId}/`, json("PUT", toApi(item)))
      : await authedRequest(baseUrl, json("POST", toApi(item)));
  } catch (error) {
    if (serverId && error instanceof ApiError && error.status === 404) {
      // Se borró en el servidor (por ejemplo desde otro teléfono): se vuelve a crear.
      data = await authedRequest(baseUrl, json("POST", toApi(item)));
    } else {
      throw error;
    }
  }

  const fresh = await load();
  if (!fresh.some((i) => idOf(i) === op.localId)) {
    // Se borró en el teléfono mientras se creaba: se borra también en el servidor.
    if (data?.id) await authedRequest(`${baseUrl}${data.id}/`, json("DELETE"));
    return "done";
  }
  await save(fresh.map((i) => (idOf(i) === op.localId ? fromApi(data, i) : i)));
  return "done";
}

let flushing: Promise<boolean> | null = null;

/** Sube los cambios pendientes. Devuelve true si la cola quedó vacía. */
export function flush(): Promise<boolean> {
  if (!flushing) {
    flushing = flushOnce().finally(() => {
      flushing = null;
    });
  }
  return flushing;
}

async function flushOnce(): Promise<boolean> {
  if (!isAccountScope(await getScope())) return true;

  for (const op of await getQueue()) {
    let outcome: Outcome;
    try {
      outcome = await sendOp(op);
    } catch (error) {
      if (isNetworkError(error)) return false;
      if (!(error instanceof ApiError)) {
        console.warn("Sync: error inesperado", opKey(op), error);
        return false;
      }
      if (error.status === 401) {
        if (await isSessionExpired()) warnSessionExpired();
        return false;
      }
      if (error.status >= 500) return false;
      if (error.status === 404 && op.kind !== "profile" && op.kind !== "medical") {
        outcome = "done"; // ya no existe en el servidor
      } else {
        console.warn("Sync: el servidor rechazó un cambio y se descarta", opKey(op), error.body);
        outcome = "done";
      }
    }

    if (outcome === "done") await removeSent(op);
  }
  return (await getQueue()).length === 0;
}

// ---------- Descargar datos del servidor ----------

async function pullResource<T>(load: () => Promise<T>): Promise<T | null> {
  try {
    return await load();
  } catch (error) {
    if (!isNetworkError(error)) console.warn("Sync: no se pudo descargar", error);
    return null;
  }
}

const MIN_PULL_INTERVAL_MS = 30000;
let pulling: Promise<void> | null = null;
let lastPullAt = 0;

/**
 * Trae todo del servidor; lo que tiene cambios pendientes en el teléfono no se toca.
 * Las descargas simultáneas se unen en una y, salvo `force`, hay como mucho una cada 30 s
 * (los avisos de conexión pueden llegar muchas veces seguidas).
 */
export function pull(force = false): Promise<void> {
  if (pulling) return pulling;
  if (!force && Date.now() - lastPullAt < MIN_PULL_INTERVAL_MS) return Promise.resolve();
  pulling = pullOnce().finally(() => {
    lastPullAt = Date.now();
    pulling = null;
  });
  return pulling;
}

async function pullOnce(): Promise<void> {
  const scope = await getScope();
  if (!isAccountScope(scope)) return;

  const [profile, medical, logs, summaries, reminders, doctors] = await Promise.all([
    pullResource(() => authedRequest("/profile/")),
    pullResource(() => authedRequest("/medical-info/")),
    pullResource(() => authedRequest("/api/daily-logs/")),
    pullResource(() => authedRequest("/api/chat-summaries/")),
    pullResource(() => authedRequest("/api/reminders/")),
    pullResource(() => authedRequest("/api/doctors/")),
  ]);

  // Si cerró sesión mientras se descargaba, estos datos no son de la cuenta activa.
  if ((await getScope()) !== scope) return;
  // Se calcula después de la descarga: un cambio hecho mientras tanto no se pisa.
  const pending = await pendingKeys();

  if (profile && !pending.has("profile")) {
    await updateProfile(profileFromApi(profile, await getProfile()), { sync: false });
  }

  if (medical && !pending.has("medical")) {
    await saveMedical(medicalFromApi(medical, await getMedical()), { sync: false });
  }

  if (logs) {
    const local = await getDailyLogs();
    const merged: Record<string, LocalDailyLog> = {};
    for (const [date, log] of Object.entries(local)) {
      if (pending.has(`daily_log:${date}`)) merged[date] = log;
    }
    for (const remote of logs as any[]) {
      if (!pending.has(`daily_log:${remote.date}`)) merged[remote.date] = dailyLogFromApi(remote);
    }
    await replaceDailyLogs(merged);
  }

  if (summaries) {
    const local = await getChatSummaries();
    const merged: Record<string, string> = {};
    for (const [date, text] of Object.entries(local)) {
      if (pending.has(`chat_summary:${date}`)) merged[date] = text;
    }
    for (const remote of summaries as any[]) {
      if (!pending.has(`chat_summary:${remote.date}`)) merged[remote.date] = remote.text ?? "";
    }
    await replaceChatSummaries(merged);
  }

  if (reminders) {
    const local = await getReminders();
    const merged = mergeEntities(local, reminders as any[], "reminder", pending, (r) => r.localId, reminderFromApi);
    for (const removed of local.filter((r) => !merged.some((m) => m.localId === r.localId))) {
      await cancelReminder(removed.notificationId);
    }
    await saveReminders(merged);
    await scheduleMissingNotifications();
  }

  if (doctors) await mergeDoctors(doctors as any[], pending);
}

async function mergeDoctors(remote: any[], pending: Set<string>): Promise<void> {
  const local = await getDoctorsLocal();
  await saveDoctorsLocal(mergeEntities(local, remote, "doctor", pending, (d) => d.id, doctorFromApi));
}

/** Solo doctores (pantalla de doctores): sube lo pendiente y descarga la lista. */
export async function syncDoctors(): Promise<boolean> {
  const flushed = await flush();
  if (!isAccountScope(await getScope())) return false;
  const remote = await pullResource(() => authedRequest("/api/doctors/"));
  if (remote) await mergeDoctors(remote as any[], await pendingKeys());
  return flushed && remote !== null;
}

function mergeEntities<T extends { serverId?: number }>(
  local: T[],
  remote: any[],
  kind: "reminder" | "doctor",
  pending: Set<string>,
  idOf: (item: T) => string,
  fromApi: (data: any, existing?: T) => T
): T[] {
  const isPending = (item: T) => pending.has(`${kind}:${idOf(item)}`);
  const result: T[] = local.filter((item) => isPending(item) || item.serverId === undefined);
  for (const data of remote) {
    const existing = local.find((item) => item.serverId === data.id || idOf(item) === data.client_id);
    if (existing && isPending(existing)) continue;
    result.push(fromApi(data, existing));
  }
  return result;
}

// ---------- Notificaciones de citas y suplementos ----------

/** Programa las notificaciones de los recordatorios que llegaron de otro teléfono. */
async function scheduleMissingNotifications(): Promise<void> {
  const reminders = await getReminders();
  let changed = false;
  for (const r of reminders) {
    if (r.notificationId || !r.scheduledAt || r.reminderOffset === "none") continue;
    const id = await scheduleReminder(r.kind, r.name, r.scheduledAt, r.reminderOffset);
    if (id) {
      r.notificationId = id;
      changed = true;
    }
  }
  if (changed) await saveReminders(reminders);
}

/** Al salir de una cuenta, sus avisos dejan de sonar en este teléfono. */
async function cancelScopeNotifications(): Promise<void> {
  const reminders = await getReminders();
  const scheduled = reminders.filter((r) => r.notificationId);
  if (!scheduled.length) return;
  for (const r of scheduled) {
    await cancelReminder(r.notificationId);
    r.notificationId = undefined;
  }
  await saveReminders(reminders);
}

// ---------- Sesión ----------

let syncTimer: ReturnType<typeof setTimeout> | null = null;

/** Pide subir los cambios pronto (agrupa varios cambios seguidos en un solo envío). */
export function requestSync(delayMs = 1500): void {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncTimer = null;
    void flush();
  }, delayMs);
}

/** Sube lo pendiente y después descarga lo del servidor. */
export async function syncNow(force = false): Promise<void> {
  await flush();
  await pull(force);
}

async function switchScope(next: "guest" | `user:${string}`): Promise<void> {
  if ((await getScope()) === next) return;
  await cancelScopeNotifications();
  await setScope(next);
  await scheduleMissingNotifications();
  await schedulePeriodReminder().catch(() => {});
}

/** Después de iniciar sesión o crear la cuenta: activa el espacio de esa usuaria. */
export async function signIn(accessToken: string): Promise<void> {
  const userId = userIdFromToken(accessToken);
  if (!userId) return;
  await setSessionExpired(false);
  await switchScope(`user:${userId}`);
}

let warnedExpired = false;

/** Una vez por apertura de la app: la sesión venció y hay cambios esperando para subir. */
function warnSessionExpired(): void {
  if (warnedExpired) return;
  warnedExpired = true;
  Alert.alert(
    "Tu sesión expiró",
    "Vuelve a iniciar sesión para seguir guardando tus datos en tu cuenta. Lo que registres mientras tanto se queda en este teléfono y se subirá después."
  );
}

export async function signOut(): Promise<void> {
  await flush().catch(() => false);
  await clearTokens();
  await switchScope("guest");
}

/**
 * Cuenta creada desde el modo invitada: los datos de invitada pasan a la cuenta nueva
 * y se suben todos.
 */
export async function adoptGuestData(): Promise<void> {
  const target = await getScope();
  if (!isAccountScope(target)) return;
  const keys = await keysOfScope("guest");
  for (const key of keys) {
    const value = await AsyncStorage.getItem(scopeKey("guest", key));
    if (value !== null && (await AsyncStorage.getItem(scopeKey(target, key))) === null) {
      await AsyncStorage.setItem(scopeKey(target, key), value);
    }
  }
  await AsyncStorage.multiRemove(keys.map((key) => scopeKey("guest", key)));
  await enqueueEverything();
  // Las notificaciones de invitada se cancelaron al cambiar de cuenta: se vuelven a programar.
  await scheduleMissingNotifications();
}

/** Marca todos los datos locales como pendientes (primera subida de una cuenta). */
export async function enqueueEverything(): Promise<void> {
  const ops: SyncOp[] = [{ kind: "profile" }, { kind: "medical" }];
  for (const date of Object.keys(await getDailyLogs())) ops.push({ kind: "daily_log", date });
  for (const date of Object.keys(await getChatSummaries())) ops.push({ kind: "chat_summary", date });
  for (const r of await getReminders()) ops.push({ kind: "reminder", localId: r.localId, serverId: r.serverId });
  for (const d of await getDoctorsLocal()) ops.push({ kind: "doctor", localId: d.id, serverId: d.serverId });
  await enqueue(...ops);
}

let started = false;

/** Se llama una vez al abrir la app (app/_layout.tsx). */
export async function startSync(migrate: () => Promise<void>): Promise<void> {
  if (started) return;
  started = true;
  try {
    await migrate();
  } finally {
    setStorageReady();
  }
  setOnEnqueue(() => requestSync());
  if (isAccountScope(await getScope())) {
    void syncNow().catch((error) => console.warn("Sync inicial falló", error));
  }
}
