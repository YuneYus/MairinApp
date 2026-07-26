// app/(tabs)/perfil/support.tsx

import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import SpeakableText from "@/components/SpeakableText";
import { useLanguage } from "@/contexts/LanguageContext";
import { colors, globalStyles } from "@/styles/global";
import { TranslationKey } from "@/translations";

const FAQ_KEYS: { qKey: TranslationKey; aKey: TranslationKey }[] = [
  { qKey: "actualizarEstadoPregunta", aKey: "actualizarEstadoRespuesta" },
  { qKey: "aplicacionGratuitaPregunta", aKey: "aplicacionGratuitaRespuesta" },
  { qKey: "cambiarEtapaVidaPregunta", aKey: "cambiarEtapaVidaRespuesta" },
  { qKey: "reemplazaConsultaPregunta", aKey: "reemplazaConsultaRespuesta" },
  { qKey: "etapasVidaPregunta", aKey: "etapasVidaRespuesta" },
  { qKey: "informacionConfiablePregunta", aKey: "informacionConfiableRespuesta" },
  { qKey: "contenidoAudioPregunta", aKey: "contenidoAudioRespuesta" },
  { qKey: "olvideContrasenaPregunta", aKey: "olvideContrasenaRespuesta" },
  { qKey: "cambiarContrasenaPregunta", aKey: "cambiarContrasenaRespuesta" },
  { qKey: "embarazoMenopausiaPregunta", aKey: "embarazoMenopausiaRespuesta" },
  { qKey: "informacionIncorrectaPregunta", aKey: "informacionIncorrectaRespuesta" },
  { qKey: "contactarMairinPregunta", aKey: "contactarMairinRespuesta" },
];

const CONSULTATION_TYPE_KEYS: TranslationKey[] = [
  "problemaTecnico",
  "dudaCuenta",
  "reportarError",
  "sugerencia",
  "otro",
];

type Tab = "faq" | "contact";
type Attachment = { name: string; uri: string; mimeType?: string | null };

export default function SupportScreen() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>("faq");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabButton, tab === "faq" && styles.tabButtonActive]}
            onPress={() => setTab("faq")}
          >
            <Text style={[styles.tabText, tab === "faq" && styles.tabTextActive]}>
              {t("preguntasFrecuentes")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, tab === "contact" && styles.tabButtonActive]}
            onPress={() => setTab("contact")}
          >
            <Text style={[styles.tabText, tab === "contact" && styles.tabTextActive]}>
              {t("contactanos")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {tab === "faq" ? <FaqTab /> : <ContactTab />}
    </View>
  );
}

function FaqTab() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = FAQ_KEYS.filter((item) =>
    t(item.qKey).toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.searchBar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("buscar")}
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
        <Ionicons name="search" size={20} color="#999" />
      </View>

      {filtered.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <View key={item.qKey} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.faqQuestionRow}
              onPress={() => setOpenIndex(isOpen ? null : index)}
            >
              <SpeakableText
                text={t(item.qKey)}
                style={[globalStyles.textNormal, styles.faqQuestionText]}
              />
              <Ionicons
                name={isOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>

            {isOpen && (
              <View style={styles.faqAnswerBox}>
                <SpeakableText
                  text={t(item.aKey)}
                  style={[globalStyles.textNormal, styles.faqAnswerText]}
                />
              </View>
            )}
          </View>
        );
      })}

      {filtered.length === 0 && (
        <Text style={[globalStyles.textNormal, styles.noResultsText]}>
          No se encontraron resultados.
        </Text>
      )}
    </ScrollView>
  );
}

