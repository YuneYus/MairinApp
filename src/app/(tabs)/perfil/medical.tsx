// app/(tabs)/perfil/medical.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { speakIfEnabled } from "@/hooks/useSpeak";
import {
  emptyMedicalInfo,
  getMedicalInfo,
  MedicalInfo,
  saveMedicalInfo,
} from "@/storage/medicalInfoStorage";
import { TranslationKey } from "@/translations";
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

// Translation keys, in the same order as the original Spanish lists,
// so both languages stay in sync.
const MENSTRUAL_SYMPTOM_KEYS: TranslationKey[] = [
  "colicos",
  "dolorCabeza",
  "cansancio",
  "dolorEspalda",
  "hinchazon",
  "nauseas",
  "mareos",
  "cambiosHumor",
  "antojos",
  "pocoSueno",
  "diarrea",
  "estrenimiento",
  "dolorPiernas",
  "sangreAbundante",
  "manchado",
];

const PREGNANCY_SYMPTOM_KEYS: TranslationKey[] = [
  "nausea",
  "dolorCabezaEmbarazo",
  "fatiga",
  "acidezEstomacal",
  "hinchazonPies",
  "dolorEspaldaEmbarazo",
  "mareosEmbarazo",
  "cambiosHumorEmbarazo",
];

const MENOPAUSE_SYMPTOM_KEYS: TranslationKey[] = [
  "sofocos",
  "sudoresNocturnos",
  "cambiosHumorMenopausia",
  "problemasDormir",
  "fatigaMenopausia",
  "doloresCabeza",
  "mareosMenopausia",
  "dolorArticular",
];

const PAIN_LEVEL_KEYS: TranslationKey[] = [
  "dolorMuyLeve",
  "dolorLeve",
  "dolorModerado",
  "dolorFuerte",
  "dolorMuyFuerte",
];

const SURGERY_COUNTS = ["1", "2", "3", "4", "5"];

const PART_TITLE_KEYS: Record<number, TranslationKey> = {
  1: "miInformacionMedicaParte1",
  2: "miInformacionMedicaParte2",
  3: "miInformacionMedicaParte3",
  4: "miInformacionMedicaParte4",
};

type T = (key: TranslationKey) => string;

