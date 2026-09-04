// app/(tabs)/Apoyanos/patrocinar.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { speakIfEnabled } from "@/hooks/useSpeak";
import { Ionicons } from "@expo/vector-icons";
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

export default function PatrocinarScreen() {
  const { t, language } = useLanguage();
  const showSpeakerIcons = language === "es";

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");

const handleSubmit = () => {    if (!name || !email) {      Alert.alert("Error", "Por favor completa al menos nombre y correo");      return;    }     Alert.alert("Éxito", "Tu solicitud ha sido enviada");    router.back();  }; 

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.titleRow}>
          <Text style={globalStyles.pinkHeaderTitle}>{t("patrocinarTitle")}</Text>
          {showSpeakerIcons && (
            <TouchableOpacity
              onPress={() => speakIfEnabled(t("patrocinarTitle"), language)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="volume-medium"
                size={20}
                color={colors.text}
                style={styles.speakerIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={globalStyles.content}>
        <View style={styles.stepsRow}>
          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepText}>{t("enviaTuSolicitud")}</Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepText}>{t("numeroDos")}</Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepText}>{t("numeroTres")}</Text>
          </View>
        </View>

        <View style={styles.noteWrapper}>
          <Text style={styles.note}>{t("patrocinarTexto")}</Text>

          {showSpeakerIcons && (
            <TouchableOpacity
              style={styles.noteSpeaker}
              onPress={() => speakIfEnabled(t("patrocinarTexto"), language)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="volume-medium" size={18} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={globalStyles.label}>{t("nombreContacto")}</Text>
        <TextInput
          style={globalStyles.formInput}
          value={name}
          onChangeText={setName}
          placeholder={t("nombreApellido")}
        />

        <Text style={globalStyles.label}>{t("empresa")}</Text>
        <TextInput
          style={globalStyles.formInput}
          value={company}
          onChangeText={setCompany}
          placeholder={t("nombreEmpresa")}
        />

        <Text style={globalStyles.label}>{t("correoElectronico")}</Text>
        <TextInput
          style={globalStyles.formInput}
          value={email}
          onChangeText={setEmail}
          placeholder="nombre@empresa.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={globalStyles.label}>{t("telefono")}</Text>
        <TextInput
          style={globalStyles.formInput}
          value={phone}
          onChangeText={setPhone}
          placeholder="+505 0000 0000"
          keyboardType="phone-pad"
        />

        <Text style={globalStyles.label}>{t("sitioWebEmpresa")}</Text>
        <TextInput
          style={globalStyles.formInput}
          value={website}
          onChangeText={setWebsite}
          placeholder="www.empresa.com"
          autoCapitalize="none"
        />

        <Text style={globalStyles.label}>{t("cuentanosInteresEmpresa")}</Text>
        <TextInput
          style={styles.textarea}
          value={message}
          onChangeText={setMessage}
          placeholder={t("porEjemploPresupuesto")}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity style={[globalStyles.actionButton, { marginTop: 20 }]} onPress={handleSubmit}>
          <Text style={globalStyles.actionButtonText}>{t("EnviarSolicitudContacot")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 30,
  },

  backButton: { position: "absolute", top: 60, left: 20 },

  titleRow: { flexDirection: "row", alignItems: "center" },
  speakerIcon: { marginLeft: 8 },

  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },

  step: { flex: 1, alignItems: "center" },

  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  stepNumber: {
    fontFamily: "LeagueSpartan_700Bold",
    color: colors.text,
    fontSize: 16,
  },

  stepText: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    textAlign: "center",
    color: colors.textSecondary,
  },

  noteWrapper: { marginBottom: 20 },

  note: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    color: "#666",
    lineHeight: 18,
  },

  noteSpeaker: {
    marginTop: 8,
    alignSelf: "flex-start",
  },

  textarea: {
    backgroundColor: colors.inputBackground,
    color: colors.text,
    fontFamily: "LeagueSpartan_400Regular",
    padding: 16,
    borderRadius: 15,
    fontSize: 16,
    minHeight: 90,
  },
});