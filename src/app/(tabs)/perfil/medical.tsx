


// app/(tabs)/perfil/medical.tsx

import {
    emptyMedicalInfo,
    getMedicalInfo,
    MedicalInfo,
    saveMedicalInfo,
} from "@/storage/medicalInfoStorage";
import { generateAndSharePdf } from "@/utils/medicalPdf";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const MENSTRUAL_SYMPTOMS = [
  "Cólicos (dolor en el abdomen)",
  "Dolor de cabeza",
  "Cansancio",
  "Dolor de espalda",
  "Hinchazón (sensación de inflamación abdominal)",
  "Náuseas",
  "Mareos",
  "Cambios de humor",
  "Antojos (deseo de ciertos alimentos)",
  "Poco sueño",
  "Diarrea",
  "Estreñimiento (dificultad para evacuar)",
  "Dolor en las piernas",
  "Sangre abundante (mucha sangre)",
  "Manchado (pequeño sangrado menstrual)",
];

const PREGNANCY_SYMPTOMS = [
  "Nausea",
  "Dolor de cabeza",
  "Fatiga/cansancio",
  "Acidez estomacal",
  "Hinchazón de los pies",
  "Dolor de espalda",
  "Mareos",
  "Cambios de humor",
];

const MENOPAUSE_SYMPTOMS = [
  "Sofocos(sensación repentina de calor en el cuerpo)",
  "Sudores nocturnos",
  "Cambios de humor",
  "Problemas para dormir",
  "Fatiga/cansancio",
  "Dolores de cabeza",
  "Mareos",
  "Dolor articular (rodillas, muñecas, hombros, etc.)",
];

const PAIN_LEVELS = [
  "1 - Muy leve (Apenas lo sientes)",
  "2 - Leve (Molesta un poco)",
  "3 - Moderado (Puede requerer descanso)",
  "4 - Fuerte (Dificulta tus actividades)",
  "5 - Muy fuerte (Impide tus actividades normales)",
];

const SURGERY_COUNTS = ["1", "2", "3", "4", "5"];