// Shared label + speaker-icon row, reused by every field in this screen.
function LabelWithVoice({
  text,
  language,
  showSpeakerIcons,
}: {
  text: string;
  language: string;
  showSpeakerIcons: boolean;
}) {
  return (
    <View style={styles.labelRow}>
      <Text style={globalStyles.label}>{text}</Text>
      {showSpeakerIcons && (
        <TouchableOpacity
          onPress={() => speakIfEnabled(text, language as any)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="volume-medium"
            size={16}
            color={colors.text}
            style={styles.speakerIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function MedicalScreen() {
  const { t, language } = useLanguage();
  const showSpeakerIcons = language === "es";

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

  const partTitleKey: TranslationKey =
    PART_TITLE_KEYS[step] ?? "miInformacionMedicaParte1";

  const partTitle = t(partTitleKey);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PinkHeader title={partTitle} onBack={handleBack} />

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {step === 1 && (
          <Part1 info={info} update={update} t={t} language={language} showSpeakerIcons={showSpeakerIcons} />
        )}
        {step === 2 && (
          <Part2 info={info} update={update} t={t} language={language} showSpeakerIcons={showSpeakerIcons} />
        )}
        {step === 3 && (
          <Part3 info={info} update={update} t={t} language={language} showSpeakerIcons={showSpeakerIcons} />
        )}
        {step === 4 && (
          <Part4 info={info} update={update} t={t} language={language} showSpeakerIcons={showSpeakerIcons} />
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[globalStyles.actionButton, !dirty && styles.actionButtonDisabled]}
            onPress={handleGuardar}
            disabled={!dirty}
          >
            <Text style={globalStyles.actionButtonText}>{t("guardar")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.actionButton} onPress={handleGenerarPdf}>
            <Text style={globalStyles.actionButtonText}>{t("generarPdf")}</Text>
          </TouchableOpacity>

          {step < 4 && (
            <TouchableOpacity
              style={globalStyles.actionButton}
              onPress={() => setStep(step + 1)}
            >
              <Text style={globalStyles.actionButtonText}>{t("siguiente")}</Text>
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
  t,
  language,
  showSpeakerIcons,
}: {
  info: MedicalInfo;
  update: (patch: Partial<MedicalInfo>) => void;
  t: T;
  language: string;
  showSpeakerIcons: boolean;
}) {
  return (
    <View>
      <Text style={styles.sectionTitle}>{t("misDatosPersonales")}</Text>

      <Field label={t("nombreApellido")} value={info.fullName} onChangeText={(v) => update({ fullName: v })} placeholder="Ejemplo: Lily Hernandez" language={language} showSpeakerIcons={showSpeakerIcons} />
      <Field label={t("fechaNacimiento")} value={info.birthDate} onChangeText={(v) => update({ birthDate: v })} placeholder="DD/MM/AAAA" language={language} showSpeakerIcons={showSpeakerIcons} />

      <View style={styles.row}>
        <Field label={t("altura")} value={info.height} onChangeText={(v) => update({ height: v })} placeholder="160cm" containerStyle={{ flex: 1 }} language={language} showSpeakerIcons={showSpeakerIcons} />
        <Field label={t("peso")} value={info.weight} onChangeText={(v) => update({ weight: v })} placeholder="58kg" containerStyle={{ flex: 1 }} language={language} showSpeakerIcons={showSpeakerIcons} />
        <Field label={t("tipoSangre")} value={info.bloodType} onChangeText={(v) => update({ bloodType: v })} placeholder="O+" containerStyle={{ flex: 1 }} language={language} showSpeakerIcons={showSpeakerIcons} />
      </View>

      <Field label={t("ocupacion")} value={info.occupation} onChangeText={(v) => update({ occupation: v })} placeholder="Ejemplo: Ayudantes de cocina" language={language} showSpeakerIcons={showSpeakerIcons} />
      <Field label={t("ciudadResidencia")} value={info.city} onChangeText={(v) => update({ city: v })} placeholder="Ejemplo: Managua" language={language} showSpeakerIcons={showSpeakerIcons} />

      <View style={styles.row}>
        <Field label={t("telefono")} value={info.phone} onChangeText={(v) => update({ phone: v })} placeholder="00000000" containerStyle={{ flex: 1 }} keyboardType="phone-pad" language={language} showSpeakerIcons={showSpeakerIcons} />
        <Field label={t("seguroMedico")} value={info.insurance} onChangeText={(v) => update({ insurance: v })} placeholder="eje: club de salud" containerStyle={{ flex: 1 }} language={language} showSpeakerIcons={showSpeakerIcons} />
      </View>

      <Field label={t("correoElectronico")} value={info.email} onChangeText={(v) => update({ email: v })} placeholder="Ejemplo: lilyhernandez1982@gmail.com" keyboardType="email-address" autoCapitalize="none" language={language} showSpeakerIcons={showSpeakerIcons} />

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{t("contactoEmergencia")}</Text>

      <Field label={t("contactoEmergenciaNombre")} value={info.emergencyName} onChangeText={(v) => update({ emergencyName: v })} placeholder="Ejemplo: Lily Hernandez" language={language} showSpeakerIcons={showSpeakerIcons} />
      <Field label={t("contactoEmergenciaTelefono")} value={info.emergencyPhone} onChangeText={(v) => update({ emergencyPhone: v })} placeholder="00000000" keyboardType="phone-pad" language={language} showSpeakerIcons={showSpeakerIcons} />
    </View>
  );
}

// ---------- PARTE 2 ----------

function Part2({
  info,
  update,
  t,
  language,
  showSpeakerIcons,
}: {
  info: MedicalInfo;
  update: (patch: Partial<MedicalInfo>) => void;
  t: T;
  language: string;
  showSpeakerIcons: boolean;
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
      <Text style={styles.sectionTitle}>{t("enfermedadesActualesPrevias")}</Text>

      <LabelWithVoice text={t("enfermedadesDiagnosticadas")} language={language} showSpeakerIcons={showSpeakerIcons} />
      <TextInput
        style={styles.textarea}
        value={info.currentIllnesses}
        onChangeText={(v) => update({ currentIllnesses: v })}
        placeholder="Escribe tus tratamiento...."
        multiline
        textAlignVertical="top"
      />

      <LabelWithVoice text={t("cuantasCirugiasPrevias")} language={language} showSpeakerIcons={showSpeakerIcons} />
      <TouchableOpacity style={styles.dropdownField} onPress={() => setShowDropdown((p) => !p)}>
        <Text style={info.surgeryCount ? styles.dropdownValue : styles.dropdownPlaceholder}>
          {info.surgeryCount || t("seleccionaNumero")}
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
          <Text style={styles.surgeryTitle}>
            {t("cirugia")} {index + 1}
          </Text>

          <Field label={t("razonCirugia")} value={surgery.reason} onChangeText={(v) => updateSurgery(index, "reason", v)} placeholder="Ejemplo: Parto" language={language} showSpeakerIcons={showSpeakerIcons} />
          <Field label={t("fechaCirugia")} value={surgery.date} onChangeText={(v) => updateSurgery(index, "date", v)} placeholder="DD/MM/AAAA" language={language} showSpeakerIcons={showSpeakerIcons} />
        </View>
      ))}
    </View>
  );
}

// ---------- PARTE 3 ----------

function Part3({
  info,
  update,
  t,
  language,
  showSpeakerIcons,
}: {
  info: MedicalInfo;
  update: (patch: Partial<MedicalInfo>) => void;
  t: T;
  language: string;
  showSpeakerIcons: boolean;
}) {
  const [showPainDropdown, setShowPainDropdown] = useState(false);

  const toggleInList = (list: string[], item: string) =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

  return (
    <View>
      <Text style={styles.sectionTitle}>{t("saludMujer")}</Text>

      <Field label={t("edadPrimeraMenstruacion")} value={info.firstPeriodAge} onChangeText={(v) => update({ firstPeriodAge: v })} placeholder="ejem: 12" keyboardType="numeric" language={language} showSpeakerIcons={showSpeakerIcons} />

      <View style={styles.row}>
        <Field label={t("duracionCiclo")} value={info.cycleDuration} onChangeText={(v) => update({ cycleDuration: v })} placeholder="ejemplo: 29 días" containerStyle={{ flex: 1 }} language={language} showSpeakerIcons={showSpeakerIcons} />
        <Field label={t("duracionSangrado")} value={info.bleedingDuration} onChangeText={(v) => update({ bleedingDuration: v })} placeholder="ejemplo: 5-7 días" containerStyle={{ flex: 1 }} language={language} showSpeakerIcons={showSpeakerIcons} />
      </View>

      <LabelWithVoice text={t("nivelDolorMenstrual")} language={language} showSpeakerIcons={showSpeakerIcons} />
      <TouchableOpacity style={styles.dropdownField} onPress={() => setShowPainDropdown((p) => !p)}>
        <Text style={info.painLevel ? styles.dropdownValue : styles.dropdownPlaceholder} numberOfLines={1}>
          {info.painLevel || t("seleccionaNumero")}
        </Text>
        <Ionicons name={showPainDropdown ? "chevron-up" : "chevron-down"} size={18} color={colors.text} />
      </TouchableOpacity>

      {showPainDropdown && (
        <View style={styles.dropdownList}>
          {PAIN_LEVEL_KEYS.map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.dropdownOption}
              onPress={() => {
                update({ painLevel: t(key) });
                setShowPainDropdown(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>{t(key)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Checklist
        title={t("sintomasMenstruales")}
        optionKeys={MENSTRUAL_SYMPTOM_KEYS}
        selected={info.menstrualSymptoms}
        onToggle={(item) => update({ menstrualSymptoms: toggleInList(info.menstrualSymptoms, item) })}
        t={t}
        language={language}
        showSpeakerIcons={showSpeakerIcons}
      />

      <Field label={t("numeroEmbarazos")} value={info.pregnancyCount} onChangeText={(v) => update({ pregnancyCount: v })} placeholder="ejemplo: 1" keyboardType="numeric" language={language} showSpeakerIcons={showSpeakerIcons} />

      <Checklist
        title={t("sintomasEmbarazo")}
        optionKeys={PREGNANCY_SYMPTOM_KEYS}
        selected={info.pregnancySymptoms}
        onToggle={(item) => update({ pregnancySymptoms: toggleInList(info.pregnancySymptoms, item) })}
        t={t}
        language={language}
        showSpeakerIcons={showSpeakerIcons}
      />

      <Checklist
        title={t("sintomasMenopausia")}
        optionKeys={MENOPAUSE_SYMPTOM_KEYS}
        selected={info.menopauseSymptoms}
        onToggle={(item) => update({ menopauseSymptoms: toggleInList(info.menopauseSymptoms, item) })}
        t={t}
        language={language}
        showSpeakerIcons={showSpeakerIcons}
      />
    </View>
  );
}

function Checklist({
  title,
  optionKeys,
  selected,
  onToggle,
  t,
  language,
  showSpeakerIcons,
}: {
  title: string;
  optionKeys: TranslationKey[];
  selected: string[];
  onToggle: (item: string) => void;
  t: T;
  language: string;
  showSpeakerIcons: boolean;
}) {
  const [otherText, setOtherText] = useState("");

  const optionLabels = optionKeys.map((key) => t(key));
  const customItems = selected.filter((item) => !optionLabels.includes(item));

  const handleAddOther = () => {
    if (!otherText.trim()) return;
    onToggle(otherText.trim());
    setOtherText("");
  };

  return (
    <View style={{ marginTop: 16 }}>
      <LabelWithVoice text={title} language={language} showSpeakerIcons={showSpeakerIcons} />

      {optionKeys.map((key) => {
        const label = t(key);
        return (
          <TouchableOpacity key={key} onPress={() => onToggle(label)} style={styles.checkboxRow}>
            <Ionicons
              name={selected.includes(label) ? "checkbox" : "square-outline"}
              size={18}
              color={colors.text}
            />
            <Text style={globalStyles.textNormal}>{label}</Text>
          </TouchableOpacity>
        );
      })}

      {customItems.map((item) => (
        <TouchableOpacity key={item} onPress={() => onToggle(item)} style={styles.checkboxRow}>
          <Ionicons name="checkbox" size={18} color={colors.text} />
          <Text style={globalStyles.textNormal}>{item}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.otherRow}>
        <Text style={globalStyles.textNormal}>{t("otros")}</Text>
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
  t,
  language,
  showSpeakerIcons,
}: {
  info: MedicalInfo;
  update: (patch: Partial<MedicalInfo>) => void;
  t: T;
  language: string;
  showSpeakerIcons: boolean;
}) {
  return (
    <View>
      <Text style={styles.sectionTitle}>{t("medicamentosAlergias")}</Text>

      <LabelWithVoice text={t("medicamentosActuales")} language={language} showSpeakerIcons={showSpeakerIcons} />
      <TextInput
        style={styles.textarea}
        value={info.medications}
        onChangeText={(v) => update({ medications: v })}
        placeholder="Escribe tus medicamentos...."
        multiline
        textAlignVertical="top"
      />

      <LabelWithVoice text={t("alergias")} language={language} showSpeakerIcons={showSpeakerIcons} />
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
  language,
  showSpeakerIcons,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: any;
  autoCapitalize?: any;
  containerStyle?: any;
  language: string;
  showSpeakerIcons: boolean;
}) {
  return (
    <View style={containerStyle}>
      <LabelWithVoice text={label} language={language} showSpeakerIcons={showSpeakerIcons} />
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

  labelRow: { flexDirection: "row", alignItems: "center" },
  speakerIcon: { marginLeft: 8 },

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