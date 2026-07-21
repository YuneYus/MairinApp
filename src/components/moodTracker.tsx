

// components/moodTracker.tsx

import { getTodaysMood, saveTodaysMood } from "@/storage/moodStorage";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MOODS = [
  { emoji: "😊", label: "muy_feliz", message: "¡Asombroso! Estás contenta. Sigue así" },
  { emoji: "🙂", label: "bien", message: null },
  { emoji: "🥱", label: "cansada", message: null },
  { emoji: "😔", label: "triste", message: null },
  { emoji: "😭", label: "muy_triste", message: null },
  { emoji: "😠", label: "enojada", message: null },
];

export default function MoodTracker() {
  const [selected, setSelected] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const mood = await getTodaysMood();
        setSelected(mood);
      };
      load();
    }, [])
  );

  const handleSelect = async (emoji: string) => {
    setSelected(emoji);
    await saveTodaysMood(emoji);
  };

  const selectedMood = MOODS.find((m) => m.emoji === selected);
  const isVeryHappy = selectedMood?.label === "muy_feliz";

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Tu Estado De Ánimo</Text>

      <View style={styles.card}>
        <Text style={styles.question}>¿Cómo te sientes hoy?</Text>

        <View style={styles.emojiRow}>
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.emoji}
              onPress={() => handleSelect(mood.emoji)}
              style={[
                styles.emojiCircle,
                selected === mood.emoji && styles.emojiCircleSelected,
              ]}
            >
              <Text style={styles.emojiText}>{mood.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selected && isVeryHappy && (
          <Text style={styles.positiveMessage}>{selectedMood?.message}</Text>
        )}

        {selected && !isVeryHappy && (
          <TouchableOpacity
            style={styles.talkRow}
            onPress={() =>
              router.push({
                pathname: "/chat-mairin",
                params: { mood: selected },
              } as any)
            }
          >
            <Text style={styles.talkText}>
              ¿Quieres hablar de cómo te sientes? (con MAIRIN)
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#222" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 30 },
  title: { fontSize: 22, fontWeight: "bold", color: "#B0195B", marginBottom: 14 },
  card: {
    backgroundColor: "#F6C6D6",
    borderRadius: 24,
    padding: 16,
  },
  question: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#B0195B",
    marginBottom: 16,
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  emojiCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiCircleSelected: {
    backgroundColor: "#F6AFC5",
  },
  emojiText: { fontSize: 26 },
  positiveMessage: {
    marginTop: 20,
    fontSize: 15,
    color: "#222",
    textAlign: "center",
  },
  talkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  talkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    textDecorationLine: "underline",
    textAlign: "center",
  },
});