export default function MedicalScreen() {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState<MedicalInfo>(emptyMedicalInfo);
  const [dirty, setDirty] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await getMedicalInfo();
        setInfo(data);
        setDirty(false);
      };
      load();
    }, [])
  );

  const update = (patch: Partial<MedicalInfo>) => {
    setInfo((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  };

  const handleGuardar = async () => {
    await saveMedicalInfo(info);
    setDirty(false);
    Alert.alert("Guardado", "Tu información ha sido guardada.");
  };

  const handleGenerarPdf = async () => {
    try {
      await generateAndSharePdf(info, step);
    } catch (error) {
      console.log("Error generating PDF:", error);
      Alert.alert("Error", "No se pudo generar el PDF.");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const partTitle = {
    1: "Mi Información Médica\n(Parte 1)",
    2: "Mi Información Médica\n(Parte 2)",
    3: "Mi Información Médica\n(Parte 3)",
    4: "Mi Información Médica\n(Parte 4)",
  }[step];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{partTitle}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {step === 1 && <Part1 info={info} update={update} />}
        {step === 2 && <Part2 info={info} update={update} />}
        {step === 3 && <Part3 info={info} update={update} />}
        {step === 4 && <Part4 info={info} update={update} />}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, !dirty && styles.actionButtonDisabled]}
            onPress={handleGuardar}
            disabled={!dirty}
          >
            <Text style={styles.actionButtonText}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleGenerarPdf}>
            <Text style={styles.actionButtonText}>Generar{"\n"}PDF</Text>
          </TouchableOpacity>

          {step < 4 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setStep(step + 1)}
            >
              <Text style={styles.actionButtonText}>Siguiente</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ---------- PARTE 1 ----------

function Part1({
  info,
  update,
}: {
  info: MedicalInfo;
  update: (patch: Partial<MedicalInfo>) => void;
}) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Mis Datos Personales</Text>

      <Field label="Nombre y Apellido" value={info.fullName} onChangeText={(v) => update({ fullName: v })} placeholder="Ejemplo: Lily Hernandez" />
      <Field label="Fecha de nacimiento" value={info.birthDate} onChangeText={(v) => update({ birthDate: v })} placeholder="DD/MM/AAAA" />

      <View style={styles.row}>
        <Field label="Altura" value={info.height} onChangeText={(v) => update({ height: v })} placeholder="160cm" containerStyle={{ flex: 1 }} />
        <Field label="Peso" value={info.weight} onChangeText={(v) => update({ weight: v })} placeholder="58kg" containerStyle={{ flex: 1 }} />
        <Field label="Tipo de sangre" value={info.bloodType} onChangeText={(v) => update({ bloodType: v })} placeholder="O+" containerStyle={{ flex: 1 }} />
      </View>

      <Field label="Ocupación" value={info.occupation} onChangeText={(v) => update({ occupation: v })} placeholder="Ejemplo: Ayudantes de cocina" />
      <Field label="Ciudad de residencia" value={info.city} onChangeText={(v) => update({ city: v })} placeholder="Ejemplo: Managua" />

      <View style={styles.row}>
        <Field label="Teléfono" value={info.phone} onChangeText={(v) => update({ phone: v })} placeholder="00000000" containerStyle={{ flex: 1 }} keyboardType="phone-pad" />
        <Field label="Seguro médico (si aplica)" value={info.insurance} onChangeText={(v) => update({ insurance: v })} placeholder="eje: club de salud" containerStyle={{ flex: 1 }} />
      </View>

      <Field label="Correo electrónico" value={info.email} onChangeText={(v) => update({ email: v })} placeholder="Ejemplo: lilyhernandez1982@gmail.com" keyboardType="email-address" autoCapitalize="none" />

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Contacto De Emergencia</Text>

      <Field label="Nombre y Apellido" value={info.emergencyName} onChangeText={(v) => update({ emergencyName: v })} placeholder="Ejemplo: Lily Hernandez" />
      <Field label="Teléfono" value={info.emergencyPhone} onChangeText={(v) => update({ emergencyPhone: v })} placeholder="00000000" keyboardType="phone-pad" />
    </View>
  );
}

// ---------- PARTE 2 ----------

