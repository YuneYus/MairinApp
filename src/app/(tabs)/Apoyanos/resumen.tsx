// app/(tabs)/Apoyanos/resumen.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { speakIfEnabled } from "@/hooks/useSpeak";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, globalStyles } from "@/styles/global";

export default function ResumenScreen() {
  const { t, language } = useLanguage();
  const showSpeakerIcons = language === "es";
  const { amount } = useLocalSearchParams<{ amount: string }>();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.titleRow}>
          <Text style={styles.headerTitle}>{t("pagoResumen")}</Text>
          {showSpeakerIcons && (
            <TouchableOpacity
              onPress={() => speakIfEnabled(t("pagoResumen"), language)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="volume-medium"
                size={18}
                color={colors.text}
                style={styles.speakerIcon}
              />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.amount}>C$ {Number(amount).toFixed(2)}</Text>
      </View>

      <View style={globalStyles.content}>
        <TouchableOpacity
          style={styles.messageBox}
          onPress={() => speakIfEnabled(t("ayudanosCrecerjuntas"), language)}
          disabled={!showSpeakerIcons}
        >
          <Text style={styles.messageText}>{t("ayudanosCrecerjuntas")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/Apoyanos/gracias",
              params: { amount },
            } as any)
          }
        >
          <Text style={globalStyles.actionButtonText}>{t("donarAhoraResumen")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },

  backButton: { marginBottom: 20 },

  titleRow: { flexDirection: "row", alignItems: "center" },
  speakerIcon: { marginLeft: 6 },

  headerTitle: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 18,
    color: colors.text,
  },

  amount: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 34,
    color: colors.text,
    marginTop: 8,
  },

  messageBox: {
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 40,
    marginTop: -30,
    backgroundColor: colors.background,
  },

  messageText: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 16,
    color: colors.textSecondary,
  },

  button: {
    backgroundColor: colors.text,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },
});