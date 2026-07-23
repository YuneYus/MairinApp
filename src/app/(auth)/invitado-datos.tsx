// app/(auth)/invitado-datos.tsx

import BirthDateInputs from "@/components/birthDateInputs";
import { setAccountType } from "@/storage/accountTypeStorage";
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

export default function InvitadoDatosScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleNext = async () => {
    if (!firstName || !lastName || !day || !month || !year) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }
    if (!acceptedTerms) {
      Alert.alert(
        "Error",
        "Debes aceptar la Política de Privacidad y los Términos y Condiciones."
      );
      return;
    }

    const birthDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    await setAccountType("guest");

    router.push({
      pathname: "/(auth)/embarazada-selector",
      params: { firstName, lastName, birthDate },
    } as any);
  };

  const canContinue = acceptedTerms;
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
    >
      <Text style={styles.title}>Cuéntanos un poco de ti</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Tu nombre"
        placeholderTextColor="#C9A9BB"
      />

      <Text style={styles.label}>Apellido</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Tu apellido"
        placeholderTextColor="#C9A9BB"
      />

      <Text style={styles.label}>Fecha de nacimiento</Text>
      <BirthDateInputs
        day={day}
        month={month}
        year={year}
        onChangeDay={setDay}
        onChangeMonth={setMonth}
        onChangeYear={setYear}
      />

      <TouchableOpacity
        style={styles.termsRow}
        onPress={() => setAcceptedTerms((p) => !p)}
      >
        <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
          {acceptedTerms && <Ionicons name="checkmark" size={14} color="white" />}
        </View>
        <Text style={styles.termsText}>
          Acepto la{" "}
          <Text
            style={styles.termsLink}
            onPress={() => router.push("/(auth)/terminos" as any)}
          >
            Política de Privacidad
          </Text>{" "}
          y los{" "}
          <Text
            style={styles.termsLink}
            onPress={() => router.push("/(auth)/terminos" as any)}
          >
            Términos y Condiciones
          </Text>{" "}
          de Mairin.
        </Text>
      </TouchableOpacity>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
          <Text style={styles.navButtonText}>Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.navButtonPrimary,
            !canContinue && styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={!canContinue}
        >
          <Text style={styles.navButtonPrimaryText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#B0195B",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FDE8EF",
    color: "#B0195B",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
  },

  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#B0195B",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: { backgroundColor: "#B0195B" },
  termsText: { flex: 1, fontSize: 13, color: "#222", lineHeight: 18 },
  termsLink: { color: "#3478F6", textDecorationLine: "underline" },

  navRow: { flexDirection: "row", gap: 12, marginTop: 30, marginBottom: 30 },
  navButton: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#B0195B",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  navButtonPrimary: { backgroundColor: "#B0195B", borderWidth: 0 },
  navButtonText: { color: "#B0195B", fontWeight: "bold" },
  navButtonPrimaryText: { color: "white", fontWeight: "bold" },
  buttonDisabled: { backgroundColor: "#E5B8CB" },
});