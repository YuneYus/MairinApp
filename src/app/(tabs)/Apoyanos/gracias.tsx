// app/(tabs)/Apoyanos/gracias.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, globalStyles } from "@/styles/global";

export default function GraciasScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={60} color="white" />
      </View>

      <Text style={globalStyles.titleBig}>¡Gracias!</Text>
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
        <Text style={globalStyles.actionButtonText}>Volver Al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  subtitle: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
  },

  messageBox: {
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    backgroundColor: colors.background,
  },

  messageText: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },

  button: {
    backgroundColor: colors.text,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
  },
});