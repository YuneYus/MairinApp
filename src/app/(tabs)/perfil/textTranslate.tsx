// app/(tabs)/perfil/textTranslate.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

import { colors, globalStyles } from "@/styles/global";

export default function TextTranslateScreen() {
  const { language, changeLanguage, t } = useLanguage();

  const options: { key: "es" | "en" | "mis"; label: string }[] = [
    { key: "es", label: t("audioEspanol") },
    { key: "en", label: "Criollo" },
    { key: "mis", label: "Miskito" },
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

        <Text style={globalStyles.pinkHeaderTitle}>{t("cambiarIdiomaTexto")}</Text>
      </View>

      <View style={styles.list}>
        {options.map((option) => (
          <View key={option.key} style={styles.row}>
            <Text style={globalStyles.label}>{option.label}</Text>

            <Switch
              value={language === option.key}
              onValueChange={() => changeLanguage(option.key)}
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