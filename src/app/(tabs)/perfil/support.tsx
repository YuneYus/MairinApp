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

import { colors, globalStyles } from "@/styles/global";

const FAQ_ITEMS = [
  {
    question: "Estoy embarazada, ¿cómo actualizo mi estado de salud?",
    answer:
      'Dirígete a "Perfil" y selecciona la opción "Cambiar mi estado de salud". Allí podrás indicar que estás embarazada para recibir información más adecuada a tu situación.',
  },
  {
    question: "¿La aplicación es gratuita?",
    answer:
      "Sí. La aplicación ofrece recursos gratuitos para ayudar a las mujeres a conocer y cuidar su salud en las diferentes etapas de su vida.",
  },
  {
    question: "¿Puedo cambiar mi etapa de vida en cualquier momento?",
    answer:
      'Sí. Puedes actualizar tu información al dirigir a "Perfil" y seleccionar la opción "Cambiar mi estado de salud"',
  },
  {
    question: "¿La aplicación reemplaza una consulta médica?",
    answer:
      "No. La aplicación tiene fines educativos y de seguimiento personal. No sustituye el diagnóstico ni la orientación de un profesional de la salud.",
  },
  {
    question: "¿Qué etapas de la vida incluye la aplicación?",
    answer:
      "La aplicación proporciona información adaptada a diferentes etapas de la vida de la mujer, como:\n• Menstruación.\n• Embarazo.\n• Menopausia.",
  },
  {
    question: "¿La información de la aplicación es confiable?",
    answer:
      "Sí. El contenido educativo está basado en fuentes confiables y es revisado para garantizar que sea claro y útil para las usuarias.",
  },
  {
    question: "¿Puedo escuchar el contenido en audio?",
    answer:
      "Sí. Algunos recursos educativos estarán disponibles en formato de audio para facilitar el acceso a la información.",
  },
  {
    question: "¿Qué hago si olvidé mi contraseña?",
    answer:
      'Puedes seleccionar la opción "¿Olvidaste tu contraseña?" y seguir las instrucciones para restablecerla.',
  },
  {
    question: "¿Qué hago si quiero cambiar de contraseña?",
    answer:
      'Debes ir a "Perfil", después a "Ajustes" y hacer clic el botón de "cambiar contraseña"',
  },
  {
    question:
      "¿Puedo dejar de registrar mi menstruación si estoy embarazada o en la menopausia?",
    answer:
      "Sí. La aplicación ajustará las funciones disponibles según el estado de salud o la etapa de vida que selecciones.",
  },
  {
    question: "¿Qué hago si ingresé mi información incorrectamente?",
    answer:
      'Puedes editar tus datos personales y de salud desde la sección "Perfil" en cualquier momento.',
  },
  {
    question: "¿Cómo puedo contactar a MAIRIN?",
    answer: "En el botón arriba derecha",
  },
];

const CONSULTATION_TYPES = [
  "Problema técnico",
  "Duda sobre mi cuenta",
  "Reportar un error",
  "Sugerencia",
  "Otro",
];

type Tab = "faq" | "contact";
type Attachment = { name: string; uri: string; mimeType?: string | null };

export default function SupportScreen() {
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
              Preguntas Frequentes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, tab === "contact" && styles.tabButtonActive]}
            onPress={() => setTab("contact")}
          >
            <Text style={[styles.tabText, tab === "contact" && styles.tabTextActive]}>
              Contáctanos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {tab === "faq" ? <FaqTab /> : <ContactTab />}
    </View>
  );
}

function FaqTab() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = FAQ_ITEMS.filter((item) =>
    item.question.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.searchBar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
        <Ionicons name="search" size={20} color="#999" />
      </View>

      {filtered.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <View key={item.question} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.faqQuestionRow}
              onPress={() => setOpenIndex(isOpen ? null : index)}
            >
              <Text style={[globalStyles.textNormal, styles.faqQuestionText]}>
                {item.question}
              </Text>
              <Ionicons
                name={isOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>

            {isOpen && (
              <View style={styles.faqAnswerBox}>
                <Text style={[globalStyles.textNormal, styles.faqAnswerText]}>
                  {item.answer}
                </Text>
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
      <Text style={[globalStyles.textNormal, styles.contactTitle]}>
        ¿No encontraste tu respuesta en las "preguntas frecuentes"?
      </Text>
      <Text style={[globalStyles.textNormal, styles.contactSubtitle]}>
        Escríbenos y te respondemos a la brevedad.
      </Text>

      <TouchableOpacity style={styles.contactMethodRow}>
        <View style={styles.contactIconCircle}>
          <Ionicons name="mail-outline" size={18} color={colors.text} />
        </View>
        <Text style={globalStyles.textNormal}>Soporte@mairin.com</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactMethodRow}>
        <View style={styles.contactIconCircle}>
          <Ionicons name="chatbubble-outline" size={18} color={colors.text} />
        </View>
        <Text style={globalStyles.textNormal}>WhatsApp disponible</Text>
      </TouchableOpacity>

      <Text style={styles.orSendLabel}>O ENVÍANOS UN MENSAJE</Text>

      <Text style={globalStyles.label}>Nombre</Text>
      <TextInput
        style={globalStyles.formInput}
        value={name}
        onChangeText={setName}
        placeholder="Tu nombre"
      />

      <Text style={globalStyles.label}>Correo electrónico</Text>
      <TextInput
        style={globalStyles.formInput}
        value={email}
        onChangeText={setEmail}
        placeholder="nombre@correo.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={globalStyles.label}>Tipo de consulta</Text>
      <TouchableOpacity
        style={styles.dropdownField}
        onPress={() => setShowTypeDropdown((prev) => !prev)}
      >
        <Text style={globalStyles.textNormal}>
          {consultType || "selecciona el número"}
        </Text>
        <Ionicons
          name={showTypeDropdown ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.text}
        />
      </TouchableOpacity>

      {showTypeDropdown && (
        <View style={styles.dropdownList}>
          {CONSULTATION_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.dropdownOption,
                consultType === type && styles.dropdownOptionSelected,
              ]}
              onPress={() => {
                setConsultType(type);
                setShowTypeDropdown(false);
              }}
            >
              <Text style={globalStyles.textNormal}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={globalStyles.label}>Mensaje</Text>
      <TextInput
        style={styles.textarea}
        value={message}
        onChangeText={setMessage}
        placeholder="Cuéntanos qué necesitas, incluye el mayor detalle posible..."
        multiline
        textAlignVertical="top"
      />

      <Text style={globalStyles.label}>Adjuntar imagen o PDF (opcional)</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={handlePickFile}>
        <Ionicons name="attach" size={18} color={colors.text} />
        <Text style={globalStyles.textNormal}>
          {attachment ? attachment.name : "Haz clic para subir"}
        </Text>
      </TouchableOpacity>

      <Text style={[globalStyles.textNormal, styles.uploadHint]}>
        JPG, PNG o PDF. Máximo 10 MB por archivo
      </Text>

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
          Enviar Mensaje
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