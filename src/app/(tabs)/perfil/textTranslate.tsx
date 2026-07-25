// app/(tabs)/perfil/textTranslate.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function TextTranslateScreen() {
  const { language, changeLanguage, t } = useLanguage();

  const options: { key: "es" | "mis"; labelKey: "audioEspanol" | "audioMiskito" }[] = [
    { key: "es", labelKey: "audioEspanol" },
    { key: "mis", labelKey: "audioMiskito" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t("cambiarIdiomaTexto")}</Text>
      </View>

      <View style={styles.list}>
        {options.map((option) => (
          <View key={option.key} style={styles.row}>
            <Text style={styles.rowLabel}>{t(option.labelKey)}</Text>

            <Switch
              value={language === option.key}
              onValueChange={() => changeLanguage(option.key)}
              trackColor={{ false: "#F6D9E4", true: "#B0195B" }}
              thumbColor="white"
            />
          </View>
        ))}
      </View>
    </View>
  );
}

// styles unchanged

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },

  header: {
    backgroundColor: "#F6C6D6",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 40,
  },

  backButton: { position: "absolute", top: 60, left: 20 },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },

  list: { paddingHorizontal: 24, paddingTop: 24 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },

  rowLabel: { fontSize: 15, color: "#222" },
});