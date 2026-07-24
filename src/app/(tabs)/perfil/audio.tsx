// app/(tabs)/perfil/audio.tsx

import {
  AudioOption,
  getAudioLanguage,
  setAudioLanguage,
} from "@/storage/audioLanguageStorage";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

import { colors, globalStyles } from "@/styles/global";

export default function AudioScreen() {
  const [selected, setSelected] = useState<AudioOption>("es");

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const saved = await getAudioLanguage();
        setSelected(saved);
      };
      load();
    }, [])
  );

  const handleSelect = async (option: AudioOption) => {
    setSelected(option);
    await setAudioLanguage(option);
  };

  const options: { key: AudioOption; label: string }[] = [
    { key: "es", label: "Español" },
    { key: "none", label: "No Audio" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={globalStyles.pinkHeaderTitle}>Audio</Text>
      </View>

      <View style={styles.list}>
        {options.map((option) => (
          <View key={option.key} style={styles.row}>
            <Text style={globalStyles.label}>{option.label}</Text>

            <Switch
              value={selected === option.key}
              onValueChange={() => handleSelect(option.key)}
              trackColor={{ false: colors.surface, true: colors.text }}
              thumbColor="white"
            />
          </View>
        ))}
      </View>
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
});