// components/cicloInfo.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import {
  getCycleResetDate,
  setCycleResetDate,
} from "@/storage/cycleTrackingStorage";
import { getHealthStage } from "@/storage/healthStageStorage";
import { getMenstruationEntries } from "@/storage/menstruationStorage";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

type CycleStatus = {
  regular: boolean;
  reason?: string;
};

const MIN_CYCLE_DAYS = 21;
const MAX_CYCLE_DAYS = 35;

function daysBetween(a: string, b: string) {
  const d1 = new Date(`${a}T00:00:00`).getTime();
  const d2 = new Date(`${b}T00:00:00`).getTime();
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

function sameMonth(a: string, b: string) {
  return a.slice(0, 7) === b.slice(0, 7);
}

function firstOfNextMonth(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return next.toISOString().split("T")[0];
}

function formatMonthLabel(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
}

function getPeriodStarts(entries: { date: string; period: boolean }[]): string[] {
  const periodDates = entries
    .filter((e) => e.period)
    .map((e) => e.date)
    .sort();

  const starts: string[] = [];

  periodDates.forEach((date, index) => {
    if (index === 0) {
      starts.push(date);
      return;
    }
    const prev = periodDates[index - 1];
    if (daysBetween(prev, date) > 1) {
      starts.push(date);
    }
  });

  return starts;
}

function analyzeCycle(starts: string[]): CycleStatus {
  if (starts.length === 0) {
    return { regular: true };
  }

  const todayString = new Date().toISOString().split("T")[0];
  const lastStart = starts[starts.length - 1];

  // NOTE: this flag ("irregular") is now purely boolean — the actual
  // display text is built with translation keys in the component,
  // not hardcoded here, so it can switch language.
  if (daysBetween(lastStart, todayString) > MAX_CYCLE_DAYS) {
    return { regular: false, reason: "irregular" };
  }

  for (let i = 1; i < starts.length; i++) {
    const prevStart = starts[i - 1];
    const currStart = starts[i];
    const gap = daysBetween(prevStart, currStart);

    if (gap < MIN_CYCLE_DAYS || gap > MAX_CYCLE_DAYS || sameMonth(prevStart, currStart)) {
      return { regular: false, reason: "irregular" };
    }
  }

  return { regular: true };
}

export default function CicloInfoCard() {
  const { t } = useLanguage();

  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<CycleStatus>({ regular: true });
  const [expanded, setExpanded] = useState(false);
  const [pendingResetDate, setPendingResetDate] = useState<string | null>(null);

  const load = useCallback(async () => {
    const stage = await getHealthStage();

    if (stage !== "menstruacion") {
      setVisible(false);
      return;
    }

    setVisible(true);

    const resetDate = await getCycleResetDate();
    const todayString = new Date().toISOString().split("T")[0];
    const allEntries = await getMenstruationEntries();

    // Only apply the filter once the reset date has actually arrived.
    // If it's still in the future, keep tracking normally and show it as "pending".
    const resetIsActive = resetDate && resetDate <= todayString;

    setPendingResetDate(resetDate && !resetIsActive ? resetDate : null);

    const relevant = resetIsActive
      ? allEntries.filter((e: any) => e.date >= resetDate)
      : allEntries;

    const starts = getPeriodStarts(relevant);
    setStatus(analyzeCycle(starts));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleReiniciar = () => {
    const nextMonthStart = firstOfNextMonth();
    const label = formatMonthLabel(nextMonthStart);

    Alert.alert(
      t("reiniciarHistorialCiclo"),
      `El seguimiento se reiniciará a partir de ${label}. Este mes seguirá registrándose normalmente y tu historial anterior no se perderá.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            await setCycleResetDate(nextMonthStart);
            await load();
          },
        },
      ]
    );
  };

  const handleActualizarFecha = () => {
    router.push("/(tabs)/calendar" as any);
  };

  if (!visible) return null;

  // Regular-cycle message: "queBien" is just the exclamation ("¡Que bien!"),
  // the rest of the sentence has no translation key yet — left hardcoded.
  const regularBodyText = `${t("queBien")} Tu período llega a tiempo cada mes.`;

  // Irregular-cycle reason: reconstructed from the two matching keys
  // instead of the old hardcoded string.
  const irregularBodyText = `${t("descripcionMenstruacionIrregular")}\n${t("olvidoFechaCalendario")}`;

  return (
    <View style={styles.wrapper}>
      <SpeakableText text={t("InformacionCiclo")} style={globalStyles.label} iconSize={16} />

      <View style={styles.card}>
        {!status.regular && (
          <TouchableOpacity style={styles.reiniciarButton} onPress={handleReiniciar}>
            <Ionicons name="refresh" size={16} color="white" />
            <Text style={styles.reiniciarText}>{t("reiniciarHistorialCiclo")}</Text>
          </TouchableOpacity>
        )}

        {pendingResetDate && (
          <Text style={styles.pendingText}>
            Reinicio programado para {formatMonthLabel(pendingResetDate)}
          </Text>
        )}

        <View style={styles.rowContent}>
          <View style={styles.faceCircle}>
            <Image
              source={
                status.regular
                  ? require("@/app/assets/images/HappyWhite.png")
                  : require("@/app/assets/images/SadWhite.png")
              }
              style={styles.faceImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.messageBox}>
            <SpeakableText
              text={status.regular ? t("menstruacionRegular") : t("menstruacionIrregular")}
              style={styles.messageTitle}
              iconSize={14}
            />

            <SpeakableText
              text={status.regular ? regularBodyText : irregularBodyText}
              style={[globalStyles.textNormal, styles.messageBody]}
              iconSize={14}
            />

            <View style={styles.actionsRow}>
              {!status.regular && (
                <TouchableOpacity
                  style={styles.actualizarButton}
                  onPress={handleActualizarFecha}
                >
                  <Text style={styles.actualizarText}>{t("actualizarFecha")}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.leerMasRow}
                onPress={() => {
                  if (status.regular) {
                    setExpanded((prev) => !prev);
                  } else {
                    router.push("/(tabs)/leer-mas-ciclo" as any);
                  }
                }}
              >
                <Text style={styles.leerMasText}>{t("LeerMas")}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.text} />
              </TouchableOpacity>
            </View>

            {expanded && (
              <Text style={[globalStyles.textNormal, styles.expandedText]}>
                {status.regular
                  ? "Un ciclo regular suele durar entre 21 y 35 días. Seguir registrando tu período nos ayuda a detectar cambios a tiempo."
                  : "Si esto continúa, te recomendamos hablar con tu doctor(a) sobre los cambios en tu ciclo."}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 30 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
  },
  pendingText: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 15,
    color: colors.text,
    textAlign: "right",
    marginTop: 8,
  },
  rowContent: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 12 },
  faceCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  faceImage: { width: 100, height: 100 },
  messageBox: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
  },
  messageTitle: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 15,
    color: colors.text,
    marginBottom: 6,
  },
  messageBody: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 15,
    color: "#444",
    lineHeight: 21,
  },
  leerMasRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 10 },
  leerMasText: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 15,
    color: colors.text,
    textDecorationLine: "underline",
  },
  expandedText: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 15,
    color: "#555",
    marginTop: 10,
    lineHeight: 21,
  },
  reiniciarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.text,
    borderRadius: 20,
    paddingVertical: 10,
    alignSelf: "flex-end",
  },
  reiniciarText: {
    fontFamily: "LeagueSpartan_700Bold",
    color: "white",
    fontSize: 15,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actualizarButton: {
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  actualizarText: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 15,
    color: colors.text,
  },
});