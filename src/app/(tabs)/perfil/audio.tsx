// app/(tabs)/perfil/audio.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { speakIfEnabled } from "@/hooks/useSpeak";
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
  const { t, language } = useLanguage();
  const showSpeakerIcons = language === "es";

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

  const handlePreview = (option: AudioOption) => {
    if (option === "es") {
      speakIfEnabled(t("audioEspanol"), language);
    }
    // "none" has no preview to play
  };

  const options: { key: AudioOption; labelKey: "audioEspanol" | "audioNinguno" }[] = [
    { key: "es", labelKey: "audioEspanol" },
    { key: "none", labelKey: "audioNinguno" },
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

        <Text style={globalStyles.pinkHeaderTitle}>{t("cambiarIdiomaAudio")}</Text>
      </View>

      <View style={styles.list}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={styles.row}
            onPress={() => handlePreview(option.key)}
            disabled={option.key === "none" || !showSpeakerIcons}
          >
            <View style={styles.rowLeft}>
              {option.key !== "none" && showSpeakerIcons && (
                <Ionicons
                  name="volume-medium"
                  size={18}
                  color={colors.text}
                  style={styles.speakerIcon}
                />
              )}
              <Text style={globalStyles.label}>{t(option.labelKey)}</Text>
            </View>

            <Switch
              value={selected === option.key}
              onValueChange={() => handleSelect(option.key)}
              trackColor={{ false: colors.surface, true: colors.text }}
              thumbColor="white"
            />
          </TouchableOpacity>
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

  rowLeft: { flexDirection: "row", alignItems: "center", flex: 1 },

  speakerIcon: { marginRight: 8 },
});