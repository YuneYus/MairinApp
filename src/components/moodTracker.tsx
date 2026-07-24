// components/moodTracker.tsx

import { getTodaysMood, saveTodaysMood } from "@/storage/moodStorage";
import { colors, globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const MOODS = [
  { emoji: "😊", label: "muy_feliz", message: "¡Asombroso! Estás contenta. Sigue así" },
  { emoji: "🙂", label: "bien", message: null },
  { emoji: "🥱", label: "cansada", message: null },
  { emoji: "😔", label: "triste", message: null },
  { emoji: "😭", label: "muy_triste", message: null },
  { emoji: "😠", label: "enojada", message: null },
];

function AnimatedEmoji({
  emoji,
  selected,
  onPress,
}: {
  emoji: string;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (selected) {
      scale.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.15,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [selected, scale]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.emojiCircle,
          selected && styles.emojiCircleSelected,
          { transform: [{ scale }] },
        ]}
      >
        <Text style={styles.emojiText}>{emoji}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function PulsingTalkLink({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [scale]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[styles.talkRow, { transform: [{ scale }] }]}>
        <Text style={styles.talkText}>
          ¿Quieres hablar de cómo te sientes? (con MAIRIN)
        </Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </Animated.View>
    </TouchableOpacity>
  );
}

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
      <Text style={[globalStyles.titleBig, styles.titleLeft]}>
        Tu Estado De Ánimo
      </Text>

      <View style={styles.card}>
        <Text style={globalStyles.cardHighlight}>¿Cómo te sientes hoy?</Text>

        <View style={styles.emojiRow}>
          {MOODS.map((mood) => (
            <AnimatedEmoji
              key={mood.emoji}
              emoji={mood.emoji}
              selected={selected === mood.emoji}
              onPress={() => handleSelect(mood.emoji)}
            />
          ))}
        </View>

        {selected && isVeryHappy && (
          <Text style={[globalStyles.textNormal, styles.positiveMessage]}>
            {selectedMood?.message}
          </Text>
        )}

        {selected && !isVeryHappy && (
          <PulsingTalkLink
            onPress={() =>
              router.push({
                pathname: "/chat-mairin",
                params: { mood: selected },
              } as any)
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 30 },

  titleLeft: {
    textAlign: "left",
    fontSize: 22,
    marginBottom: 14,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
  },

  emojiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  emojiCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiCircleSelected: {
    backgroundColor: colors.background,
  },
  emojiText: { fontSize: 26 },

  positiveMessage: {
    marginTop: 20,
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
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: "underline",
    textAlign: "center",
  },
});