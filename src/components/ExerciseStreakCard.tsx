// components/ExerciseStreakCard.tsx

import { getExerciseStreakData } from "@/utils/exerciseStreak";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type DayStatus = "done" | "missed" | "future";

type WeekDay = {
  label: string;
  status: DayStatus;
  dateString: string;
};

export default function ExerciseStreakCard() {
  const [streak, setStreak] = useState(0);
  const [week, setWeek] = useState<WeekDay[]>([]);

  // Reload every time this screen comes into focus, so saving in
  // Calendario updates the streak immediately when you come back home.
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await getExerciseStreakData();
        setStreak(data.streak);
        setWeek(data.week);
      };
      load();
    }, [])
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Hice Ejercicios</Text>

      <Ionicons name="flame" size={48} color="#B0195B" style={styles.flameIcon} />

      <Text style={styles.streakCount}>{streak} días</Text>
      <Text style={styles.streakSubtitle}>de racha</Text>

      <View style={styles.weekRow}>
        {week.map((day) => (
          <View key={day.dateString} style={styles.dayColumn}>
            <Text style={styles.dayLabel}>{day.label}</Text>
            <View
              style={[
                styles.dayCircle,
                day.status === "future" && styles.dayCircleFuture,
              ]}
            >
              {day.status === "done" && (
                <Ionicons name="flame" size={18} color="white" />
              )}
              {day.status === "missed" && (
                <Ionicons name="close" size={18} color="white" />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FDE8EF",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#F6C6D6",
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#B0195B",
    marginBottom: 8,
  },
  flameIcon: {
    marginVertical: 4,
  },
  streakCount: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#222",
    marginTop: 6,
  },
  streakSubtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 16,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  dayColumn: {
    alignItems: "center",
    gap: 6,
  },
  dayLabel: {
    fontSize: 13,
    color: "#999",
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#B0195B",
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleFuture: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#F0DCE4",
  },
});