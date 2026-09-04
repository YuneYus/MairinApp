


import { setHealthStage } from "@/storage/healthStageStorage";
import { setOnboardingComplete } from "@/storage/onboardingStorage";
import { setPregnancyWeek } from "@/storage/pregnancyWeekStorage";
import { saveProfileInfo } from "@/storage/profilenameStorage";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const WEEKS = Array.from({ length: 40 }, (_, i) => i + 1);

export default function FechasEmbarazoScreen() {
  const { firstName, lastName, birthDate, email } = useLocalSearchParams<{
    firstName: string;
    lastName: string;
    birthDate: string;
    email?: string;
  }>();

  const [week, setWeek] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleFinish = async () => {
    if (!week) {
      Alert.alert("Error", "Por favor selecciona una semana.");
      return;
    }

    await saveProfileInfo({ firstName, lastName, phone: "", email: email ?? "", birthDate });
    await setHealthStage("embarazo");
    await setPregnancyWeek(week);
    await setOnboardingComplete();

    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.question}>¿Alrededor de cuánta semana estás embarazada?</Text>

        <TouchableOpacity style={styles.dropdownField} onPress={() => setShowDropdown((p) => !p)}>
          <Text style={week ? styles.dropdownValue : styles.dropdownPlaceholder}>
            {week ? `${week} semana${week > 1 ? "s" : ""}` : "selecciona la semana"}
          </Text>
          <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={18} color="#B0195B" />
        </TouchableOpacity>

        {showDropdown && (
          <ScrollView style={styles.dropdownListScroll}>
            {WEEKS.map((w) => (
              <TouchableOpacity key={w} style={styles.dropdownOption} onPress={() => { setWeek(w); setShowDropdown(false); }}>
                <Text style={styles.dropdownOptionText}>{w} semana{w > 1 ? "s" : ""}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
          <Text style={styles.navButtonText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.navButtonPrimary]} onPress={handleFinish}>
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
  question: { fontSize: 16, fontWeight: "bold", color: "#222", marginBottom: 16 },
  dropdownField: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FDE8EF", padding: 16, borderRadius: 14 },
  dropdownValue: { fontSize: 15, color: "#B0195B" },
  dropdownPlaceholder: { fontSize: 15, color: "#C9A9BB" },
  dropdownListScroll: { maxHeight: 260, backgroundColor: "white", borderWidth: 1, borderColor: "#F0DCE4", borderRadius: 14, marginTop: 8 },
  dropdownOption: { padding: 14, borderBottomWidth: 1, borderBottomColor: "#F6E4EC" },
  dropdownOptionText: { fontSize: 14, color: "#222" },
  navRow: { flexDirection: "row", gap: 12, padding: 24 },
  navButton: { flex: 1, backgroundColor: "white", borderWidth: 1.5, borderColor: "#B0195B", padding: 14, borderRadius: 30, alignItems: "center" },
  navButtonPrimary: { backgroundColor: "#B0195B" },
  navButtonText: { color: "#B0195B", fontWeight: "bold" },
  navButtonPrimaryText: { color: "white", fontWeight: "bold" },
});