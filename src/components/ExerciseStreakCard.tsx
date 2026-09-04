// components/ExerciseStreakCard.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { speakIfEnabled } from "@/hooks/useSpeak";
import { getExerciseStreakData } from "@/utils/exerciseStreak";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, globalStyles } from "@/styles/global";

type DayStatus = "done" | "missed" | "future";

type WeekDay = {
  label: string;
  status: DayStatus;
  dateString: string;
};

export default function ExerciseStreakCard() {
  const { t, language } = useLanguage();
  const showSpeakerIcons = language === "es";

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

  const titleText = t("HiceEjercicios");
  const subtitleText = `${streak} ${t("diasRancha")}`;

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={[globalStyles.label, styles.title]}>{titleText}</Text>
        {showSpeakerIcons && (
          <TouchableOpacity
            onPress={() => speakIfEnabled(titleText, language)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="volume-medium"
              size={16}
              color={colors.text}
              style={styles.speakerIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      <Ionicons name="flame" size={48} color={colors.text} style={styles.flameIcon} />

      <View style={styles.subtitleRow}>
        <Text style={[globalStyles.textNormal, styles.streakSubtitle]}>
          {subtitleText}
        </Text>
        {showSpeakerIcons && (
          <TouchableOpacity
            onPress={() => speakIfEnabled(subtitleText, language)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="volume-medium"
              size={14}
              color={colors.text}
              style={styles.speakerIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.weekRow}>
        {week.map((day) => (
          <View key={day.dateString} style={styles.dayColumn}>
            <Text style={[globalStyles.textNormal, styles.dayLabel]}>{day.label}</Text>
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
    backgroundColor: colors.inputBackground,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.surface,
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },
  titleRow: { flexDirection: "row", alignItems: "center" },
  title: {
    color: colors.text,
    marginBottom: 0,
    marginTop: 0,
  },
  speakerIcon: { marginLeft: 8 },
  flameIcon: {
    marginVertical: 4,
  },
  streakCount: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 30,
    color: colors.textSecondary,
    marginTop: 6,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  streakSubtitle: {
    color: "#666",
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
    color: "#999",
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleFuture: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#F0DCE4",
  },
});