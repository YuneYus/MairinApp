// app/(tabs)/perfil/health-stage.tsx

import {
  getHealthStage,
  HealthStage,
  setHealthStage,
} from "@/storage/healthStageStorage";
import { clearPregnancyWeek } from "@/storage/pregnancyWeekStorage";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

const STAGES: { key: HealthStage; label: string }[] = [
  { key: "menstruacion", label: "Menstruación" },
  { key: "embarazo", label: "Embarazo" },
  { key: "menopausia", label: "Menopausia" },
];

export default function HealthStageScreen() {
  const [selected, setSelected] = useState<HealthStage>("menstruacion");

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const stage = await getHealthStage();
        setSelected(stage);
      };
      load();
    }, [])
  );

  const handleGuardar = async () => {
    const previousStage = await getHealthStage();
    await setHealthStage(selected);

    // Only newly switching INTO "embarazo" clears the saved week, so the
    // home screen asks again — re-saving while already on "embarazo"
    // won't wipe out a week you already entered.
    if (selected === "embarazo" && previousStage !== "embarazo") {
      await clearPregnancyWeek();
    }

    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cambiar Mi Etapa De Salud</Text>
      </View>

      <View style={styles.list}>
        {STAGES.map((stage) => (
          <View key={stage.key} style={styles.row}>
            <Text style={styles.rowLabel}>{stage.label}</Text>
            <Switch
              value={selected === stage.key}
              onValueChange={() => setSelected(stage.key)}
              trackColor={{ false: "#F6D9E4", true: "#B0195B" }}
              thumbColor="white"
            />
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: {
    backgroundColor: "#F6C6D6",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 40,
  },
  backButton: { position: "absolute", top: 60, left: 20 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#B0195B", textAlign: "center" },
  list: { paddingHorizontal: 24, paddingTop: 24 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16 },
  rowLabel: { fontSize: 16, color: "#222" },
  saveButton: {
    backgroundColor: "#B0195B",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 30,
  },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
