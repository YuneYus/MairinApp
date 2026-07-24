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

import PinkHeader from "@/components/PinkHeader";
import { colors, globalStyles } from "@/styles/global";

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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PinkHeader title={partTitle!} onBack={handleBack} />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {step === 1 && <Part1 info={info} update={update} />}
        {step === 2 && <Part2 info={info} update={update} />}
        {step === 3 && <Part3 info={info} update={update} />}
        {step === 4 && <Part4 info={info} update={update} />}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[globalStyles.actionButton, !dirty && styles.actionButtonDisabled]}
            onPress={handleGuardar}
            disabled={!dirty}
          >
            <Text style={globalStyles.actionButtonText}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.actionButton} onPress={handleGenerarPdf}>
            <Text style={globalStyles.actionButtonText}>Generar{"\n"}PDF</Text>
          </TouchableOpacity>

          {step < 4 && (
            <TouchableOpacity
              style={globalStyles.actionButton}
              onPress={() => setStep(step + 1)}
            >
              <Text style={globalStyles.actionButtonText}>Siguiente</Text>
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

      <Text style={globalStyles.label}>¿Algunas enfermedades diagnosticadas?</Text>
      <TextInput
        style={styles.textarea}
        value={info.currentIllnesses}
        onChangeText={(v) => update({ currentIllnesses: v })}
        placeholder="Escribe tus tratamiento...."
        multiline
        textAlignVertical="top"
      />

      <Text style={globalStyles.label}>¿Cuántas cirugía previa?</Text>
      <TouchableOpacity style={styles.dropdownField} onPress={() => setShowDropdown((p) => !p)}>
        <Text style={info.surgeryCount ? styles.dropdownValue : styles.dropdownPlaceholder}>
          {info.surgeryCount || "selecciona el número"}
        </Text>
        <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={18} color={colors.text} />
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

          <Text style={globalStyles.label}>Razón de la cirugía</Text>
          <TextInput
            style={globalStyles.formInput}
            value={surgery.reason}
            onChangeText={(v) => updateSurgery(index, "reason", v)}
            placeholder="Ejemplo: Parto"
          />

          <Text style={globalStyles.label}>Fecha de la cirugía</Text>
          <TextInput
            style={globalStyles.formInput}
            value={surgery.date}
            onChangeText={(v) => updateSurgery(index, "date", v)}
            placeholder="DD/MM/AAAA"
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

      <Text style={globalStyles.label}>Nivel de dolor menstrual</Text>
      <TouchableOpacity style={styles.dropdownField} onPress={() => setShowPainDropdown((p) => !p)}>
        <Text style={info.painLevel ? styles.dropdownValue : styles.dropdownPlaceholder} numberOfLines={1}>
          {info.painLevel || "selecciona el número"}
        </Text>
        <Ionicons name={showPainDropdown ? "chevron-up" : "chevron-down"} size={18} color={colors.text} />
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
      <Text style={globalStyles.label}>{title}</Text>

      {options.map((option) => (
        <TouchableOpacity key={option} onPress={() => onToggle(option)} style={styles.checkboxRow}>
          <Ionicons
            name={selected.includes(option) ? "checkbox" : "square-outline"}
            size={18}
            color={colors.text}
          />
          <Text style={globalStyles.textNormal}>{option}</Text>
        </TouchableOpacity>
      ))}

      {customItems.map((item) => (
        <TouchableOpacity key={item} onPress={() => onToggle(item)} style={styles.checkboxRow}>
          <Ionicons name="checkbox" size={18} color={colors.text} />
          <Text style={globalStyles.textNormal}>{item}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.otherRow}>
        <Text style={globalStyles.textNormal}>Otros</Text>
        <TextInput
          style={styles.otherInput}
          value={otherText}
          onChangeText={setOtherText}
          placeholder="Escribe otro..."
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

      <Text style={globalStyles.label}>¿Qué medicamentos estas tomando?</Text>
      <TextInput
        style={styles.textarea}
        value={info.medications}
        onChangeText={(v) => update({ medications: v })}
        placeholder="Escribe tus medicamentos...."
        multiline
        textAlignVertical="top"
      />

      <Text style={globalStyles.label}>¿Qué alergias tienes?</Text>
      <TextInput
        style={styles.textarea}
        value={info.allergies}
        onChangeText={(v) => update({ allergies: v })}
        placeholder="Escribe tus alergias...."
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
      <Text style={globalStyles.label}>{label}</Text>
      <TextInput
        style={globalStyles.formInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 14,
  },

  textarea: {
    borderWidth: 1.5,
    borderColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    color: colors.textSecondary,
    minHeight: 100,
  },

  row: { flexDirection: "row", gap: 10 },

  dropdownField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.inputBackground,
    padding: 12,
    borderRadius: 10,
  },
  dropdownValue: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  dropdownPlaceholder: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  dropdownList: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F0DCE4",
    borderRadius: 10,
    marginTop: 6,
    overflow: "hidden",
  },
  dropdownOption: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#F6E4EC" },
  dropdownOptionText: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 13,
    color: colors.textSecondary,
  },

  surgeryCard: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
  },
  surgeryTitle: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 14,
    color: colors.textSecondary,
  },

  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },

  otherRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
  otherInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.text,
    paddingVertical: 4,
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 14,
    color: colors.textSecondary,
  },
  addOtherButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 30,
  },
  actionButtonDisabled: { backgroundColor: colors.surface },
});