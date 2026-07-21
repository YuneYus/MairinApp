// app/(tabs)/detalle-semana.tsx
//
// This screen is reached only by tapping a week (or "Descubre la semana")
// on the Inicio tab — it is NOT meant to appear as its own bottom tab.
// Add it to your tabs _layout.tsx the same way you already hid
// tamano-bebe.tsx / leer-mas-ciclo.tsx from the tab bar, e.g.:
//
//   <Tabs.Screen name="detalle-semana" options={{ href: null }} />
//
// Requires `expo-haptics` for the little heartbeat buzz (already part of
// most Expo projects — if you don't have it, run:
//   npx expo install expo-haptics
// or delete the two Haptics.impactAsync lines below).

import { WEEK_DATA } from "@/data/embarazoSemanas";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function DetalleSemanaScreen() {
  const { semana } = useLocalSearchParams<{ semana: string }>();
  const weekNumber = Number(semana) || 1;
  const week = WEEK_DATA[weekNumber];

  const [revealed, setRevealed] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (revealed) return;

    // Two quick pulses to feel like a heartbeat.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.25, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1.18, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start(() => setRevealed(true));

    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }, 150);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#7C1F3F" />
      </TouchableOpacity>

      <Text style={styles.title}>Tu Viaje De Embarazo</Text>

      <View style={styles.card}>
        <Text style={styles.heading}>
          SEMANA {weekNumber} ({week.title})
        </Text>

        {!revealed ? (
          <View style={styles.heartSection}>
            <TouchableOpacity activeOpacity={0.85} onPress={handlePress}>
              <Animated.View style={[styles.heartCircle, { transform: [{ scale }] }]}>
                <Ionicons name="heart" size={40} color="#7C1F3F" />
                <Text style={styles.heartLabel}>¡Presióname!</Text>
              </Animated.View>
            </TouchableOpacity>
            <Text style={styles.helperText}>
              Toca el corazón para sentir el siguiente latido de tu viaje
            </Text>
          </View>
        ) : (
          <View style={styles.revealSection}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Dato fascinante:</Text>
              <Text style={styles.infoText}>{week.fact}</Text>
            </View>
            <View style={[styles.infoBox, styles.infoBoxFeel]}>
              <Text style={[styles.infoLabel, styles.infoLabelFeel]}>¿Cómo te sentirás?</Text>
              <Text style={styles.infoText}>{week.feel}</Text>
            </View>
            <View style={[styles.infoBox, styles.infoBoxTip]}>
              <Text style={styles.infoLabel}>Consejo</Text>
              <Text style={styles.infoText}>{week.tip}</Text>
            </View>
          </View>
        )}
      </View>

      {revealed && (
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navButton, weekNumber <= 1 && styles.navButtonDisabled]}
            disabled={weekNumber <= 1}
            onPress={() =>
              router.replace({
                pathname: "/detalle-semana",
                params: { semana: String(weekNumber - 1) },
              })
            }
          >
            <Text style={styles.navButtonText}>‹ Antes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, weekNumber >= 40 && styles.navButtonDisabled]}
            disabled={weekNumber >= 40}
            onPress={() =>
              router.replace({
                pathname: "/detalle-semana",
                params: { semana: String(weekNumber + 1) },
              })
            }
          >
            <Text style={styles.navButtonText}>Después ›</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const PINK_BG = "#FDEEF2";
const PINK_SOFT = "#F7CDD9";
const PINK_MID = "#EFA9C1";
const PINK_PALE_CIRCLE = "#F6C6D6";
const PINK_STRONG = "#E05F8B";
const PINK_DEEP = "#C23F6C";
const MAROON = "#7C1F3F";
const TEXT_DARK = "#3A1420";
const TEXT_BODY = "#6B4550";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingHorizontal: 24, paddingTop: 60 },
  backButton: { marginBottom: 12 },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: MAROON,
    marginBottom: 20,
  },
  card: {
    backgroundColor: PINK_BG,
    borderWidth: 2,
    borderColor: PINK_SOFT,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_DARK,
    textAlign: "center",
    marginBottom: 24,
  },
  heartSection: { alignItems: "center" },
  heartCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: PINK_PALE_CIRCLE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  heartLabel: { color: MAROON, fontWeight: "700", fontSize: 15, marginTop: 6 },
  helperText: {
    fontSize: 14.5,
    color: TEXT_BODY,
    textAlign: "center",
    lineHeight: 20,
  },
  revealSection: { width: "100%" },
  infoBox: {
    backgroundColor: "#FDF1F5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: PINK_STRONG,
    width: "100%",
  },
  infoBoxFeel: { borderLeftColor: MAROON },
  infoBoxTip: { borderLeftColor: PINK_MID, backgroundColor: "#FDF6F8" },
  infoLabel: { fontWeight: "800", color: PINK_DEEP, fontSize: 14.5, marginBottom: 4 },
  infoLabelFeel: { color: MAROON },
  infoText: { fontSize: 14.5, color: TEXT_BODY, lineHeight: 20 },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navButton: {
    borderWidth: 1.5,
    borderColor: PINK_SOFT,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  navButtonDisabled: { opacity: 0.35 },
  navButtonText: { color: PINK_DEEP, fontWeight: "700", fontSize: 13.5 },
});
