// app/(tabs)/Apoyanos/index.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { speakIfEnabled } from "@/hooks/useSpeak";
import { colors, globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ApoyanosScreen() {
  const { t, language } = useLanguage();
  const showSpeakerIcons = language === "es";

  return (
    <View style={styles.container}>
      <View style={globalStyles.pinkHeader}>
        <TouchableOpacity
          style={styles.titleRow}
          onPress={() => speakIfEnabled(t("apoyanos"), language)}
          disabled={!showSpeakerIcons}
        >
          <Text style={globalStyles.pinkHeaderTitle}>{t("apoyanos")}</Text>
          {showSpeakerIcons && (
            <Ionicons
              name="volume-medium"
              size={20}
              color={colors.text}
              style={styles.speakerIcon}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={globalStyles.content}>
        <View style={styles.descriptionWrapper}>
          <Text style={[globalStyles.textNormal, styles.description]}>
            {t("apoyanosText")}
          </Text>

          {showSpeakerIcons && (
            <TouchableOpacity
              style={styles.descriptionSpeaker}
              onPress={() => speakIfEnabled(t("apoyanosText"), language)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="volume-medium" size={18} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/Apoyanos/donar" as any)}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="heart-outline" size={22} color={colors.text} />
          </View>
          <Text style={[globalStyles.cardTitle, styles.buttonText]}>
            {t("quieroDonar")}
          </Text>
          {showSpeakerIcons && (
            <TouchableOpacity
              onPress={() => speakIfEnabled(t("quieroDonar"), language)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="volume-medium" size={18} color={colors.text} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/Apoyanos/patrocinar" as any)}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="gift-outline" size={22} color={colors.text} />
          </View>
          <Text style={[globalStyles.cardTitle, styles.buttonText]}>
            {t("quieroSerPatrocinardor")}
          </Text>
          {showSpeakerIcons && (
            <TouchableOpacity
              onPress={() => speakIfEnabled(t("quieroSerPatrocinardor"), language)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="volume-medium" size={18} color={colors.text} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/Apoyanos/otramanera" as any)}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="people-outline" size={22} color={colors.text} />
          </View>
          <Text style={[globalStyles.cardTitle, styles.buttonText]}>
            {t("quieroAyudarOtraFormas")}
          </Text>
          {showSpeakerIcons && (
            <TouchableOpacity
              onPress={() => speakIfEnabled(t("quieroAyudarOtraFormas"), language)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="volume-medium" size={18} color={colors.text} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  speakerIcon: {
    marginLeft: 8,
  },

  descriptionWrapper: {
    marginTop: 20,
    marginBottom: 30,
  },

  description: {},

  descriptionSpeaker: {
    marginTop: 8,
    alignSelf: "flex-start",
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },

  buttonText: {
    flex: 1,
    flexWrap: "wrap",
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
});