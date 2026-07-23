

import { setAccountType } from "@/storage/accountTypeStorage";
import { getProfileInfo, saveProfileInfo } from "@/storage/profilenameStorage";
import { addRegisteredUser } from "@/storage/registeredUsersStorage";
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

export default function CrearCuentaDesdeInvitadoScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const info = await getProfileInfo();
        setFirstName(info.firstName);
        setLastName(info.lastName);
      };
      load();
    }, [])
  );

  const handleCreate = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tu correo y una contraseña.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    // Preserve everything already saved — just add email to the existing profile
    const currentInfo = await getProfileInfo();
    await saveProfileInfo({ ...currentInfo, email });

    await addRegisteredUser({ email, firstName, lastName });
    await setAccountType("registered");

    Alert.alert("¡Listo!", "Tu cuenta ha sido creada. Toda tu información se ha guardado.");
    router.replace("/(tabs)/perfil");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>
        <Text style={styles.title}>Crear Mi Cuenta</Text>
      </View>

      <Text style={styles.subtitle}>
        Guarda tu progreso agregando un correo y contraseña. No perderás nada de lo que ya has registrado.
      </Text>

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

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Crear Mi Cuenta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backButton: { marginRight: 12 },
  title: { fontSize: 20, fontWeight: "bold", color: "#B0195B" },
  subtitle: { fontSize: 13, color: "#666", marginBottom: 20, lineHeight: 18 },
  label: { fontSize: 14, fontWeight: "600", color: "#222", marginTop: 16, marginBottom: 6 },
  input: { backgroundColor: "#FDE8EF", color: "#B0195B", padding: 14, borderRadius: 12, fontSize: 15 },
  button: { backgroundColor: "#B0195B", padding: 16, borderRadius: 30, alignItems: "center", marginTop: 30 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});