function Part2({
  info,
  update,
}: {
  info: MedicalInfo;
  update: (patch: Partial<MedicalInfo>) => void;
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelectCount = (count: string) => {
    const n = parseInt(count, 10);
    const newSurgeries = Array.from({ length: n }, (_, i) => info.surgeries[i] || { reason: "", date: "" });
    update({ surgeryCount: count, surgeries: newSurgeries });
    setShowDropdown(false);
  };

  const updateSurgery = (index: number, field: keyof (typeof info.surgeries)[0], value: string) => {
    const newSurgeries = info.surgeries.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    update({ surgeries: newSurgeries });
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Enfermedades Actuales O Previas</Text>

      <Text style={styles.label}>¿Algunas enfermedades diagnosticadas?</Text>
      <TextInput
        style={styles.textarea}
        value={info.currentIllnesses}
        onChangeText={(v) => update({ currentIllnesses: v })}
        placeholder="Escribe tus tratamiento...."
        placeholderTextColor="#C9A9BB"
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.label}>¿Cuántas cirugía previa?</Text>
      <TouchableOpacity style={styles.dropdownField} onPress={() => setShowDropdown((p) => !p)}>
        <Text style={info.surgeryCount ? styles.dropdownValue : styles.dropdownPlaceholder}>
          {info.surgeryCount || "selecciona el número"}
        </Text>
        <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={18} color="#B0195B" />
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdownList}>
          {SURGERY_COUNTS.map((count) => (
            <TouchableOpacity key={count} style={styles.dropdownOption} onPress={() => handleSelectCount(count)}>
              <Text style={styles.dropdownOptionText}>{count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {info.surgeries.map((surgery, index) => (
        <View key={index} style={styles.surgeryCard}>
          <Text style={styles.surgeryTitle}>Cirugía {index + 1}</Text>

          <Text style={styles.label}>Razón de la cirugía</Text>
          <TextInput
            style={styles.input}
            value={surgery.reason}
            onChangeText={(v) => updateSurgery(index, "reason", v)}
            placeholder="Ejemplo: Parto"
            placeholderTextColor="#C9A9BB"
          />

          <Text style={styles.label}>Fecha de la cirugía</Text>
          <TextInput
            style={styles.input}
            value={surgery.date}
            onChangeText={(v) => updateSurgery(index, "date", v)}
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#C9A9BB"
          />
        </View>
      ))}
    </View>
  );
}

// ---------- PARTE 3 ----------

function Part3({
  info,
  update,
}: {
  info: MedicalInfo;
  update: (patch: Partial<MedicalInfo>) => void;
}) {
  const [showPainDropdown, setShowPainDropdown] = useState(false);

  const toggleInList = (list: string[], item: string) =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

  return (
    <View>
      <Text style={styles.sectionTitle}>Salud De La Mujer</Text>

      <Field label="Edad de primera menstruación" value={info.firstPeriodAge} onChangeText={(v) => update({ firstPeriodAge: v })} placeholder="ejem: 12" keyboardType="numeric" />

      <View style={styles.row}>
        <Field label="Duración del ciclo" value={info.cycleDuration} onChangeText={(v) => update({ cycleDuration: v })} placeholder="ejemplo: 29 días" containerStyle={{ flex: 1 }} />
        <Field label="Duración del sangrado" value={info.bleedingDuration} onChangeText={(v) => update({ bleedingDuration: v })} placeholder="ejemplo: 5-7 días" containerStyle={{ flex: 1 }} />
      </View>

      <Text style={styles.label}>Nivel de dolor menstrual</Text>
      <TouchableOpacity style={styles.dropdownField} onPress={() => setShowPainDropdown((p) => !p)}>
        <Text style={info.painLevel ? styles.dropdownValue : styles.dropdownPlaceholder} numberOfLines={1}>
          {info.painLevel || "selecciona el número"}
        </Text>
        <Ionicons name={showPainDropdown ? "chevron-up" : "chevron-down"} size={18} color="#B0195B" />
      </TouchableOpacity>

      {showPainDropdown && (
        <View style={styles.dropdownList}>
          {PAIN_LEVELS.map((level) => (
            <TouchableOpacity
              key={level}
              style={styles.dropdownOption}
              onPress={() => {
                update({ painLevel: level });
                setShowPainDropdown(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Checklist
        title="Síntomas menstruales:"
        options={MENSTRUAL_SYMPTOMS}
        selected={info.menstrualSymptoms}
        onToggle={(item) => update({ menstrualSymptoms: toggleInList(info.menstrualSymptoms, item) })}
      />

      <Field label="Número de embarazos (si aplica)" value={info.pregnancyCount} onChangeText={(v) => update({ pregnancyCount: v })} placeholder="ejemplo: 1" keyboardType="numeric" />

      <Checklist
        title="Síntomas de embarazo (si aplica):"
        options={PREGNANCY_SYMPTOMS}
        selected={info.pregnancySymptoms}
        onToggle={(item) => update({ pregnancySymptoms: toggleInList(info.pregnancySymptoms, item) })}
      />

      <Checklist
        title="Síntomas de menopausia (si aplica):"
        options={MENOPAUSE_SYMPTOMS}
        selected={info.menopauseSymptoms}
        onToggle={(item) => update({ menopauseSymptoms: toggleInList(info.menopauseSymptoms, item) })}
      />
    </View>
  );
}

function Checklist({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  const [otherText, setOtherText] = useState("");

  const customItems = selected.filter((item) => !options.includes(item));

  const handleAddOther = () => {
    if (!otherText.trim()) return;
    onToggle(otherText.trim());
    setOtherText("");
  };

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.label}>{title}</Text>

      {options.map((option) => (
        <TouchableOpacity key={option} onPress={() => onToggle(option)} style={styles.checkboxRow}>
          <Ionicons
            name={selected.includes(option) ? "checkbox" : "square-outline"}
            size={18}
            color="#B0195B"
          />
          <Text style={styles.checkboxText}>{option}</Text>
        </TouchableOpacity>
      ))}

      {customItems.map((item) => (
        <TouchableOpacity key={item} onPress={() => onToggle(item)} style={styles.checkboxRow}>
          <Ionicons name="checkbox" size={18} color="#B0195B" />
          <Text style={styles.checkboxText}>{item}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.otherRow}>
        <Text style={styles.checkboxText}>Otros</Text>
        <TextInput
          style={styles.otherInput}
          value={otherText}
          onChangeText={setOtherText}
          placeholder="Escribe otro..."
          placeholderTextColor="#C9A9BB"
        />
        <TouchableOpacity style={styles.addOtherButton} onPress={handleAddOther}>
          <Ionicons name="add" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------- PARTE 4 ----------

function Part4({
  info,
  update,
}: {
  info: MedicalInfo;
  update: (patch: Partial<MedicalInfo>) => void;
}) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Medicamentos Y Alergias</Text>

      <Text style={styles.label}>¿Qué medicamentos estas tomando?</Text>
      <TextInput
        style={styles.textarea}
        value={info.medications}
        onChangeText={(v) => update({ medications: v })}
        placeholder="Escribe tus medicamentos...."
        placeholderTextColor="#C9A9BB"
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.label}>¿Qué alergias tienes?</Text>
      <TextInput
        style={styles.textarea}
        value={info.allergies}
        onChangeText={(v) => update({ allergies: v })}
        placeholder="Escribe tus alergias...."
        placeholderTextColor="#C9A9BB"
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}

// ---------- shared small field component ----------

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  containerStyle,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: any;
  autoCapitalize?: any;
  containerStyle?: any;
}) {
  return (
    <View style={containerStyle}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#C9A9BB"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },

  header: {
    backgroundColor: "#F6C6D6",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 40,
  },
  backButton: { position: "absolute", top: 60, left: 20 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#B0195B", textAlign: "center" },

  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#222", textAlign: "center", marginBottom: 14 },

  label: { fontSize: 13, fontWeight: "600", color: "#222", marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: "#FDE8EF",
    color: "#222",
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
  },
  textarea: {
    borderWidth: 1.5,
    borderColor: "#F6AFC5",
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    fontSize: 14,
  },

  row: { flexDirection: "row", gap: 10 },

  dropdownField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FDE8EF",
    padding: 12,
    borderRadius: 10,
  },
  dropdownValue: { fontSize: 14, color: "#222", flex: 1 },
  dropdownPlaceholder: { fontSize: 14, color: "#C9A9BB", flex: 1 },
  dropdownList: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F0DCE4",
    borderRadius: 10,
    marginTop: 6,
    overflow: "hidden",
  },
  dropdownOption: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#F6E4EC" },
  dropdownOptionText: { fontSize: 13, color: "#222" },

  surgeryCard: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
  },
  surgeryTitle: { fontSize: 14, fontWeight: "bold", color: "#222" },

  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  checkboxText: { fontSize: 13, color: "#222" },

  otherRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
  otherInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#B0195B",
    paddingVertical: 4,
    fontSize: 13,
  },
  addOtherButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#B0195B",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 30,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#B0195B",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonDisabled: { backgroundColor: "#E5B8CB" },
  actionButtonText: { color: "white", fontSize: 13, fontWeight: "bold", textAlign: "center" },
});