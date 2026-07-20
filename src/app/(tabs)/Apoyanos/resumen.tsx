
// app/(tabs)/Apoyanos/resumen.tsx

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ResumenScreen() {
  const { amount } = useLocalSearchParams<{ amount: string }>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pago</Text>
        <Text style={styles.amount}>C$ {Number(amount).toFixed(2)}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>¡Ayúdanos A Crecer Juntas!</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/Apoyanos/gracias",
              params: { amount },
            } as any)
          }
        >
          <Text style={styles.buttonText}>Donar Ahora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },

  header: {
    backgroundColor: "#F6C6D6",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },

  backButton: { marginBottom: 20 },

  headerTitle: { fontSize: 18, fontWeight: "600", color: "white" },

  amount: { fontSize: 34, fontWeight: "bold", color: "white", marginTop: 8 },

  content: { padding: 24 },

  messageBox: {
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 40,
    marginTop: -30,
    backgroundColor: "white",
  },

  messageText: { fontSize: 16, fontWeight: "bold", color: "#222" },

  button: {
    backgroundColor: "#B0195B",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});