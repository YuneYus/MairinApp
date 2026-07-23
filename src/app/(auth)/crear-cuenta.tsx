// app/(auth)/crear-cuenta.tsx

import BirthDateInputs from "@/components/birthDateInputs";
import { addRegisteredUser } from "@/storage/registeredUsersStorage";
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

import { setAccountType } from "@/storage/accountTypeStorage";

export default function CrearCuentaScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleNext = async () => {
    if (!firstName || !lastName || !day || !month || !year || !email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
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

await addRegisteredUser({ email, firstName, lastName, password });
      await setAccountType("registered");

    router.push({
      pathname: "/(auth)/embarazada-selector",
      params: { firstName, lastName, birthDate, email },
    } as any);
  };

  const canContinue = acceptedTerms;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 24, paddingTop: 60 }}
    >
      <Text style={styles.title}>Crear una cuenta</Text>

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

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="example@example.com"
        placeholderTextColor="#C9A9BB"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        placeholderTextColor="#C9A9BB"
        secureTextEntry
      />

      <Text style={styles.label}>Confirmar contraseña</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="••••••••"
        placeholderTextColor="#C9A9BB"
        secureTextEntry
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

      <TouchableOpacity
        style={[styles.button, !canContinue && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={!canContinue}
      >
        <Text style={styles.buttonText}>Crear una cuenta nueva</Text>
      </TouchableOpacity>
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
    marginTop: 24,
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

  button: {
    backgroundColor: "#B0195B",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  buttonDisabled: { backgroundColor: "#E5B8CB" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});