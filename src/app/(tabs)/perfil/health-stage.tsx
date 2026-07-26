// app/(tabs)/perfil/health-stage.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import {
  getHealthStage,
  HealthStage,
  setHealthStage,
} from "@/storage/healthStageStorage";
import { clearPregnancyWeek } from "@/storage/pregnancyWeekStorage";
import { TranslationKey } from "@/translations";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

const STAGES: { key: HealthStage; labelKey: TranslationKey }[] = [
  { key: "menstruacion", labelKey: "Menstruación" },
  { key: "embarazo", labelKey: "Embarazo" },
  { key: "menopausia", labelKey: "Menopausia" },
];

export default function HealthStageScreen() {
  const { t } = useLanguage();
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <SpeakableText
          text={t("menuEtapaSalud")}
          style={globalStyles.pinkHeaderTitle}
          iconSize={20}
        />
      </View>

      <View style={styles.list}>
        {STAGES.map((stage) => (
          <View key={stage.key} style={styles.row}>
            <SpeakableText text={t(stage.labelKey)} style={globalStyles.label} iconSize={16} />
            <Switch
              value={selected === stage.key}
              onValueChange={() => setSelected(stage.key)}
              trackColor={{ false: colors.surface, true: colors.text }}
              thumbColor="white"
            />
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
        <Text style={globalStyles.actionButtonText}>{t("guardar")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 40,
  },
  backButton: { position: "absolute", top: 60, left: 20 },
  list: { paddingHorizontal: 24, paddingTop: 24 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  saveButton: {
    backgroundColor: colors.text,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 30,
  },
});