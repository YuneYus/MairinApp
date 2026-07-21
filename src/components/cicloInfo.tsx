// components/cicloInfo.tsx

import {
    getCycleResetDate,
    setCycleResetDate,
} from "@/storage/cycleTrackingStorage";
import { getHealthStage } from "@/storage/healthStageStorage";
import { getMenstruationEntries } from "@/storage/menstruationStorage";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

  if (daysBetween(lastStart, todayString) > MAX_CYCLE_DAYS) {
    return {
      regular: false,
      reason:
        "Tu período no sigue un patrón regular y puede adelantarse, retrasarse o cambiar en duración.\n¿Será que se te olvidó apuntar la fecha en el calendario?",
    };
  }

  for (let i = 1; i < starts.length; i++) {
    const prevStart = starts[i - 1];
    const currStart = starts[i];
    const gap = daysBetween(prevStart, currStart);

    if (gap < MIN_CYCLE_DAYS || gap > MAX_CYCLE_DAYS || sameMonth(prevStart, currStart)) {
      return {
        regular: false,
        reason:
          "Tu período no sigue un patrón regular y puede adelantarse, retrasarse o cambiar en duración.\n¿Será que se te olvidó apuntar la fecha en el calendario?",
      };
    }
  }

  return { regular: true };
}

export default function CicloInfoCard() {
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
      "Reiniciar Historial Del Ciclo",
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

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Información De Tu Ciclo</Text>

      <View style={styles.card}>
        {!status.regular && (
          <TouchableOpacity style={styles.reiniciarButton} onPress={handleReiniciar}>
            <Ionicons name="refresh" size={16} color="white" />
            <Text style={styles.reiniciarText}>Reiniciar Historial Del Ciclo</Text>
          </TouchableOpacity>
        )}

        {pendingResetDate && (
          <Text style={styles.pendingText}>
            Reinicio programado para {formatMonthLabel(pendingResetDate)}
          </Text>
        )}

        <View style={styles.rowContent}>
          <View style={styles.faceCircle}>
            <Text style={styles.faceEmoji}>{status.regular ? "😊" : "😟"}</Text>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.messageTitle}>
              {status.regular
                ? "Tu menstruación está regular"
                : "Tu menstruación está irregular"}
            </Text>

            <Text style={styles.messageBody}>
              {status.regular
                ? "¡Que bien! Tu período llega a tiempo cada mes."
                : status.reason}
            </Text>

            <View style={styles.actionsRow}>
              {!status.regular && (
                <TouchableOpacity
                  style={styles.actualizarButton}
                  onPress={handleActualizarFecha}
                >
                  <Text style={styles.actualizarText}>Actualizar fecha</Text>
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
  <Text style={styles.leerMasText}>Leer más</Text>
  <Ionicons name="chevron-forward" size={16} color="#B0195B" />
</TouchableOpacity>

</View>

            {expanded && (
              <Text style={styles.expandedText}>
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
  title: { fontSize: 20, fontWeight: "bold", color: "#B0195B", marginBottom: 14 },
  card: {
    backgroundColor: "#F6C6D6",
    borderRadius: 24,
    padding: 16,
  },
  pendingText: {
    fontSize: 12,
    color: "#7A1240",
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
  faceEmoji: { fontSize: 40 },
  messageBox: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
  },
  messageTitle: { fontSize: 15, fontWeight: "bold", color: "#B0195B", marginBottom: 6 },
  messageBody: { fontSize: 13, color: "#444", lineHeight: 18 },
  leerMasRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 10 },
  leerMasText: { fontSize: 13, fontWeight: "bold", color: "#B0195B", textDecorationLine: "underline" },
  expandedText: { marginTop: 10, fontSize: 13, color: "#555", lineHeight: 18 },
  reiniciarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#B0195B",
    borderRadius: 20,
    paddingVertical: 10,
    alignSelf: "flex-end",
  },
  reiniciarText: { color: "white", fontSize: 13, fontWeight: "bold" },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actualizarButton: {
    backgroundColor: "#F6AFC5",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  actualizarText: { fontSize: 13, fontWeight: "bold", color: "#B0195B" },
});