function ContactTab() {
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consultType, setConsultType] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      if (file.size && file.size > 10 * 1024 * 1024) {
        Alert.alert("Archivo muy grande", "El archivo debe ser menor a 10 MB.");
        return;
      }

      setAttachment({
        name: file.name,
        uri: file.uri,
        mimeType: file.mimeType,
      });
    } catch (error) {
      console.log("Error picking file:", error);
      Alert.alert("Error", "No se pudo seleccionar el archivo.");
    }
  };

  const handleSend = () => {
    if (!name || !email || !message) {
      Alert.alert("Error", "Por favor completa nombre, correo y mensaje.");
      return;
    }

    // TODO: send `name`, `email`, `consultType`, `message`, `attachment`
    // to your backend/email service here.

    Alert.alert("Enviado", "Tu mensaje ha sido enviado. Te responderemos pronto.");
    setName("");
    setEmail("");
    setConsultType("");
    setMessage("");
    setAttachment(null);
  };

  return (
    <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
      <SpeakableText
        text={t("noEncontrasteRespuesta")}
        style={[globalStyles.textNormal, styles.contactTitle]}
      />
      <SpeakableText
        text={t("escribenos")}
        style={[globalStyles.textNormal, styles.contactSubtitle]}
      />

      <TouchableOpacity style={styles.contactMethodRow}>
        <View style={styles.contactIconCircle}>
          <Ionicons name="mail-outline" size={18} color={colors.text} />
        </View>
        <Text style={globalStyles.textNormal}>{t("soporteEmail")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactMethodRow}>
        <View style={styles.contactIconCircle}>
          <Ionicons name="chatbubble-outline" size={18} color={colors.text} />
        </View>
        <SpeakableText text={t("whatsappDisponible")} style={globalStyles.textNormal} />
      </TouchableOpacity>

      <SpeakableText text={t("nombre")} style={globalStyles.label} />
      <TextInput
        style={globalStyles.formInput}
        value={name}
        onChangeText={setName}
        placeholder={t("tuNombre")}
      />

      <SpeakableText text={t("correoElectronico")} style={globalStyles.label} />
      <TextInput
        style={globalStyles.formInput}
        value={email}
        onChangeText={setEmail}
        placeholder="nombre@correo.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <SpeakableText text={t("tipoConsulta")} style={globalStyles.label} />
      <TouchableOpacity
        style={styles.dropdownField}
        onPress={() => setShowTypeDropdown((prev) => !prev)}
      >
        <Text style={globalStyles.textNormal}>
          {consultType || t("seleccionaNumero")}
        </Text>
        <Ionicons
          name={showTypeDropdown ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.text}
        />
      </TouchableOpacity>

      {showTypeDropdown && (
        <View style={styles.dropdownList}>
          {CONSULTATION_TYPE_KEYS.map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.dropdownOption,
                consultType === t(key) && styles.dropdownOptionSelected,
              ]}
              onPress={() => {
                setConsultType(t(key));
                setShowTypeDropdown(false);
              }}
            >
              <Text style={globalStyles.textNormal}>{t(key)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <SpeakableText text={t("mensaje")} style={globalStyles.label} />
      <TextInput
        style={styles.textarea}
        value={message}
        onChangeText={setMessage}
        placeholder={t("cuentanosNecesitas")}
        multiline
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.uploadButton} onPress={handlePickFile}>
        <Ionicons name="attach" size={18} color={colors.text} />
        <Text style={globalStyles.textNormal}>
          {attachment ? attachment.name : t("subirArchivo")}
        </Text>
      </TouchableOpacity>

      {attachment && (
        <TouchableOpacity
          style={styles.removeAttachment}
          onPress={() => setAttachment(null)}
        >
          <Ionicons name="close-circle" size={16} color={colors.text} />
          <Text style={[globalStyles.textNormal, { color: colors.text }]}>
            Quitar archivo
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Ionicons name="send" size={16} color={colors.text} />
        <Text style={[globalStyles.textNormal, { color: colors.text }]}>
          {t("enviarMensaje")}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  backButton: { marginBottom: 16 },

  tabRow: { flexDirection: "row", gap: 12 },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    alignItems: "center",
  },
  tabButtonActive: { backgroundColor: colors.text },
  tabText: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 16,
    color: colors.text,
  },
  tabTextActive: { color: "white" },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    color: colors.textSecondary,
  },

  faqItem: {
    borderWidth: 1,
    borderColor: "#F0DCE4",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
  },
  faqQuestionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    padding: 16,
  },
  faqQuestionText: {
    flex: 1,
    minWidth: 0,
    marginRight: 10,
  },
  faqAnswerBox: { padding: 16, backgroundColor: colors.background },
  faqAnswerText: {
    color: "#444",
    lineHeight: 22,
  },
  noResultsText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },

  contactTitle: {
    marginBottom: 6,
  },
  contactSubtitle: {
    color: "#666",
    marginBottom: 20,
  },

  contactMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#F0DCE4",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  contactIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  orSendLabel: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 16,
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },

  textarea: {
    backgroundColor: colors.inputBackground,
    color: colors.text,
    fontFamily: "LeagueSpartan_400Regular",
    padding: 16,
    borderRadius: 15,
    fontSize: 16,
    minHeight: 100,
  },

  dropdownField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.inputBackground,
    padding: 14,
    borderRadius: 12,
  },
  dropdownList: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F0DCE4",
    borderRadius: 12,
    marginTop: 6,
    overflow: "hidden",
  },
  dropdownOption: { padding: 14 },
  dropdownOptionSelected: { backgroundColor: colors.surface },

  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.surface,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.inputBackground,
  },
  uploadHint: {
    color: "#999",
    marginTop: 6,
  },

  removeAttachment: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },

  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 30,
    marginTop: 30,
  },
});