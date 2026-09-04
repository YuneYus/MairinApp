// app/(tabs)/tamano-bebe.tsx

import { getTrimester, getWeekEmoji } from "@/constants/fetalSizeData";
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationKey } from "@/translations";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import PinkHeader from "@/components/PinkHeader";
import SpeakableText from "@/components/SpeakableText";
import { colors } from "@/styles/global";

const MIN_WEEK = 4;
const MAX_WEEK = 40;

export default function TamanoBebeScreen() {
  const { t } = useLanguage();
  const [week, setWeek] = useState(16);
  const clampedWeek = Math.min(Math.max(week, MIN_WEEK), MAX_WEEK);

  const trimester = getTrimester(clampedWeek);
  const emoji = getWeekEmoji(clampedWeek);

  const fruit = t(`semana${clampedWeek}Comparacion` as TranslationKey);
  const lengthText = t(`semana${clampedWeek}Longitud` as TranslationKey);
  const weightText = t(`semana${clampedWeek}Peso` as TranslationKey);
  const desarrolloText = t(`semana${clampedWeek}Desarrollo` as TranslationKey);
  const cambiosText = t(`semana${clampedWeek}Cambios` as TranslationKey);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PinkHeader title={t("tamanoBebe")} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <SpeakableText
            text="Visualizador de Tamaño Fetal"
            style={styles.title}
            iconSize={18}
          />
          
          <SpeakableText
            text="Desliza para ver la comparación de tamaño y los datos de cada semana."
            style={styles.subtitle}
            iconSize={18}
          />

          <View style={styles.iconBlock}>
            <View style={styles.iconCircle}>
              <Text style={styles.emoji}>{emoji}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{fruit}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t("semanaNLongitud").toUpperCase()}</Text>
              <Text style={styles.statValue}>{lengthText}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t("semanaNPeso").toUpperCase()}</Text>
              <Text style={styles.statValue}>{weightText}</Text>
            </View>
          </View>

          <View style={styles.stageRow}>
            <Text style={styles.stageLabel}>
              {t("semana")} <Text style={styles.stageNum}>{clampedWeek}</Text>
            </Text>
            <View style={styles.phasePill}>
              <Text style={styles.phaseText}>{trimester.toUpperCase()}</Text>
            </View>
          </View>

          <Slider
            style={{ width: "100%", height: 36 }}
            minimumValue={MIN_WEEK}
            maximumValue={MAX_WEEK}
            step={1}
            value={week}
            onValueChange={setWeek}
            minimumTrackTintColor={colors.text}
            maximumTrackTintColor={colors.surface}
            thumbTintColor={colors.text}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelText}>4</Text>
            <Text style={styles.sliderLabelText}>12</Text>
            <Text style={styles.sliderLabelText}>20</Text>
            <Text style={styles.sliderLabelText}>28</Text>
            <Text style={styles.sliderLabelText}>36</Text>
            <Text style={styles.sliderLabelText}>40</Text>
          </View>

          <View style={styles.infoBlock}>
            <SpeakableText text={t("semanaNDesarrollo")} style={styles.infoTitle} iconSize={16} />
            <SpeakableText text={desarrolloText} style={styles.infoText} iconSize={14} />
          </View>

          <View style={styles.divider} />

          <View style={[styles.infoBlock, { marginTop: 16 }]}>
            <SpeakableText text={t("semanaNCambios")} style={styles.infoTitle} iconSize={16} />
            <SpeakableText text={cambiosText} style={styles.infoText} iconSize={14} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 22,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 18,
    color: "#6b6b68",
    marginBottom: 20,
    lineHeight: 24,
  },
  iconBlock: {
    alignItems: "center",
    marginBottom: 22,
  },
  iconCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.inputBackground,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emoji: {
    fontSize: 64,
  },
  badge: {
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: "LeagueSpartan_700Bold",
    color: colors.text,
    fontSize: 18,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  statLabel: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 18,
    color: colors.text,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValue: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 19,
    color: colors.textSecondary,
  },
  stageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  stageLabel: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 18,
    color: colors.textSecondary,
  },
  stageNum: {
    fontFamily: "LeagueSpartan_700Bold",
    color: colors.text,
  },
  phasePill: {
    backgroundColor: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
  },
  phaseText: {
    fontFamily: "LeagueSpartan_700Bold",
    color: "white",
    fontSize: 18,
    letterSpacing: 0.4,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 22,
  },
  sliderLabelText: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 18,
    color: "#9b9b96",
  },
  infoBlock: {
    borderLeftWidth: 3,
    borderLeftColor: colors.text,
    paddingLeft: 14,
  },
  infoTitle: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 18,
    color: colors.text,
    marginBottom: 6,
  },
  infoText: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 18,
    color: "#4a4a47",
    lineHeight: 24,
  },
  divider: {
    borderTopWidth: 0.5,
    borderTopColor: "#e5e2da",
    marginTop: 18,
  },
});