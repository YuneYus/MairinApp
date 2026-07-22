// app/(tabs)/viaje-embarazo.tsx
//
// Pushed from the "Embarazo" ButtonInfo and from the PregnancyJourneyCard
// heart widget in your real index.tsx. Not meant to appear as its own
// bottom tab — see the _layout.tsx note at the end of this message.

import { trimesterOf, WEEK_DATA } from "@/data/embarazoSemanas";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// NOTE: I mapped your three icon pairs to the trimesters by "energy level"
// (calm -> content -> excited), matching the faces in your mockup:
//   Trimestre 1 -> Relax(Pink/White)
//   Trimestre 2 -> Wink(Pink/White)
//   Trimestre 3 -> Excited(Pink/White)
// If that's backwards, just swap the `activeIcon`/`inactiveIcon` requires below.
const TRIMESTERS: {
  n: 1 | 2 | 3;
  label: string;
  activeIcon: number;
  inactiveIcon: number;
}[] = [
  {
    n: 1,
    label: "Trimestre 1",
    activeIcon: require("@/app/assets/images/transRelaxPink.png"),
    inactiveIcon: require("@/app/assets/images/transRelaxWhite.png"),
  },
  {
    n: 2,
    label: "Trimestre 2",
    activeIcon: require("@/app/assets/images/transWinkPink.png"),
    inactiveIcon: require("@/app/assets/images/transWinkWhite.png"),
  },
  {
    n: 3,
    label: "Trimestre 3",
    activeIcon: require("@/app/assets/images/transExcitedPink.png"),
    inactiveIcon: require("@/app/assets/images/transExcitedWhite.png"),
  },
];

export default function ViajeEmbarazoScreen() {
  const { semana } = useLocalSearchParams<{ semana?: string }>();
  const initialWeek = Number(semana) || 2;
  const [currentWeek, setCurrentWeek] = useState(initialWeek);

  const trimester = trimesterOf(currentWeek);
  const week = WEEK_DATA[currentWeek];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Tu Viaje De Embarazo</Text>
      </View>

      <View style={styles.trimesterRow}>
        {TRIMESTERS.map((t) => (
          <TouchableOpacity
            key={t.n}
            style={styles.trimesterItem}
            onPress={() => setCurrentWeek(t.n === 1 ? 1 : t.n === 2 ? 14 : 28)}
          >
            <View
              style={[
                styles.trimesterCircle,
                trimester === t.n && styles.trimesterCircleActive,
              ]}
            >
              <Image
                source={trimester === t.n ? t.activeIcon : t.inactiveIcon}
                style={styles.trimesterIcon}
                resizeMode="contain"
              />
            </View>
            <Text
              style={[
                styles.trimesterLabel,
                trimester === t.n && styles.trimesterLabelActive,
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.weekGrid}>
        {Array.from({ length: 40 }, (_, i) => i + 1).map((w) => {
          const isCurrent = w === currentWeek;
          const inTrimester = trimesterOf(w) === trimester;
          return (
            <TouchableOpacity
              key={w}
              onPress={() => setCurrentWeek(w)}
              style={[
                styles.weekDot,
                inTrimester && styles.weekDotInTrimester,
                isCurrent && styles.weekDotCurrent,
              ]}
            >
              <Text style={[styles.weekDotText, isCurrent && styles.weekDotTextCurrent]}>
                {w}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navButton, currentWeek <= 1 && styles.navButtonDisabled]}
          disabled={currentWeek <= 1}
          onPress={() => setCurrentWeek((w) => Math.max(1, w - 1))}
        >
          <Text style={styles.navButtonText}>‹ Antes</Text>
        </TouchableOpacity>
        <Text style={styles.weekHeading}>Semana {currentWeek}</Text>
        <TouchableOpacity
          style={[styles.navButton, currentWeek >= 40 && styles.navButtonDisabled]}
          disabled={currentWeek >= 40}
          onPress={() => setCurrentWeek((w) => Math.min(40, w + 1))}
        >
          <Text style={styles.navButtonText}>Después ›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>SEMANA {currentWeek}</Text>
        </View>
        <Text style={styles.weekTitle}>{week.title}</Text>

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
    </ScrollView>
  );
}

const PINK_BG = "#FDEEF2";
const PINK_PALE = "#FBDDE7";
const PINK_SOFT = "#F7CDD9";
const PINK_MID = "#EFA9C1";
const PINK_STRONG = "#E05F8B";
const PINK_DEEP = "#C23F6C";
const MAROON = "#7C1F3F";
const TEXT_DARK = "#3A1420";
const TEXT_BODY = "#6B4550";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PINK_BG, paddingHorizontal: 18 },

  topBar: { flexDirection: "row", alignItems: "center", paddingTop: 12, marginBottom: 6 },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: { fontSize: 20, color: MAROON },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: MAROON,
    textAlign: "center",
    marginLeft: -38,
  },

  trimesterRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 20 },
  trimesterItem: { alignItems: "center", gap: 8 },
trimesterCircle: {    width: 66,    height: 66,    borderRadius: 33,    backgroundColor: "white",    borderWidth: 2,    borderColor: PINK_MID,    alignItems: "center",    justifyContent: "center",  },

  trimesterCircleActive: {
    backgroundColor: PINK_STRONG,
    borderColor: PINK_DEEP,
  },
  trimesterIcon: { width: 50, height: 50 },
  trimesterLabel: { fontSize: 13, fontWeight: "700", color: TEXT_BODY },
  trimesterLabelActive: { color: MAROON },

  weekGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginBottom: 16,
  },
  weekDot: {
    width: "10.6%",
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: PINK_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  weekDotInTrimester: { borderWidth: 2, borderColor: PINK_MID },
  weekDotCurrent: { backgroundColor: PINK_STRONG, borderColor: PINK_DEEP },
  weekDotText: { fontSize: 12.5, fontWeight: "700", color: TEXT_BODY },
  weekDotTextCurrent: { color: "white" },

  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navButton: {
    borderWidth: 1.5,
    borderColor: PINK_SOFT,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  navButtonDisabled: { opacity: 0.35 },
  navButtonText: { color: PINK_DEEP, fontWeight: "700", fontSize: 13.5 },
  weekHeading: { fontSize: 18, fontWeight: "700", color: TEXT_DARK },

  detailCard: {
    backgroundColor: "white",
    borderRadius: 26,
    padding: 22,
    paddingBottom: 28,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: PINK_PALE,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  badgeText: { color: PINK_DEEP, fontWeight: "800", fontSize: 12, letterSpacing: 0.5 },
  weekTitle: { fontSize: 24, fontWeight: "700", color: TEXT_DARK, marginBottom: 18 },

  infoBox: {
    backgroundColor: "#FDF1F5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: PINK_STRONG,
  },
  infoBoxFeel: { borderLeftColor: MAROON },
  infoBoxTip: { borderLeftColor: PINK_MID, backgroundColor: "#FDF6F8" },
  infoLabel: { fontWeight: "800", color: PINK_DEEP, fontSize: 14.5, marginBottom: 4 },
  infoLabelFeel: { color: MAROON },
  infoText: { fontSize: 14.5, color: TEXT_BODY, lineHeight: 20 },
});
