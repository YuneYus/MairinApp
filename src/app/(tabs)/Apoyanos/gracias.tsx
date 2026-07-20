

// app/(tabs)/Apoyanos/gracias.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GraciasScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={60} color="white" />
      </View>

      <Text style={styles.title}>¡Gracias!</Text>
      <Text style={styles.subtitle}>El pago se ha realizado con éxito</Text>

      <View style={styles.messageBox}>
        <Text style={styles.messageText}>
          Tu donación nos ayuda a seguir creciendo.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/(tabs)/Apoyanos" as any)}
      >
        <Text style={styles.buttonText}>Volver Al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F6C6D6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  title: { fontSize: 26, fontWeight: "bold", color: "#222", marginBottom: 8 },

  subtitle: { fontSize: 14, color: "#555", marginBottom: 40 },

  messageBox: {
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    backgroundColor: "white",
  },

  messageText: { fontSize: 14, color: "#222", textAlign: "center" },

  button: {
    backgroundColor: "#B0195B",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
  },

  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});