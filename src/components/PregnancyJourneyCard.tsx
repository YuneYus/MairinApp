// components/PregnancyJourneyCard.tsx
//
// Drop this into app/(tabs)/index.tsx next to <PregnancySizeCard />, e.g.:
//
//   import { PregnancyJourneyCard } from "@/components/PregnancyJourneyCard";
//   ...
//   <PregnancyJourneyCard />
//
// Behavior:
//  - Renders nothing unless the saved health stage is "embarazo".
//  - If no pregnancy week has been saved yet, shows a question
//    ("¿De cuántas semanas estás embarazada?") with a week 1–40 dropdown
//    and a Guardar button, instead of the heart.
//  - Once a week is saved, shows "SEMANA N (title)" + the heart. Tapping
//    the heart pulses/buzzes, then jumps straight to that week on the
//    full journey screen.
//
// The "ask again" trigger (clearing the saved week when the user newly
// switches to "embarazo" in perfil/health-stage.tsx) lives in that file,
// not here — see the note I sent with it.

import { WEEK_DATA } from "@/data/embarazoSemanas";
import { getHealthStage } from "@/storage/healthStageStorage";
import {
    getPregnancyWeek,
    setPregnancyWeek,
} from "@/storage/pregnancyWeekStorage";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
    Animated,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const MAROON = "#7C1F3F";
const PINK_BG = "#FDEEF2";
const PINK_SOFT = "#F7CDD9";
const PINK_MID = "#EFA9C1";
const PINK_STRONG = "#E05F8B";
const PINK_PALE_CIRCLE = "#F6C6D6";
const TEXT_BODY = "#6B4550";
const TEXT_DARK = "#3A1420";

const WEEK_OPTIONS = Array.from({ length: 40 }, (_, i) => i + 1);

export function PregnancyJourneyCard() {
  const [visible, setVisible] = useState(false);
  const [savedWeek, setSavedWeek] = useState<number | null>(null);
  const [pendingWeek, setPendingWeek] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const stage = await getHealthStage();
        if (stage !== "embarazo") {
          setVisible(false);
          return;
        }
        setVisible(true);
        const week = await getPregnancyWeek();
        setSavedWeek(week);
      };
      load();
    }, [])
  );

  if (!visible) return null;

  const handleGuardar = async () => {
    if (pendingWeek === null) return;
    await setPregnancyWeek(pendingWeek);
    setSavedWeek(pendingWeek);
  };

  const handleHeartPress = () => {
    if (savedWeek === null) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.25, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1.18, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      router.push({
        pathname: "/viaje-embarazo",
        params: { semana: String(savedWeek) },
      });
    });

    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }, 150);
  };

  // --- Not yet answered: show the question instead of the heart ---
  if (savedWeek === null) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.title}>Tu Viaje De Embarazo</Text>
        <View style={styles.card}>
          <Text style={styles.question}>¿De cuántas semanas estás embarazada?</Text>

          <TouchableOpacity style={styles.selector} onPress={() => setPickerOpen(true)}>
            <Text style={styles.selectorText}>
              {pendingWeek !== null ? `Semana ${pendingWeek}` : "Selecciona una semana"}
            </Text>
            <Ionicons name="chevron-down" size={18} color={MAROON} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, pendingWeek === null && styles.saveButtonDisabled]}
            disabled={pendingWeek === null}
            onPress={handleGuardar}
          >
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={pickerOpen} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setPickerOpen(false)}
          >
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Selecciona tu semana</Text>
              <FlatList
                data={WEEK_OPTIONS}
                keyExtractor={(w) => String(w)}
                numColumns={5}
                contentContainerStyle={{ paddingBottom: 12 }}
                renderItem={({ item: w }) => (
                  <TouchableOpacity
                    style={[
                      styles.weekOption,
                      pendingWeek === w && styles.weekOptionSelected,
                    ]}
                    onPress={() => {
                      setPendingWeek(w);
                      setPickerOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.weekOptionText,
                        pendingWeek === w && styles.weekOptionTextSelected,
                      ]}
                    >
                      {w}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

  // --- Answered: show the heart, tied to the saved week ---
  const week = WEEK_DATA[savedWeek];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Tu Viaje De Embarazo</Text>
      <View style={styles.card}>
        <Text style={styles.heading}>
          SEMANA {savedWeek} ({week.title})
        </Text>

        <TouchableOpacity activeOpacity={0.85} onPress={handleHeartPress}>
          <Animated.View style={[styles.heartCircle, { transform: [{ scale }] }]}>
            <Ionicons name="heart" size={34} color={MAROON} />
            <Text style={styles.heartLabel}>¡Presióname!</Text>
          </Animated.View>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          Toca el corazón para sentir el siguiente latido de tu viaje
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 8, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "700", color: MAROON, marginBottom: 10 },
  card: {
    backgroundColor: PINK_BG,
    borderWidth: 1.5,
    borderColor: PINK_SOFT,
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: "center",
  },

  question: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_DARK,
    textAlign: "center",
    marginBottom: 16,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: PINK_MID,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  selectorText: { fontSize: 14.5, fontWeight: "600", color: TEXT_DARK },
  saveButton: {
    backgroundColor: PINK_STRONG,
    borderRadius: 20,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { color: "white", fontWeight: "700", fontSize: 14.5 },

  heading: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_DARK,
    textAlign: "center",
    marginBottom: 16,
  },
  heartCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: PINK_PALE_CIRCLE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heartLabel: { color: MAROON, fontWeight: "700", fontSize: 12.5, marginTop: 4 },
  helperText: {
    fontSize: 13,
    color: TEXT_BODY,
    textAlign: "center",
    lineHeight: 18,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: MAROON,
    textAlign: "center",
    marginBottom: 14,
  },
  weekOption: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: PINK_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  weekOptionSelected: { backgroundColor: PINK_STRONG, borderColor: PINK_STRONG },
  weekOptionText: { fontSize: 13, fontWeight: "700", color: TEXT_BODY },
  weekOptionTextSelected: { color: "white" },
});
