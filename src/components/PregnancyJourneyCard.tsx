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
import { colors, globalStyles } from "@/styles/global";
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
        <Text style={[globalStyles.titleBig, {textAlign:"left"}]}>Tu Viaje De Embarazo</Text>

        <View style={styles.card}>
          <Text style={globalStyles.cardTitle}>¿De cuántas semanas estás embarazada?</Text>

          <TouchableOpacity style={styles.selector} onPress={() => setPickerOpen(true)}>
            <Text style={styles.selectorText}>
              {pendingWeek !== null ? `Semana ${pendingWeek}` : "Selecciona una semana"}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.pillButton, styles.saveButton, pendingWeek === null && styles.saveButtonDisabled]}
            disabled={pendingWeek === null}
            onPress={handleGuardar}
          >
            <Text style={globalStyles.pillButtonText}>Guardar</Text>
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
      <Text style={[globalStyles.titleBig, {textAlign:"left"}]}>Tu Viaje De Embarazo</Text>

      <View style={styles.card}>
        <Text style={globalStyles.cardTitle}>
          SEMANA {savedWeek} ({week.title})
        </Text>

        <TouchableOpacity activeOpacity={0.85} onPress={handleHeartPress}>
          <Animated.View style={[styles.heartCircle, { transform: [{ scale }] }]}>
            <Ionicons name="heart" size={34} color={colors.text} />
            <Text style={styles.heartLabel}>¡Presióname!</Text>
          </Animated.View>
        </TouchableOpacity>

        <Text style={globalStyles.textNormal}>
          Toca el corazón para sentir el siguiente latido de tu viaje
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 8, marginBottom: 8 },

  card: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: "center",
  },

  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.text,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    marginTop: 16,
  },
  selectorText: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 14.5,
    color: colors.textSecondary,
  },

  saveButton: { width: "100%" },
  saveButtonDisabled: { opacity: 0.4 },

  heartCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  heartLabel: {
    fontFamily: "LeagueSpartan_700Bold",
    color: colors.text,
    fontSize: 12.5,
    marginTop: 4,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "60%",
  },
  modalTitle: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 14,
  },
  weekOption: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  weekOptionSelected: { backgroundColor: colors.text, borderColor: colors.text },
  weekOptionText: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 13,
    color: colors.textSecondary,
  },
  weekOptionTextSelected: { color: "white" },
});