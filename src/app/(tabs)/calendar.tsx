// app/(tabs)/calendar.tsx

import { globalStyles } from "@/styles/global";
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

LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ],
  monthNamesShort: [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ],
  dayNames: [
    "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  today: "Hoy",
};

LocaleConfig.defaultLocale = "es";

const PREGNANCY_SYMPTOMS = [
  "Nausea", "Dolor de cabeza", "Fatiga/cansancio", "Acidez estomacal",
  "Hinchazón de los pies", "Dolor de espalda", "Mareos", "Cambios de humor",
];

const MENOPAUSE_SYMPTOMS = [
  "Sofocos(sensación repentina de calor en el cuerpo)", "Sudores nocturnos",
  "Cambios de humor", "Problemas para dormir", "Fatiga/cansancio",
  "Dolores de cabeza", "Mareos", "Dolor articular (rodillas, muñecas, hombros, etc.)",
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

  const formattedDate = new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
    "es-ES",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );

  const searchPlaceholder =
    healthStage === "menstruacion"
      ? "Buscar en notas..."
      : healthStage === "embarazo"
      ? "Buscar en citas o notas..."
      : "Buscar en suplementos o notas...";

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.LSBold}>Calendario</Text>

      <View style={styles.searchBar}>
        <TextInput
          value={searchQuery}
          onChangeText={runSearch}
          placeholder={searchPlaceholder}
            placeholderTextColor="#999"
          style={styles.searchInput}
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
              <Text style={styles.searchResultDate}>
                {new Date(`${result.date}T00:00:00`).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
              </Text>
              <Text style={styles.searchResultSnippet} numberOfLines={1}>
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

      <Text style={globalStyles.sectionTitle}>{formattedDate}</Text>

      {healthStage === "menstruacion" && (
        <>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.sectionTitle}>🔴 Hoy tengo la regla (menstruación)</Text>
              <Switch value={period} onValueChange={setPeriod} trackColor={{ false: "#E5E5E5", true: "#A4195B" }} thumbColor="#FFFFFF" />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.sectionTitle}>🟢 Hoy hice ejercicio</Text>
              <Switch value={exercise} onValueChange={setExercise} trackColor={{ false: "#E5E5E5", true: "#A4195B" }} thumbColor="#FFFFFF" />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>😊 Mi estado de ánimo</Text>
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
              <Text style={styles.sectionTitle}>🟣 Movimientos del bebé (pataditas)</Text>
              <Switch value={babyMovement} onValueChange={setBabyMovement} trackColor={{ false: "#E5E5E5", true: "#A4195B" }} thumbColor="#FFFFFF" />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.sectionTitle}>🟢 Cita médica</Text>
              <Switch value={doctorAppointment} onValueChange={setDoctorAppointment} trackColor={{ false: "#E5E5E5", true: "#A4195B" }} thumbColor="#FFFFFF" />
            </View>

            {doctorAppointment && (
              <>
                {appointments.map((appt, index) => (
                  <AppointmentEditor
                    key={index}
                    item={appt}
                    onUpdate={(field, value) => updateAppointment(index, field, value)}
                  />
                ))}

                <TouchableOpacity style={styles.addButton} onPress={addAppointment}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <SymptomsCard
            title="🟡 Síntomas"
            symptomsList={PREGNANCY_SYMPTOMS}
            selected={symptoms}
            onToggle={toggleSymptom}
            customSymptoms={customSymptoms}
            otherSymptom={otherSymptom}
            onOtherChange={setOtherSymptom}
            onAddOther={addCustomSymptom}
            onRemoveCustom={removeCustomSymptom}
          />
        </>
      )}

      {healthStage === "menopausia" && (
        <>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.sectionTitle}>🟢 Ejercicio</Text>
              <Switch value={menopauseExercise} onValueChange={setMenopauseExercise} trackColor={{ false: "#E5E5E5", true: "#A4195B" }} thumbColor="#FFFFFF" />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.sectionTitle}>🔵 Debo beber medicamentos/suplementos</Text>
              <Switch value={vitamins} onValueChange={setVitamins} trackColor={{ false: "#E5E5E5", true: "#A4195B" }} thumbColor="#FFFFFF" />
            </View>

            {vitamins && (
              <>
                {supplements.map((sup, index) => (
                  <AppointmentEditor
                    key={index}
                    item={sup}
                    onUpdate={(field, value) => updateSupplement(index, field, value)}
                  />
                ))}

                <TouchableOpacity style={styles.addButton} onPress={addSupplement}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <SymptomsCard
            title="🟡 Síntomas"
            symptomsList={MENOPAUSE_SYMPTOMS}
            selected={symptoms}
            onToggle={toggleSymptom}
            customSymptoms={customSymptoms}
            otherSymptom={otherSymptom}
            onOtherChange={setOtherSymptom}
            onAddOther={addCustomSymptom}
            onRemoveCustom={removeCustomSymptom}
          />
        </>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📝 Notas</Text>
        <TextInput value={notes} onChangeText={setNotes} placeholder="Quiero escribir..." multiline style={styles.notesInput} />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function AppointmentEditor({
  item,
  onUpdate,
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
        placeholder="Nombre"
      />

      <TouchableOpacity style={styles.fieldInput} onPress={() => setShowPicker(true)}>
        <Text style={{ color: "#B0195B" }}>{formattedDateTime}</Text>
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
        placeholder="Descripción"
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
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {symptomsList.map((symptom) => (
        <TouchableOpacity key={symptom} onPress={() => onToggle(symptom)} style={styles.checkboxRow}>
          <Text style={styles.checkboxText}>{selected.includes(symptom) ? "☑" : "☐"} {symptom}</Text>
        </TouchableOpacity>
      ))}

      {customSymptoms.map((symptom) => (
        <TouchableOpacity
          key={symptom}
          onPress={() => onRemoveCustom(symptom)}
          style={styles.checkboxRow}
        >
          <Text style={styles.checkboxText}>☑ {symptom}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.otherRow}>
        <TextInput
          value={otherSymptom}
          onChangeText={onOtherChange}
          placeholder="Otro síntoma..."
          style={[styles.fieldInput, { flex: 1, marginTop: 12 }]}
        />

        <TouchableOpacity style={styles.addButton} onPress={onAddOther}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEDF3",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#222" },
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
    color: "#B0195B",
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
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#222", flex: 1, marginRight: 10 },
  emojiRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  moodButton: { width: 55, height: 55, borderRadius: 28, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F5", borderWidth: 1, borderColor: "#DDD" },
  moodButtonSelected: { backgroundColor: "#F8BBD0", borderColor: "#B0195B", borderWidth: 2 },
  moodEmoji: { fontSize: 28 },
  fieldInput: { backgroundColor: "#FDE8EF", color: "#B0195B", borderRadius: 10, padding: 12, fontSize: 14, marginTop: 10 },
  checkboxRow: { marginTop: 12 },
  checkboxText: { fontSize: 15, color: "#222" },
  otherRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F6AFC5", alignItems: "center", justifyContent: "center", marginTop: 14, alignSelf: "center" },
  addButtonText: { fontSize: 20, fontWeight: "bold", color: "#B0195B" },
  notesInput: { borderWidth: 1.5, borderColor: "#F6AFC5", borderRadius: 15, padding: 12, minHeight: 120, marginTop: 10, textAlignVertical: "top", fontSize: 16 },
  saveButton: { backgroundColor: "#F6AFC5", paddingVertical: 16, borderRadius: 30, alignItems: "center", marginTop: 30, marginBottom: 30 },
  saveButtonText: { fontSize: 20, fontWeight: "bold", color: "#000" },
  dropdownField: {
    backgroundColor: "#FDE8EF",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  dropdownValue: { fontSize: 14, color: "#B0195B" },
  dropdownList: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F0DCE4",
    borderRadius: 10,
    marginTop: 4,
  },
  dropdownOption: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#F6E4EC" },
  dropdownOptionText: { fontSize: 13, color: "#222" },
});