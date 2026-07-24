// app/(tabs)/Apoyanos/index.tsx

import { colors, globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ApoyanosScreen() {
  return (
    <View style={styles.container}>
      <View style={globalStyles.pinkHeader}>
        <Text style={globalStyles.pinkHeaderTitle}>¡Apóyanos!</Text>
      </View>

      <View style={globalStyles.content}>
        <Text style={[globalStyles.textNormal, styles.description]}>
          Cada aporte nos ayuda a crecer. Gracias a tu apoyo, podemos mejorar
          la aplicación para ti, crear nuevas herramientas y llevar
          información confiable y accesible a más mujeres que la necesitan.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/Apoyanos/donar" as any)}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="heart-outline" size={22} color={colors.text} />
          </View>
          <Text style={[globalStyles.cardTitle, styles.buttonText]}>
            ¡Quiero Donar!
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/Apoyanos/patrocinar" as any)}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="gift-outline" size={22} color={colors.text} />
          </View>
          <Text style={[globalStyles.cardTitle, styles.buttonText]}>
            ¡Quiero Ser Patrocinador!
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/Apoyanos/otramanera" as any)}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="people-outline" size={22} color={colors.text} />
          </View>
          <Text style={[globalStyles.cardTitle, styles.buttonText]}>
            ¡Quiero Apoyar De Otras Formas!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  description: {
    marginTop: 20,
    marginBottom: 30,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },

  buttonText: {
    flex: 1,
    flexWrap: "wrap",
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
});