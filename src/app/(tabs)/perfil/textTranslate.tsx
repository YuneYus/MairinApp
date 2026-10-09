// app/(tabs)/perfil/textTranslate.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { AppLanguage } from "@/storage/languageStorage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

import { colors, globalStyles } from "@/styles/global";

export default function TextTranslateScreen() {
  const { language, changeLanguage, t } = useLanguage();
  const currentLanguage = language ?? "es";

  const options: { key: AppLanguage; label: string }[] = [
    { key: "es", label: t("audioEspanol") },
    { key: "en", label: "Criollo" },
    { key: "mis", label: "Miskito" },
  ];

  const handleLanguageChange = async (nextLanguage: AppLanguage) => {
    if (currentLanguage === nextLanguage) return;
    await changeLanguage(nextLanguage);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)/perfil/settings" as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={globalStyles.pinkHeaderTitle}>{t("cambiarIdiomaTexto")}</Text>
      </View>

      <View style={styles.list}>
        {options.map((option) => (
          <View key={option.key} style={styles.row}>
            <Text style={globalStyles.label}>{option.label}</Text>

            <Switch
              value={currentLanguage === option.key}
              onValueChange={() => {
                void handleLanguageChange(option.key);
              }}
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