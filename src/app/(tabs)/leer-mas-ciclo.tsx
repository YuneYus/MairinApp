// app/(tabs)/leer-mas-ciclo.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { speakIfEnabled } from "@/hooks/useSpeak";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, globalStyles } from "@/styles/global";
import { TranslationKey } from "@/translations";

const IRREGULAR_SIGN_KEYS: TranslationKey[] = [
  "IrregularpuntoUno",
  "Irregularpuntodos",
  "Irregularpuntotres",
  "Irregularpuntocuatro",
];

const POSSIBLE_CAUSES: { titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
  { titleKey: "hormonalesTitle", bodyKey: "hormnalesText" },
  { titleKey: "estiloVida", bodyKey: "estilovidatext" },
  { titleKey: "anticoncepctionMedicamento", bodyKey: "anticoncepcionMedicamentoText" },
  { titleKey: "EstructuralesUtero", bodyKey: "EstructuralesUteroText" },
  { titleKey: "Otras", bodyKey: "OtrasText" },
];

const DOCTOR_SIGNS: { titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
  { titleKey: "SangrasMas", bodyKey: "SangrasMasText" },
  { titleKey: "ManchasFueraPeriodo", bodyKey: "ManchasFueraPeriodoText" },
  { titleKey: "colicosFuertes", bodyKey: "colicosFuertesText" },
  { titleKey: "senosHinchazonCambiosAnimo", bodyKey: "senosHinchazonCambiosAnimoText" },
  { titleKey: "AcneVelloCaePelo", bodyKey: "AcneVelloCaePeloText" },
  { titleKey: "cansancioPesofrioCalor", bodyKey: "cansancioPesofrioCalorText" },
  { titleKey: "CaloresSudorNocheSequedad", bodyKey: "CaloresSudorNocheSequedadText" },
];

// Renders translated text with a speaker icon flowing INLINE at the end —
// it wraps naturally with the paragraph instead of overflowing the frame.
function SpeakableText({
  text,
  style,
}: {
  text: string;
  style?: any;
}) {
  const { language } = useLanguage();
  const showSpeakerIcons = language === "es";

  return (
    <Text style={style}>
      {text}
      {showSpeakerIcons && (
        <>
          {" "}
          <Text
            onPress={() => speakIfEnabled(text, language)}
            suppressHighlighting
          >
            <Ionicons name="volume-medium" size={15} color={colors.text} />
          </Text>
        </>
      )}
    </Text>
  );
}

export default function LeerMasCicloScreen() {
  const { t } = useLanguage();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={globalStyles.pinkHeaderTitle}>Leer Mas De Tu Ciclo</Text>
      </View>

      {/* ¿Cuándo se considera irregular? */}
      <View style={styles.sectionCard}>
        <SpeakableText text={t("cuandoIrregular")} style={globalStyles.label} />
      </View>

      {IRREGULAR_SIGN_KEYS.map((key, index) => (
        <View key={index} style={styles.signRow}>
          <View style={styles.arrowCircle}>
            <Ionicons name="arrow-forward" size={16} color={colors.text} />
          </View>
          <SpeakableText
            text={t(key)}
            style={[globalStyles.textNormal, styles.signText]}
          />
        </View>
      ))}

      {/* Posible causas */}
      <View style={styles.sectionCard}>
        <SpeakableText text={t("posiblescausastitle")} style={globalStyles.label} />
      </View>

      <View style={styles.paragraphCard}>
        <SpeakableText
          text={t("posibleCausastext")}
          style={[globalStyles.textNormal, styles.paragraphText]}
        />
      </View>

      {POSSIBLE_CAUSES.map((cause, index) => (
        <View key={index} style={styles.itemRow}>
          <View style={styles.dot} />
          <View style={styles.itemTextBlock}>
            <SpeakableText
              text={t(cause.titleKey)}
              style={[globalStyles.textNormal, styles.itemTitle]}
            />
            <SpeakableText
              text={t(cause.bodyKey)}
              style={[globalStyles.textNormal, styles.itemBody]}
            />
          </View>
        </View>
      ))}

      <View style={styles.noteCard}>
        <View style={styles.dot} />
        <SpeakableText
          text={`${t("Recuerda")}: ${t("recuerdaText")}`}
          style={[globalStyles.textNormal, styles.noteText]}
        />
      </View>

      {/* Cuándo ver a un médico */}
      <View style={[styles.sectionCard, { marginTop: 30 }]}>
        <SpeakableText text={t("cuandoVerMedico")} style={globalStyles.label} />
      </View>

      <View style={styles.paragraphCard}>
        <SpeakableText
          text={t("cuandoVerMedicoText")}
          style={[globalStyles.textNormal, styles.paragraphText]}
        />
      </View>

      {DOCTOR_SIGNS.map((sign, index) => (
        <View key={index} style={styles.itemRow}>
          <View style={styles.dotLight} />
          <View style={styles.itemTextBlock}>
            <SpeakableText
              text={t(sign.titleKey)}
              style={[globalStyles.textNormal, styles.itemTitle]}
            />
            <SpeakableText
              text={t(sign.bodyKey)}
              style={[globalStyles.textNormal, styles.itemBody]}
            />
          </View>
        </View>
      ))}

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 40 },

  header: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },
  backButton: { position: "absolute", top: 60, left: 20 },

  sectionCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  signRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 16,
    padding: 14,
  },
  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  signText: { flex: 1, minWidth: 0 },

  paragraphCard: {
    marginHorizontal: 20,
    marginTop: 14,
  },
  paragraphText: { color: "#444", lineHeight: 22 },

  itemRow: {
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 20,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 16,
    padding: 14,
    alignItems: "flex-start",
  },
  dot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    marginTop: 2,
  },
  dotLight: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.inputBackground,
    marginTop: 2,
  },
  itemTextBlock: { flex: 1, minWidth: 0 },
  itemTitle: { marginBottom: 4 },
  itemBody: { color: "#555", lineHeight: 21 },

  noteCard: {
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 20,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 16,
    padding: 14,
    alignItems: "flex-start",
  },
  noteText: { flex: 1, minWidth: 0, color: "#555", lineHeight: 21 },
});