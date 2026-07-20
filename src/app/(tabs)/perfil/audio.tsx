// app/(tabs)/perfil/audio.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

type AudioOption = "es" | "miskito" | "none";

export default function AudioScreen() {
  const [selected, setSelected] = useState<AudioOption>("miskito");

  const options: { key: AudioOption; label: string }[] = [
    { key: "es", label: "Español" },
    { key: "miskito", label: "Miskito" },
    { key: "none", label: "No Audio" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Cambiar Idioma De Audio</Text>
      </View>

      <View style={styles.list}>
        {options.map((option) => (
          <View key={option.key} style={styles.row}>
            <Text style={styles.rowLabel}>{option.label}</Text>

            <Switch
              value={selected === option.key}
              onValueChange={() => setSelected(option.key)}
              trackColor={{ false: "#F6D9E4", true: "#B0195B" }}
              thumbColor="white"
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  header: {
    backgroundColor: "#F6C6D6",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 40,
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },

  list: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },

  rowLabel: {
    fontSize: 15,
    color: "#222",
  },
});