

// components/chatSummaryCard.tsx

import {
    ChatSummary,
    getTodaysChatSummary,
} from "@/storage/chatSummaryStorage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ChatSummaryCard() {
  const [summary, setSummary] = useState<ChatSummary | null>(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await getTodaysChatSummary();
        setSummary(data);
      };
      load();
    }, [])
  );

  if (!summary) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.icon}>💛</Text>
        <Text style={styles.text}>{summary.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 20 },
  card: {
    backgroundColor: "#FBDCE7",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: { fontSize: 22 },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#7A1240",
    fontStyle: "italic",
  },
});