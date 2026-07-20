
// app/(tabs)/Apoyanos/index.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ApoyanosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Apóyanos!</Text>

      <Text style={styles.description}>
        Cada aporte nos ayuda a crecer. Gracias a tu apoyo, podemos mejorar
        la aplicación para ti, crear nuevas herramientas y llevar
        información confiable y accesible a más mujeres que la necesitan.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/Apoyanos/donar" as any)}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="heart-outline" size={22} color="#B0195B" />
        </View>
        <Text style={styles.buttonText}>¡Quiero Donar!</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/Apoyanos/patrocinar" as any)}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="gift-outline" size={22} color="#B0195B" />
        </View>
        <Text style={styles.buttonText}>¡Quiero Ser Patrocinador!</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // TODO: build "otras formas de apoyar" screen
        }}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="people-outline" size={22} color="#B0195B" />
        </View>
        <Text style={styles.buttonText}>
          ¡Quiero Apoyar De Otras Formas!
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 24,
    paddingTop: 70,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#B0195B",
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 30,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBDCE7",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  buttonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
});