// sync/codes.ts
//
// Traducción entre lo que muestran las pantallas y los códigos del servidor.
// El servidor guarda códigos fijos (catálogo /api/symptoms/ y ánimos de DailyLog);
// las pantallas siguen usando sus etiquetas y emojis de siempre.

import type { HealthStage } from "@/storage/healthStageStorage";
import { TranslationKey, translations } from "@/translations";

export type SymptomChoice = { code: string } | { customLabel: string };

// --- Calendario: identificadores en español que usa app/(tabs)/calendar.tsx ---

const CALENDAR_LABELS: Record<HealthStage, Record<string, string>> = {
  menstruacion: {},
  embarazo: {
    "Nausea": "nausea",
    "Dolor de cabeza": "headache",
    "Fatiga/cansancio": "fatigue",
    "Acidez estomacal": "heartburn",
    "Hinchazón de los pies": "swollen_feet",
    "Dolor de espalda": "back_pain",
    "Mareos": "dizziness",
    "Cambios de humor": "mood_swings",
  },
  menopausia: {
    "Sofocos(sensación repentina de calor en el cuerpo)": "hot_flashes",
    "Sudores nocturnos": "night_sweats",
    "Cambios de humor": "mood_swings",
    "Problemas para dormir": "sleep_problems",
    "Fatiga/cansancio": "fatigue",
    "Dolores de cabeza": "headache",
    "Mareos": "dizziness",
    "Dolor articular (rodillas, muñecas, hombros, etc.)": "joint_pain",
  },
};

function invert(map: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(map).map(([label, code]) => [code, label]));
}

const ANY_CALENDAR_LABEL: Record<string, string> = {
  ...CALENDAR_LABELS.embarazo,
  ...CALENDAR_LABELS.menopausia,
};

/** Etiquetas del calendario -> síntomas para el servidor (lo desconocido va como texto libre). */
export function calendarLabelsToChoices(labels: string[]): SymptomChoice[] {
  const seen = new Set<string>();
  const choices: SymptomChoice[] = [];
  for (const raw of labels) {
    const label = raw.trim();
    if (!label) continue;
    const code = ANY_CALENDAR_LABEL[label];
    const identity = code ? `code:${code}` : `custom:${label}`;
    if (seen.has(identity)) continue;
    seen.add(identity);
    choices.push(code ? { code } : { customLabel: label.slice(0, 100) });
  }
  return choices;
}

/** Síntomas guardados -> etiquetas que entiende el calendario en esa etapa. */
export function choicesToCalendarLabels(choices: SymptomChoice[], stage: HealthStage): string[] {
  const forStage = invert(CALENDAR_LABELS[stage]);
  const fallback = invert(ANY_CALENDAR_LABEL);
  return choices.map((choice) =>
    "code" in choice ? forStage[choice.code] ?? fallback[choice.code] ?? choice.code : choice.customLabel
  );
}

// --- Historial médico: claves de traducción que usa app/(tabs)/perfil/medical.tsx ---

export const MEDICAL_SYMPTOM_KEYS: Record<HealthStage, Record<string, string>> = {
  menstruacion: {
    colicos: "cramps",
    dolorCabeza: "headache",
    cansancio: "fatigue",
    dolorEspalda: "back_pain",
    hinchazon: "bloating",
    nauseas: "nausea",
    mareos: "dizziness",
    cambiosHumor: "mood_swings",
    antojos: "cravings",
    pocoSueno: "sleep_problems",
    diarrea: "diarrhea",
    estrenimiento: "constipation",
    dolorPiernas: "leg_pain",
    sangreAbundante: "heavy_bleeding",
    manchado: "spotting",
  },
  embarazo: {
    nausea: "nausea",
    dolorCabezaEmbarazo: "headache",
    fatiga: "fatigue",
    acidezEstomacal: "heartburn",
    hinchazonPies: "swollen_feet",
    dolorEspaldaEmbarazo: "back_pain",
    mareosEmbarazo: "dizziness",
    cambiosHumorEmbarazo: "mood_swings",
  },
  menopausia: {
    sofocos: "hot_flashes",
    sudoresNocturnos: "night_sweats",
    cambiosHumorMenopausia: "mood_swings",
    problemasDormir: "sleep_problems",
    fatigaMenopausia: "fatigue",
    doloresCabeza: "headache",
    mareosMenopausia: "dizziness",
    dolorArticular: "joint_pain",
  },
};

/** Claves del formulario médico (o texto libre) -> síntomas para el servidor. */
export function medicalItemsToChoices(items: string[], stage: HealthStage): SymptomChoice[] {
  const keys = MEDICAL_SYMPTOM_KEYS[stage];
  const seen = new Set<string>();
  const choices: SymptomChoice[] = [];
  for (const raw of items) {
    const item = raw.trim();
    if (!item) continue;
    const code = keys[item];
    const identity = code ? `code:${code}` : `custom:${item}`;
    if (seen.has(identity)) continue;
    seen.add(identity);
    choices.push(code ? { code } : { customLabel: item.slice(0, 100) });
  }
  return choices;
}

export function choicesToMedicalItems(choices: SymptomChoice[], stage: HealthStage): string[] {
  const byCode = invert(MEDICAL_SYMPTOM_KEYS[stage]);
  return choices.map((choice) =>
    "code" in choice ? byCode[choice.code] ?? choice.code : choice.customLabel
  );
}

/**
 * Antes el formulario médico guardaba el texto traducido ("Cólicos (dolor en el abdomen)").
 * Convierte esos textos, en cualquier idioma, a su clave; lo que no reconoce queda como texto libre.
 */
export function legacyMedicalLabelsToKeys(items: string[], stage: HealthStage): string[] {
  const keys = Object.keys(MEDICAL_SYMPTOM_KEYS[stage]) as TranslationKey[];
  const byLabel = new Map<string, string>();
  for (const key of keys) {
    for (const dict of [translations.es, translations.en, translations.mis] as Record<string, string>[]) {
      const label = dict[key];
      if (label) byLabel.set(label.trim().toLowerCase(), key);
    }
  }
  return items.map((item) => (keys.includes(item as TranslationKey) ? item : byLabel.get(item.trim().toLowerCase()) ?? item));
}

// --- Estado de ánimo ---

export type MoodCode = "very_happy" | "good" | "neutral" | "tired" | "sad" | "very_sad" | "angry";

const EMOJI_TO_MOOD: Record<string, MoodCode> = {
  "😊": "very_happy",
  "🙂": "good",
  "😐": "neutral",
  "🥱": "tired",
  "😔": "sad",
  "😭": "very_sad",
  "😠": "angry",
  "😡": "angry",
};

/** Emoji de cualquier pantalla -> código; "" si no hay ánimo. */
export function emojiToMood(emoji: string | null | undefined): MoodCode | "" {
  return (emoji && EMOJI_TO_MOOD[emoji.trim()]) || "";
}

/** Código -> emoji. El calendario y la tarjeta de inicio usan un emoji distinto para "enojada". */
export function moodToEmoji(mood: string, screen: "calendar" | "tracker"): string {
  if (!mood) return "";
  if (mood === "angry") return screen === "calendar" ? "😡" : "😠";
  return Object.entries(EMOJI_TO_MOOD).find(([, code]) => code === mood)?.[0] ?? "";
}
