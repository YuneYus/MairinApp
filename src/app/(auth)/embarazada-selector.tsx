

import { setHealthStage } from "@/storage/healthStageStorage";
import { setOnboardingComplete } from "@/storage/onboardingStorage";
import { clearPregnancyWeek } from "@/storage/pregnancyWeekStorage";
import { saveProfileInfo } from "@/storage/profilenameStorage";
import { calculateAge } from "@/utils/age";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EmbarazadaSelectorScreen() {
  const { firstName, lastName, birthDate, email } = useLocalSearchParams<{
    firstName: string;
    lastName: string;
    birthDate: string;
    email?: string;
  }>();

  const [choice, setChoice] = useState<"si" | "no" | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const finishAsNotPregnant = async () => {
    const age = calculateAge(birthDate);
    const stage = age >= 40 ? "menopausia" : "menstruacion";

    await saveProfileInfo({ firstName, lastName, phone: "", email: email ?? "", birthDate });
    await setHealthStage(stage);
    await clearPregnancyWeek();
    await setOnboardingComplete();

    router.replace("/(tabs)");
  };

  const handleNext = () => {
    if (!choice) {
      Alert.alert("Error", "Por favor selecciona una opción.");
      return;
    }

    if (choice === "no") {
      finishAsNotPregnant();
      return;
    }

    router.push({
      pathname: "/(auth)/fechas-embarazo",
      params: { firstName, lastName, birthDate, email: email ?? "" },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.question}>¿Estás embarazada?</Text>

        <TouchableOpacity style={styles.dropdownField} onPress={() => setShowDropdown((p) => !p)}>
          <Text style={choice ? styles.dropdownValue : styles.dropdownPlaceholder}>
            {choice === "si" ? "Sí (Estoy embarazada)" : choice === "no" ? "No (No estoy embarazada)" : "selecciona tu estado"}
          </Text>
          <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={18} color="#B0195B" />
        </TouchableOpacity>

        {showDropdown && (
          <View style={styles.dropdownList}>
            <TouchableOpacity style={styles.dropdownOption} onPress={() => { setChoice("si"); setShowDropdown(false); }}>
              <Text style={styles.dropdownOptionText}>Sí (Estoy embarazada)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownOption} onPress={() => { setChoice("no"); setShowDropdown(false); }}>
              <Text style={styles.dropdownOptionText}>No (No estoy embarazada)</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
          <Text style={styles.navButtonText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.navButtonPrimary]} onPress={handleNext}>
          <Text style={styles.navButtonPrimaryText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: { paddingTop: 60, paddingHorizontal: 20 },
  backButton: {},
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  question: { fontSize: 18, fontWeight: "bold", color: "#222", marginBottom: 16, textAlign: "center" },
  dropdownField: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FDE8EF", padding: 16, borderRadius: 14 },
  dropdownValue: { fontSize: 15, color: "#B0195B" },
  dropdownPlaceholder: { fontSize: 15, color: "#C9A9BB" },
  dropdownList: { backgroundColor: "white", borderWidth: 1, borderColor: "#F0DCE4", borderRadius: 14, marginTop: 8, overflow: "hidden" },
  dropdownOption: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#F6E4EC" },
  dropdownOptionText: { fontSize: 14, color: "#222" },
  navRow: { flexDirection: "row", gap: 12, padding: 24 },
  navButton: { flex: 1, backgroundColor: "white", borderWidth: 1.5, borderColor: "#B0195B", padding: 14, borderRadius: 30, alignItems: "center" },
  navButtonPrimary: { backgroundColor: "#B0195B" },
  navButtonText: { color: "#B0195B", fontWeight: "bold" },
  navButtonPrimaryText: { color: "white", fontWeight: "bold" },
});