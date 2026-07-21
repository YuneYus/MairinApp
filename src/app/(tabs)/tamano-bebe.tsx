

// app/(tabs)/tamano-bebe.tsx

import { getFetalWeekData, getTrimester } from "@/constants/fetalSizeData";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PINK_BG = "#FBEAF0";
const PINK_DARK = "#993556";

const MIN_WEEK = 4;
const MAX_WEEK = 40;

export default function TamanoBebeScreen() {
  const [week, setWeek] = useState(16);
  const data = getFetalWeekData(week);
  const trimester = getTrimester(week);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={PINK_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tamaño De Tu Bebé</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Visualizador de Tamaño Fetal</Text>
          <Text style={styles.subtitle}>
            Desliza para ver la comparación de tamaño y los datos de cada semana.
          </Text>

          <View style={styles.iconBlock}>
            <View style={styles.iconCircle}>
              <Text style={styles.emoji}>{data.emoji}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{data.fruit}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>LONGITUD</Text>
              <Text style={styles.statValue}>~{data.lengthCm} cm</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>PESO</Text>
              <Text style={styles.statValue}>~{data.weightG} g</Text>
            </View>
          </View>

          <View style={styles.stageRow}>
            <Text style={styles.stageLabel}>
              Semana <Text style={styles.stageNum}>{data.week}</Text>
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
            minimumTrackTintColor={PINK_DARK}
            maximumTrackTintColor={PINK_BG}
            thumbTintColor={PINK_DARK}
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
            <Text style={styles.infoTitle}>Desarrollo del bebé</Text>
            <Text style={styles.infoText}>{data.desarrollo}</Text>
          </View>

          <View style={styles.divider} />

          <View style={[styles.infoBlock, { marginTop: 16 }]}>
            <Text style={styles.infoTitle}>Cambios maternos</Text>
            <Text style={styles.infoText}>{data.cambios}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PINK_BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: PINK_DARK,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: PINK_DARK,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b6b68",
    marginBottom: 20,
    lineHeight: 20,
  },
  iconBlock: {
    alignItems: "center",
    marginBottom: 22,
  },
  iconCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: PINK_BG,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emoji: {
    fontSize: 64,
  },
  badge: {
    backgroundColor: PINK_BG,
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 999,
  },
  badgeText: {
    color: PINK_DARK,
    fontSize: 15,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  statBox: {
    flex: 1,
    backgroundColor: PINK_BG,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#72243E",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 19,
    fontWeight: "700",
    color: "#2C2C2A",
  },
  stageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  stageLabel: {
    fontSize: 17,
    color: "#1a1a1a",
  },
  stageNum: {
    fontWeight: "700",
    color: PINK_DARK,
  },
  phasePill: {
    backgroundColor: PINK_DARK,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
  },
  phaseText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 22,
  },
  sliderLabelText: {
    fontSize: 11,
    color: "#9b9b96",
  },
  infoBlock: {
    borderLeftWidth: 3,
    borderLeftColor: PINK_DARK,
    paddingLeft: 14,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: PINK_DARK,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 15,
    color: "#4a4a47",
    lineHeight: 22,
  },
  divider: {
    borderTopWidth: 0.5,
    borderTopColor: "#e5e2da",
    marginTop: 18,
  },
});
