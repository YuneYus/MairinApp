import { useLanguage } from "@/contexts/LanguageContext";
import { speakIfEnabled } from "@/hooks/useSpeak";
import { colors, globalStyles } from "@/styles/global";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import {
  createDoctor,
  fetchDoctorById,
  updateDoctorRemote,
} from "@/services/doctorService";
import {
  addDoctor,
  deleteDoctor,
  getDoctorById,
  updateDoctor,
} from "@/storage/doctorStorage";

export default function AddDoctors() {
  const { t, language } = useLanguage();
  const showSpeakerIcons = language === "es";

  const { id } = useLocalSearchParams<{ id?: string }>();

  const editing = !!id;

  const [name, setName] = useState("");
  const [professionalism, setProfessionalism] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!editing) return;

    const loadDoctor = async () => {
      let doctor = await getDoctorById(id as string);

      if (!doctor) {
        try {
          doctor = await fetchDoctorById(id as string);
        } catch (error) {
          console.log("Failed to load remote doctor:", error);
          return;
        }
      }

      setName(doctor.name);
      setProfessionalism(doctor.professionalism);
      setPhoneNumber(doctor.phonenumber);
      setDetails(doctor.details);
    };

    loadDoctor();
  }, [id]);

  const handleAddDoctors = async () => {
    // Check that required information exists
    if (!name || !phonenumber) {
      Alert.alert(
        "Error",
        "Por favor ingresa el nombre del doctor y el número de teléfono"
      );
      return;
    }

    const payload = {
      name,
      professionalism,
      phonenumber,
      details,
    };

    try {
      if (editing) {
        await updateDoctorRemote(id as string, payload);

        const doctor = await getDoctorById(id as string);
        if (!doctor) {
          Alert.alert("Error", "No se encontró el doctor.");
          return;
        }

        await updateDoctor({
          ...doctor,
          ...payload,
        });
      } else {
        await createDoctor(payload);
        await addDoctor(payload);
      }
    } catch (error: any) {
      console.log("Doctor API error:", error);
      Alert.alert(
        "Error",
        error?.message?.includes("No auth token")
          ? "No se encontró el token de sesión. Inicia sesión de nuevo."
          : "No se pudo guardar el doctor. Verifica tu sesión o intenta de nuevo."
      );
      return;
    }

    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Show success message
    Alert.alert("Éxito", "Doctor guardado correctamente");

    // Go back to the doctors list
    router.back();
  };

  const headerTitle = editing
    ? "Editar Mi Doctor"
    : t("ListaDoctoresCentroSaludAdddoctor");

  const LabelWithVoice = ({ text }: { text: string }) => (
    <View style={styles.labelRow}>
      <Text style={styles.label}>{text}</Text>
      {showSpeakerIcons && (
        <TouchableOpacity
          onPress={() => speakIfEnabled(text, language)}
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

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.titleRow}>
        <Text style={globalStyles.titleBig}>{headerTitle}</Text>
        {showSpeakerIcons && (
          <TouchableOpacity
            onPress={() => speakIfEnabled(headerTitle, language)}
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

      {/* NAME */}
      <LabelWithVoice text={t("nombre")} />

      <TextInput
        style={styles.input}
        placeholder={t("nombreDoctor")}
        placeholderTextColor="#B0195B"
        value={name}
        onChangeText={setName}
      />

      {/* PROFESSION */}
      <LabelWithVoice text={t("profesion")} />

      <TextInput
        style={styles.input}
        placeholder="Psicología"
        placeholderTextColor="#B0195B"
        value={professionalism}
        onChangeText={setProfessionalism}
      />

      {/* PHONE NUMBER */}
      <LabelWithVoice text={t("telefonoadddoctor")} />

      <TextInput
        style={styles.input}
        placeholder="Número de teléfono"
        placeholderTextColor="#B0195B"
        value={phonenumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      {/* DESCRIPTION */}
      <LabelWithVoice text="Descripción" />

      <TextInput
        style={styles.descriptionInput}
        placeholder={t("quieroAnotar")}
        placeholderTextColor="#555"
        value={details}
        onChangeText={setDetails}
        multiline
        textAlignVertical="top"
      />

      {/* BUTTONS */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={async () => {
            if (editing) {
              Alert.alert("Eliminar Doctor", "¿Deseas eliminar este doctor?", [
                {
                  text: "Cancelar",
                  style: "cancel",
                },
                {
                  text: "Eliminar",
                  style: "destructive",
                  onPress: async () => {
                    await deleteDoctor(id as string);
                    router.back();
                  },
                },
              ]);
            } else {
              router.back();
            }
          }}
        >
          <Text style={styles.buttonText}>
            {editing ? t("eliminar") : t("cancelar")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleAddDoctors}>
          <Text style={styles.buttonText}>{t("guardar")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },

  titleRow: { flexDirection: "row", alignItems: "center" },

  labelRow: { flexDirection: "row", alignItems: "center" },

  speakerIcon: { marginLeft: 8 },

  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#FDE8EF",
    color: "#B0195B",
    padding: 16,
    borderRadius: 15,
    fontSize: 17,
  },

  descriptionInput: {
    borderWidth: 1,
    borderColor: "#F18BAA",
    borderRadius: 20,
    padding: 16,
    minHeight: 180,
    fontSize: 16,
    backgroundColor: "white",
  },

  buttonsRow: {
    flexDirection: "row",
    gap: 15,
    marginTop: 30,
    marginBottom: 30,
  },

  actionButton: {
    flex: 1,
    backgroundColor: "#B0195B",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});