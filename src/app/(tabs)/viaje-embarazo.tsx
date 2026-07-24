// app/(tabs)/viaje-embarazo.tsx
//
// Pushed from the "Embarazo" ButtonInfo and from the PregnancyJourneyCard
// heart widget in your real index.tsx. Not meant to appear as its own
// bottom tab — see the _layout.tsx note at the end of this message.

import { trimesterOf, WEEK_DATA } from "@/data/embarazoSemanas";
import { colors, globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
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
      <View style={globalStyles.pinkHeader}>
        <TouchableOpacity style={globalStyles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={globalStyles.pinkHeaderTitle}>Tu Viaje De Embarazo</Text>
      </View>

      <View style={styles.body}>
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
          <Text style={globalStyles.label}>Semana {currentWeek}</Text>
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
          <Text style={globalStyles.cardHighlight}>{week.title}</Text>

          <View style={styles.infoBox}>
            <Text style={globalStyles.label}>Dato fascinante:</Text>
            <Text style={globalStyles.textNormal}>{week.fact}</Text>
          </View>
          <View style={[styles.infoBox, styles.infoBoxFeel]}>
            <Text style={[globalStyles.label, styles.infoLabelFeel]}>¿Cómo te sentirás?</Text>
            <Text style={globalStyles.textNormal}>{week.feel}</Text>
          </View>
          <View style={[styles.infoBox, styles.infoBoxTip]}>
            <Text style={globalStyles.label}>Consejo</Text>
            <Text style={globalStyles.textNormal}>{week.tip}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  body: { paddingHorizontal: 18 },

  trimesterRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 20 },
  trimesterItem: { alignItems: "center", gap: 8 },
  trimesterCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.inputBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  trimesterCircleActive: {
    backgroundColor: colors.surface,
    borderColor: colors.surface,
  },
  trimesterIcon: { width: 50, height: 50 },
  trimesterLabel: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 13,
    color: colors.textSecondary,
  },
  trimesterLabelActive: { color: colors.text },

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
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.inputBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  weekDotInTrimester: { borderWidth: 2, borderColor: colors.inputBackground },
  weekDotCurrent: { backgroundColor: colors.text, borderColor: colors.text },
  weekDotText: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 12.5,
    color: colors.textSecondary,
  },
  weekDotTextCurrent: { color: "white" },

  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navButton: {
    borderWidth: 1.5,
    borderColor: colors.inputBackground,
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  navButtonDisabled: { opacity: 0.35 },
  navButtonText: {
    fontFamily: "LeagueSpartan_700Bold",
    color: colors.text,
    fontSize: 13.5,
  },

  detailCard: {
    backgroundColor: colors.background,
    borderRadius: 26,
    padding: 22,
    paddingBottom: 28,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  badgeText: {
    fontFamily: "LeagueSpartan_700Bold",
    color: colors.text,
    fontSize: 12,
    letterSpacing: 0.5,
  },

  infoBox: {
    backgroundColor: colors.inputBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.text,
  },
  infoBoxFeel: { borderLeftColor: colors.text },
  infoBoxTip: { borderLeftColor: colors.inputBackground },
  infoLabelFeel: { color: colors.text },
});