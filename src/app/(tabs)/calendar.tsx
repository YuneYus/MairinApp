// app/(tabs)/calendar.tsx

import PinkHeader from "@/components/PinkHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { speakIfEnabled } from "@/hooks/useSpeak";
import { colors, globalStyles } from "@/styles/global";
import { TranslationKey, translations } from "@/translations";
import type { AppLanguage } from "@/storage/languageStorage";
import { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

import { Ionicons } from "@expo/vector-icons";

import { useFocusEffect } from "expo-router";

import { getHealthStage, HealthStage } from "@/storage/healthStageStorage";
import {
  getMenopauseEntries,
  getMenopauseEntry,
  saveMenopauseEntry,
  Supplement,
} from "../../storage/menopauseStorage";
import {
  getMenstruationEntries,
  getMenstruationEntry,
  saveMenstruationEntry,
} from "../../storage/menstruationStorage";
import {
  Appointment,
  getPregnancyEntries,
  getPregnancyEntry,
  ReminderOffset,
  savePregnancyEntry,
} from "../../storage/pregnancyStorage";

import { schedulePeriodReminder } from "@/utils/notifications";
import {
  cancelReminder,
  REMINDER_OPTIONS,
  scheduleReminder,
} from "@/utils/reminderScheduler";
import DateTimePicker from "@react-native-community/datetimepicker";

// --- react-native-calendars locale setup (both languages) ---

LocaleConfig.locales["es"] = {
  monthNames: [
    translations.es.Enero, translations.es.Febrero, translations.es.Marzo,
    translations.es.abril, translations.es.mayo, translations.es.junio,
    translations.es.julio, translations.es.agosto, translations.es.septiembre,
    translations.es.octubre, translations.es.noviembre, translations.es.diciembre,
  ],
  monthNamesShort: [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ],
  dayNames: [
    translations.es.dom, translations.es.Lun, translations.es.mar,
    translations.es.mier, translations.es.jue, translations.es.vier, translations.es.sat,
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  today: "Hoy",
};

LocaleConfig.locales["mis"] = {
  monthNames: [
    translations.mis.Enero, translations.mis.Febrero, translations.mis.Marzo,
    translations.mis.abril, translations.mis.mayo, translations.mis.junio,
    translations.mis.julio, translations.mis.agosto, translations.mis.septiembre,
    translations.mis.octubre, translations.mis.noviembre, translations.mis.diciembre,
  ],
  monthNamesShort: [
    translations.mis.Enero, translations.mis.Febrero, translations.mis.Marzo,
    translations.mis.abril, translations.mis.mayo, translations.mis.junio,
    translations.mis.julio, translations.mis.agosto, translations.mis.septiembre,
    translations.mis.octubre, translations.mis.noviembre, translations.mis.diciembre,
  ],
  dayNames: [
    translations.mis.dom, translations.mis.Lun, translations.mis.mar,
    translations.mis.mier, translations.mis.jue, translations.mis.vier, translations.mis.sat,
  ],
  dayNamesShort: [
    translations.mis.dom, translations.mis.Lun, translations.mis.mar,
    translations.mis.mier, translations.mis.jue, translations.mis.vier, translations.mis.sat,
  ],
  today: "Today",
};

LocaleConfig.defaultLocale = "es";

// --- symptom lists (kept as Spanish identifiers for storage) ---

const PREGNANCY_SYMPTOMS = [
  "Nausea", "Dolor de cabeza", "Fatiga/cansancio", "Acidez estomacal",
  "Hinchazón de los pies", "Dolor de espalda", "Mareos", "Cambios de humor",
];

const MENOPAUSE_SYMPTOMS = [
  "Sofocos(sensación repentina de calor en el cuerpo)", "Sudores nocturnos",
  "Cambios de humor", "Problemas para dormir", "Fatiga/cansancio",
  "Dolores de cabeza", "Mareos", "Dolor articular (rodillas, muñecas, hombros, etc.)",
];

// maps each symptom identifier -> translation key, for DISPLAY only
const PREGNANCY_SYMPTOM_KEYS: Record<string, TranslationKey> = {
  "Nausea": "Nausea",
  "Dolor de cabeza": "dolorCabeza",
  "Fatiga/cansancio": "fatigaCansancio",
  "Acidez estomacal": "aceidezEstomacal",
  "Hinchazón de los pies": "hinchazonPies",
  "Dolor de espalda": "dolorEspalda",
  "Mareos": "mareos",
  "Cambios de humor": "cambioHumor",
};

const MENOPAUSE_SYMPTOM_KEYS: Record<string, TranslationKey> = {
  "Sofocos(sensación repentina de calor en el cuerpo)": "sofoco",
  "Sudores nocturnos": "sudonesNocturno",
  "Cambios de humor": "cambioHumor",
  "Problemas para dormir": "problemaDormir",
  "Fatiga/cansancio": "fatigaCansancio",
  "Dolores de cabeza": "dolorCabeza",
  "Mareos": "mareos",
  "Dolor articular (rodillas, muñecas, hombros, etc.)": "dolorArticular",
};

const WEEKDAY_KEYS: TranslationKey[] = ["dom", "Lun", "mar", "mier", "jue", "vier", "sat"];
const MONTH_KEYS: TranslationKey[] = [
  "Enero", "Febrero", "Marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const emptyAppointment: Appointment = {
  name: "",
  time: new Date().toISOString(),
  description: "",
  reminderOffset: "1hour",
};
const emptySupplement: Supplement = {
  name: "",
  time: new Date().toISOString(),
  description: "",
  reminderOffset: "1hour",
};

type SearchResult = {
  date: string;
  snippet: string;
};

export default function CalendarScreen() {
  const { t, language } = useLanguage();
  const showSpeakerIcons = language === "es";

  // keep react-native-calendars in sync with the current language
  LocaleConfig.defaultLocale = language === "mis" ? "mis" : "es";

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(todayString);
  const [healthStage, setHealthStage] = useState<HealthStage>("menstruacion");
  const [markedDates, setMarkedDates] = useState<any>({});

  const [period, setPeriod] = useState(false);
  const [exercise, setExercise] = useState(false);
  const [mood, setMood] = useState("");

  const [babyMovement, setBabyMovement] = useState(false);
  const [doctorAppointment, setDoctorAppointment] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([emptyAppointment]);

  const [menopauseExercise, setMenopauseExercise] = useState(false);
  const [vitamins, setVitamins] = useState(false);
  const [supplements, setSupplements] = useState<Supplement[]>([emptySupplement]);

  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [customSymptoms, setCustomSymptoms] = useState<string[]>([]);
  const [otherSymptom, setOtherSymptom] = useState("");
  const [notes, setNotes] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const resetFields = () => {
    setPeriod(false);
    setExercise(false);
    setMood("");
    setBabyMovement(false);
    setDoctorAppointment(false);
    setAppointments([emptyAppointment]);
    setMenopauseExercise(false);
    setVitamins(false);
    setSupplements([emptySupplement]);
    setSymptoms([]);
    setCustomSymptoms([]);
    setOtherSymptom("");
    setNotes("");
  };

  const loadEntry = useCallback(async (stage: HealthStage, date: string) => {
    resetFields();

    if (stage === "menstruacion") {
      const data = await getMenstruationEntry(date);
      if (data) {
        setPeriod(data.period ?? false);
        setExercise(data.exercise ?? false);
        setMood(data.mood ?? "");
        setNotes(data.notes ?? "");
      }
      return;
    }

    if (stage === "embarazo") {
      const data = await getPregnancyEntry(date);
      if (data) {
        setBabyMovement(data.babyMovement ?? false);
        setDoctorAppointment(data.doctorAppointment ?? false);
        setAppointments(
          data.appointments?.length ? data.appointments : [emptyAppointment]
        );
        const allSymptoms = data.symptoms ?? [];
        setSymptoms(allSymptoms.filter((s) => PREGNANCY_SYMPTOMS.includes(s)));
        setCustomSymptoms(allSymptoms.filter((s) => !PREGNANCY_SYMPTOMS.includes(s)));
        setNotes(data.notes ?? "");
      }
      return;
    }

    if (stage === "menopausia") {
      const data = await getMenopauseEntry(date);
      if (data) {
        setMenopauseExercise(data.exercise ?? false);
        setVitamins(data.vitamins ?? false);
        setSupplements(
          data.supplements?.length ? data.supplements : [emptySupplement]
        );
        const allSymptoms = data.symptoms ?? [];
        setSymptoms(allSymptoms.filter((s) => MENOPAUSE_SYMPTOMS.includes(s)));
        setCustomSymptoms(allSymptoms.filter((s) => !MENOPAUSE_SYMPTOMS.includes(s)));
        setNotes(data.notes ?? "");
      }
    }
  }, []);

  const loadMarkedDates = useCallback(
    async (stage: HealthStage, date: string) => {
      const marks: any = {};

      if (stage === "menstruacion") {
        const entries = await getMenstruationEntries();
        entries.forEach((entry: any) => {
          const dots = [];
          if (entry.period) dots.push({ key: "period", color: "#E91E63" });
          if (entry.exercise) dots.push({ key: "exercise", color: "#32ba39" });
          if (entry.mood) dots.push({ key: "mood", color: "#ffcf31" });
          marks[entry.date] = { dots };
        });
      }

      if (stage === "embarazo") {
        const entries = await getPregnancyEntries();
        entries.forEach((entry: any) => {
          const dots = [];
          if (entry.babyMovement) dots.push({ key: "baby", color: "#af10ff" });
          if (entry.doctorAppointment) dots.push({ key: "doctor", color: "#32ba39" });
          if (entry.symptoms?.length) dots.push({ key: "symptoms", color: "#ffcf31" });
          marks[entry.date] = { dots };
        });
      }

      if (stage === "menopausia") {
        const entries = await getMenopauseEntries();
        entries.forEach((entry: any) => {
          const dots = [];
          if (entry.exercise) dots.push({ key: "exercise", color: "#32ba39" });
          if (entry.vitamins) dots.push({ key: "vitamins", color: "#016bc1" });
          if (entry.symptoms?.length) dots.push({ key: "symptoms", color: "#ffcf31" });
          marks[entry.date] = { dots };
        });
      }

      marks[date] = {
        ...(marks[date] || {}),
        selected: true,
        selectedColor: "#E91E63",
      };

      setMarkedDates(marks);
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const stage = await getHealthStage();
        setHealthStage(stage);
        await loadEntry(stage, selectedDate);
        await loadMarkedDates(stage, selectedDate);
      };

      load();
    }, [selectedDate])
  );

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    if (!otherSymptom.trim()) return;
    setCustomSymptoms((prev) => [...prev, otherSymptom.trim()]);
    setOtherSymptom("");
  };

  const removeCustomSymptom = (symptom: string) => {
    setCustomSymptoms((prev) => prev.filter((item) => item !== symptom));
  };

  const updateAppointment = (
    index: number,
    field: keyof Appointment,
    value: any
  ) => {
    setAppointments((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addAppointment = () => {
    setAppointments((prev) => [...prev, { ...emptyAppointment }]);
  };

  const updateSupplement = (
    index: number,
    field: keyof Supplement,
    value: any
  ) => {
    setSupplements((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addSupplement = () => {
    setSupplements((prev) => [...prev, { ...emptySupplement }]);
  };

  const handleSave = async () => {
    const allSymptoms = [...symptoms, ...customSymptoms];

    if (healthStage === "menstruacion") {
      await saveMenstruationEntry({ date: selectedDate, period, exercise, mood, notes });
      await schedulePeriodReminder();
    }

    if (healthStage === "embarazo") {
      const cleanedAppointments = appointments.filter(
        (a) => a.name || a.description
      );

      for (const appt of cleanedAppointments) {
        await cancelReminder(appt.notificationId);
      }

      const appointmentsWithReminders = await Promise.all(
        cleanedAppointments.map(async (appt) => {
          const notificationId = await scheduleReminder(
            "Recordatorio de cita médica",
            `Tienes una cita con ${appt.name || "tu doctor(a)"} pronto.`,
            appt.time,
            appt.reminderOffset
          );
          return { ...appt, notificationId };
        })
      );

      await savePregnancyEntry({
        date: selectedDate,
        babyMovement,
        doctorAppointment,
        appointments: appointmentsWithReminders,
        symptoms: allSymptoms,
        notes,
      });
    }

    if (healthStage === "menopausia") {
      const cleanedSupplements = supplements.filter(
        (s) => s.name || s.description
      );

      for (const sup of cleanedSupplements) {
        await cancelReminder(sup.notificationId);
      }

      const supplementsWithReminders = await Promise.all(
        cleanedSupplements.map(async (sup) => {
          const notificationId = await scheduleReminder(
            "Recordatorio de suplemento",
            `Es hora de tomar tu suplemento: ${sup.name || ""}.`,
            sup.time,
            sup.reminderOffset
          );
          return { ...sup, notificationId };
        })
      );

      await saveMenopauseEntry({
        date: selectedDate,
        exercise: menopauseExercise,
        vitamins,
        supplements: supplementsWithReminders,
        symptoms: allSymptoms,
        notes,
      });
    }

    await loadMarkedDates(healthStage, selectedDate);
    Alert.alert("Guardado", "Tu día ha sido guardado.");
  };

  const runSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);

      const trimmed = query.trim().toLowerCase();
      if (!trimmed) {
        setSearchResults([]);
        return;
      }

      const results: SearchResult[] = [];

      if (healthStage === "menstruacion") {
        const entries = await getMenstruationEntries();
        entries.forEach((entry: any) => {
          if (entry.notes?.toLowerCase().includes(trimmed)) {
            results.push({ date: entry.date, snippet: entry.notes });
          }
        });
      }

      if (healthStage === "embarazo") {
        const entries = await getPregnancyEntries();
        entries.forEach((entry: any) => {
          if (entry.notes?.toLowerCase().includes(trimmed)) {
            results.push({ date: entry.date, snippet: entry.notes });
            return;
          }
          const match = (entry.appointments ?? []).find(
            (a: Appointment) =>
              a.name?.toLowerCase().includes(trimmed) ||
              a.description?.toLowerCase().includes(trimmed)
          );
          if (match) {
            results.push({
              date: entry.date,
              snippet: match.name || match.description,
            });
          }
        });
      }

      if (healthStage === "menopausia") {
        const entries = await getMenopauseEntries();
        entries.forEach((entry: any) => {
          if (entry.notes?.toLowerCase().includes(trimmed)) {
            results.push({ date: entry.date, snippet: entry.notes });
            return;
          }
          const match = (entry.supplements ?? []).find(
            (s: Supplement) =>
              s.name?.toLowerCase().includes(trimmed) ||
              s.description?.toLowerCase().includes(trimmed)
          );
          if (match) {
            results.push({
              date: entry.date,
              snippet: match.name || match.description,
            });
          }
        });
      }

      setSearchResults(results);
    },
    [healthStage]
  );

  const handleSelectResult = (date: string) => {
    setSelectedDate(date);
    setSearchQuery("");
    setSearchResults([]);
  };

  // translated date line below the calendar, built from our own weekday/month keys
  const selectedDateObj = new Date(`${selectedDate}T00:00:00`);
  const formattedDate = `${t(WEEKDAY_KEYS[selectedDateObj.getDay()])}, ${selectedDateObj.getDate()} de ${t(MONTH_KEYS[selectedDateObj.getMonth()])} de ${selectedDateObj.getFullYear()}`;

  const searchPlaceholder =
    healthStage === "menstruacion"
      ? "Buscar en notas..."
      : healthStage === "embarazo"
      ? "Buscar en citas o notas..."
      : "Buscar en suplementos o notas...";

  const pregnancySymptomLabel = (symptom: string) => {
    const key = PREGNANCY_SYMPTOM_KEYS[symptom];
    return key ? t(key) : symptom;
  };

  const menopauseSymptomLabel = (symptom: string) => {
    const key = MENOPAUSE_SYMPTOM_KEYS[symptom];
    return key ? t(key) : symptom;
  };

  const SpeakerIcon = ({ text, size = 18 }: { text: string; size?: number }) =>
    showSpeakerIcons ? (
      <TouchableOpacity
        onPress={() => speakIfEnabled(text, language)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name="volume-medium"
          size={size}
          color={colors.text}
          style={styles.speakerIcon}
        />
      </TouchableOpacity>
    ) : null;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.headerWrapper}>
        <PinkHeader title={t("calendario")} showBack={false} />
        {showSpeakerIcons && (
          <TouchableOpacity
            style={styles.headerSpeaker}
            onPress={() => speakIfEnabled(t("calendario"), language)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="volume-medium" size={20} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={globalStyles.content}>
        <View style={globalStyles.searchBar}>
          <TextInput
            value={searchQuery}
            onChangeText={runSearch}
            placeholder={searchPlaceholder}
            placeholderTextColor="#999"
            style={globalStyles.searchInput}
          />
          <Ionicons name="search" size={20} color="#999" />
        </View>

        {searchResults.length > 0 && (
          <View style={styles.searchResultsBox}>
            {searchResults.map((result, index) => (
              <TouchableOpacity
                key={`${result.date}-${index}`}
                style={styles.searchResultRow}
                onPress={() => handleSelectResult(result.date)}
              >
                <Text style={[styles.searchResultDate]}>
                  {new Date(`${result.date}T00:00:00`).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })}
                </Text>
                <Text style={[styles.searchResultSnippet]} numberOfLines={1}>
                  {result.snippet}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {searchQuery.trim().length > 0 && searchResults.length === 0 && (
          <Text style={styles.noResultsText}>Sin resultados</Text>
        )}

        <Calendar
          markingType="multi-dot"
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
        />

        <Text style={[globalStyles.label, { textAlign: "center", paddingTop: 10 }]}>
          {formattedDate}
        </Text>

        {healthStage === "menstruacion" && (
          <>
            <View style={styles.card}>
              <View style={styles.row}>
                <View style={styles.labelWithIcon}>
                  <Text style={[styles.switchLabel]} numberOfLines={2}>
                    🔴 {t("hoytengoRegla")}
                  </Text>
                  <SpeakerIcon text={t("hoytengoRegla")} />
                </View>
                <Switch value={period} onValueChange={setPeriod} trackColor={{ false: "#E5E5E5", true: "#A4195B" }} thumbColor="#FFFFFF" />
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.row}>
                <View style={styles.labelWithIcon}>
                  <Text style={globalStyles.label}>🟢 {t("hoyhiceEjercicio")}</Text>
                  <SpeakerIcon text={t("hoyhiceEjercicio")} />
                </View>
                <Switch value={exercise} onValueChange={setExercise} trackColor={{ false: "#E5E5E5", true: "#A4195B" }} thumbColor="#FFFFFF" />
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.titleWithIcon}>
                <Text style={globalStyles.label}>😊 {t("EstadoAnimo")}</Text>
                <SpeakerIcon text={t("EstadoAnimo")} />
              </View>
              <View style={styles.emojiRow}>
                {["😊", "🙂", "😐", "😔", "😡"].map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    onPress={() => setMood(emoji)}
                    style={[styles.moodButton, mood === emoji && styles.moodButtonSelected]}
                  >
                    <Text style={styles.moodEmoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {healthStage === "embarazo" && (
          <>
            <View style={styles.card}>
              <View style={styles.row}>
                <View style={styles.labelWithIcon}>
                  <Text style={[styles.switchLabel]} numberOfLines={2}>
                    🟣 {t("MovBebe")}
                  </Text>
                  <SpeakerIcon text={t("MovBebe")} />
                </View>
                <Switch value={babyMovement} onValueChange={setBabyMovement} trackColor={{ false: "#E5E5E5", true: "#A4195B" }} thumbColor="#FFFFFF" />
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.row}>
                <View style={styles.labelWithIcon}>
                  <Text style={globalStyles.label}>🟢 {t("citaMedica")}</Text>
                  <SpeakerIcon text={t("citaMedica")} />
                </View>
                <Switch value={doctorAppointment} onValueChange={setDoctorAppointment} trackColor={{ false: "#E5E5E5", true: "#A4195B" }} thumbColor="#FFFFFF" />
              </View>

              {doctorAppointment && (
                <>
                  {appointments.map((appt, index) => (
                    <AppointmentEditor
                      key={index}
                      item={appt}
                      onUpdate={(field, value) => updateAppointment(index, field, value)}
                      t={t}
                    />
                  ))}

                  <TouchableOpacity style={styles.addButton} onPress={addAppointment}>
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <SymptomsCard
              title={`🟡 ${t("sintomas")}`}
              symptomsList={PREGNANCY_SYMPTOMS}
              selected={symptoms}
              onToggle={toggleSymptom}
              customSymptoms={customSymptoms}
              otherSymptom={otherSymptom}
              onOtherChange={setOtherSymptom}
              onAddOther={addCustomSymptom}
              onRemoveCustom={removeCustomSymptom}
              labelFor={pregnancySymptomLabel}
              t={t}
              showSpeakerIcons={showSpeakerIcons}
              language={language}
            />
          </>
        )}

        {healthStage === "menopausia" && (
          <>
            <View style={styles.card}>
              <View style={styles.row}>
                <View style={styles.labelWithIcon}>
                  <Text style={globalStyles.label}>🟢 {t("ejercicio")}</Text>
                  <SpeakerIcon text={t("ejercicio")} />
                </View>
                <Switch value={menopauseExercise} onValueChange={setMenopauseExercise} trackColor={{ false: "#E5E5E5", true: "#A4195B" }} thumbColor="#FFFFFF" />
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.row}>
                <View style={styles.labelWithIcon}>
                  <Text style={[styles.switchLabel]} numberOfLines={2}>
                    🔵 {t("vitaminaSuplemento")}
                  </Text>
                  <SpeakerIcon text={t("vitaminaSuplemento")} />
                </View>
                <Switch value={vitamins} onValueChange={setVitamins} trackColor={{ false: "#E5E5E5", true: "#A4195B" }} thumbColor="#FFFFFF" />
              </View>

              {vitamins && (
                <>
                  {supplements.map((sup, index) => (
                    <AppointmentEditor
                      key={index}
                      item={sup}
                      onUpdate={(field, value) => updateSupplement(index, field, value)}
                      t={t}
                    />
                  ))}

                  <TouchableOpacity style={styles.addButton} onPress={addSupplement}>
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <SymptomsCard
              title={`🟡 ${t("sintomas")}`}
              symptomsList={MENOPAUSE_SYMPTOMS}
              selected={symptoms}
              onToggle={toggleSymptom}
              customSymptoms={customSymptoms}
              otherSymptom={otherSymptom}
              onOtherChange={setOtherSymptom}
              onAddOther={addCustomSymptom}
              onRemoveCustom={removeCustomSymptom}
              labelFor={menopauseSymptomLabel}
              t={t}
              showSpeakerIcons={showSpeakerIcons}
              language={language}
            />
          </>
        )}

        <View style={styles.card}>
          <Text style={globalStyles.label}>📝{t("nota")}</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder={t("quieroEscribir")}
            multiline
            style={[styles.notesInput, globalStyles.textNormal]}
          />
        </View>

        <TouchableOpacity style={globalStyles.actionButton} onPress={handleSave}>
          <Text style={globalStyles.actionButtonText}>{t("guardarCalendario")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function AppointmentEditor({
  item,
  onUpdate,
  t,
}: {
  item: {
    name: string;
    time: string;
    description: string;
    reminderOffset: ReminderOffset;
  };
  onUpdate: (
    field: "name" | "time" | "description" | "reminderOffset",
    value: any
  ) => void;
  t: (key: TranslationKey) => string;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [showReminderDropdown, setShowReminderDropdown] = useState(false);

  const dateObj = new Date(item.time);

  const formattedDateTime = dateObj.toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const reminderLabel =
    REMINDER_OPTIONS.find((r) => r.key === item.reminderOffset)?.label ??
    "Sin recordatorio";

  return (
    <View style={styles.subCard}>
      <TextInput
        style={styles.fieldInput}
        value={item.name}
        onChangeText={(text) => onUpdate("name", text)}
        placeholder={t("nombre")}
      />

      <TouchableOpacity style={styles.fieldInput} onPress={() => setShowPicker(true)}>
        <Text style={{ color: colors.text }}>{formattedDateTime}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={dateObj}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              onUpdate("time", selectedDate.toISOString());
            }
          }}
        />
      )}

      <TouchableOpacity
        style={styles.dropdownField}
        onPress={() => setShowReminderDropdown((p) => !p)}
      >
        <Text style={styles.dropdownValue}>{reminderLabel}</Text>
      </TouchableOpacity>

      {showReminderDropdown && (
        <View style={styles.dropdownList}>
          {REMINDER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={styles.dropdownOption}
              onPress={() => {
                onUpdate("reminderOffset", option.key);
                setShowReminderDropdown(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TextInput
        style={styles.fieldInput}
        value={item.description}
        onChangeText={(text) => onUpdate("description", text)}
        placeholder={t("descripcion")}
      />
    </View>
  );
}

function SymptomsCard({
  title,
  symptomsList,
  selected,
  onToggle,
  customSymptoms,
  otherSymptom,
  onOtherChange,
  onAddOther,
  onRemoveCustom,
  labelFor,
  t,
  showSpeakerIcons,
  language,
}: {
  title: string;
  symptomsList: string[];
  selected: string[];
  onToggle: (symptom: string) => void;
  customSymptoms: string[];
  otherSymptom: string;
  onOtherChange: (text: string) => void;
  onAddOther: () => void;
  onRemoveCustom: (symptom: string) => void;
  labelFor: (symptom: string) => string;
  t: (key: TranslationKey) => string;
  showSpeakerIcons: boolean;
  language: AppLanguage;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.titleWithIcon}>
        <Text style={globalStyles.label}>{title}</Text>
        {showSpeakerIcons && (
          <TouchableOpacity
            onPress={() => speakIfEnabled(title, language)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="volume-medium"
              size={18}
              color={colors.text}
              style={styles.speakerIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      {symptomsList.map((symptom) => (
        <TouchableOpacity key={symptom} onPress={() => onToggle(symptom)} style={styles.checkboxRow}>
          <Text style={globalStyles.textNormal}>
            {selected.includes(symptom) ? "☑" : "☐"} {labelFor(symptom)}
          </Text>
        </TouchableOpacity>
      ))}

      {customSymptoms.map((symptom) => (
        <TouchableOpacity
          key={symptom}
          onPress={() => onRemoveCustom(symptom)}
          style={styles.checkboxRow}
        >
          <Text style={globalStyles.textNormal}>☑ {symptom}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.otherRow}>
        <TextInput
          value={otherSymptom}
          onChangeText={onOtherChange}
          placeholder={t("otrosSintomas")}
          style={[styles.fieldInput, globalStyles.textNormal, { flex: 1, marginTop: 12 }]}
        />

        <TouchableOpacity style={styles.addButton} onPress={onAddOther}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: { position: "relative" },
  headerSpeaker: {
    position: "absolute",
    top: 60,
    right: 24,
  },
  speakerIcon: { marginLeft: 8 },
  titleWithIcon: { flexDirection: "row", alignItems: "center" },
  labelWithIcon: { flexDirection: "row", alignItems: "center", flex: 1 },

  searchResultsBox: {
    backgroundColor: "white",
    borderRadius: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#F0DCE4",
    overflow: "hidden",
  },
  searchResultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F6E4EC",
  },
  searchResultDate: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.text,
    width: 60,
  },
  searchResultSnippet: {
    flex: 1,
    fontSize: 14,
    color: "#444",
  },
  noResultsText: {
    marginTop: 8,
    fontSize: 13,
    color: "#999",
    paddingHorizontal: 4,
  },
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 18, marginTop: 18, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  subCard: { borderTopWidth: 1, borderTopColor: "#F0DCE4", marginTop: 14, paddingTop: 14 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  emojiRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  moodButton: { width: 55, height: 55, borderRadius: 28, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F5", borderWidth: 1, borderColor: "#DDD" },
  moodButtonSelected: { backgroundColor: "#F8BBD0", borderColor: colors.text, borderWidth: 2 },
  moodEmoji: { fontSize: 28 },
  fieldInput: { backgroundColor: "#FDE8EF", color: colors.text, borderRadius: 10, padding: 12, fontSize: 14, marginTop: 10 },
  checkboxRow: { marginTop: 12 },
  otherRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F6AFC5", alignItems: "center", justifyContent: "center", marginTop: 14, alignSelf: "center" },
  addButtonText: { fontSize: 20, fontWeight: "bold", color: colors.text },
  notesInput: { borderWidth: 1.5, borderColor: "#F6AFC5", borderRadius: 15, padding: 12, minHeight: 120, marginTop: 10, textAlignVertical: "top", fontSize: 16 },
  dropdownField: {
    backgroundColor: "#FDE8EF",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  dropdownValue: { fontSize: 14, color: colors.text },
  dropdownList: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F0DCE4",
    borderRadius: 10,
    marginTop: 4,
  },
  dropdownOption: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#F6E4EC" },
  dropdownOptionText: { fontSize: 13, color: "#222" },

  switchLabel: {
    flex: 1,
    flexShrink: 1,
    marginRight: 12,
    fontSize: 18,
    fontFamily: globalStyles.label.fontFamily,
  },
});