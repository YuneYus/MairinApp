// src/app/(auth)/login.tsx

import { findRegisteredUser } from "@/storage/registeredUsersStorage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /*
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    const onboarded = await getOnboardingComplete();
    const profile = await getProfileInfo();

    if (onboarded && profile.email && profile.email.toLowerCase() === email.toLowerCase()) {
      router.replace("/(tabs)");
    } else {
      Alert.alert(
        "No encontramos tu cuenta",
        "No hay ninguna cuenta guardada en este dispositivo con ese correo. ¿Deseas crear una cuenta nueva?"
      );
    }
  };*/


const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Por favor ingresa tu correo y contraseña.");
    return;
  }

  const existingUser = await findRegisteredUser(email);

if (existingUser && existingUser.password === password) {
  router.replace("/(tabs)");
} else {
    Alert.alert(
      "No encontramos tu cuenta",
      "No hay ninguna cuenta guardada en este dispositivo con ese correo. ¿Deseas crear una cuenta nueva?"
    );
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Mairin</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="example@example.com" placeholderTextColor="#C9A9BB" keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput style={[styles.input, styles.passwordInput]} value={password} onChangeText={setPassword} placeholder="••••••••••••" placeholderTextColor="#C9A9BB" secureTextEntry={!showPassword} />
          <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword((p) => !p)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#B0195B" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotText}>¿Ovidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/(auth)/crear-cuenta")}>
          <Text style={styles.secondaryButtonText}>Crear una cuenta nueva</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/(auth)/invitado-datos")}>
          <Text style={styles.secondaryButtonText}>Continuar como invitado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: { backgroundColor: "#F6C6D6", borderBottomLeftRadius: 60, borderBottomRightRadius: 60, paddingTop: 80, paddingBottom: 40, alignItems: "center" },
  logo: { fontSize: 26, fontWeight: "bold", color: "#B0195B" },
  form: { padding: 24 },
  label: { fontSize: 14, fontWeight: "600", color: "#222", marginTop: 16, marginBottom: 6 },
  input: { backgroundColor: "#FDE8EF", color: "#B0195B", padding: 14, borderRadius: 12, fontSize: 15 },
  passwordRow: { flexDirection: "row", alignItems: "center" },
  passwordInput: { flex: 1 },
  eyeButton: { position: "absolute", right: 14 },
  forgotText: { color: "#B0195B", fontSize: 13, textAlign: "right", marginTop: 8 },
  primaryButton: { backgroundColor: "#B0195B", padding: 16, borderRadius: 30, alignItems: "center", marginTop: 24 },
  primaryButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  secondaryButton: { backgroundColor: "#8A1F4D", padding: 16, borderRadius: 30, alignItems: "center", marginTop: 14 },
  secondaryButtonText: { color: "white", fontSize: 15, fontWeight: "bold" },
});