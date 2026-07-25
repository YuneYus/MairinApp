// app/ayuda/index.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { speakIfEnabled } from "@/hooks/useSpeak";
import { colors, globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const EMERGENCY_NUMBERS = [
  {
    name: "Cruz Blanca",
    number: "128",
    icon: "medkit-outline" as const,
  },
  {
    name: "Policía Nacional",
    number: "118",
    icon: "alert-circle-outline" as const,
  },
];

export default function HelpScreen() {
  const { t, language } = useLanguage();
  const showSpeakerIcons = language === "es";

  const handleCall = async (number: string) => {
    const url = `tel:${number}`;
    const supported = await Linking.canOpenURL(url);

 if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "No disponible",
        "No se puede realizar llamadas desde este dispositivo."
      );
    }
  };


  return (
    <View style={styles.container}>
      <View style={globalStyles.pinkHeader}>
        <TouchableOpacity
          style={styles.titleRow}
          onPress={() => speakIfEnabled(t("numeroEmergenciaTitle"), language)}
          disabled={!showSpeakerIcons}
        >
          <Text style={globalStyles.pinkHeaderTitle}>{t("numeroEmergenciaTitle")}</Text>
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
        <View style={styles.emergencyRow}>
          {EMERGENCY_NUMBERS.map((item) => (
            <View key={item.name} style={styles.emergencyCard}>
              <View style={styles.emergencyIconsRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="call" size={18} color={colors.text} />
                </View>
                <View style={styles.iconCircle}>
                  <Ionicons name={item.icon} size={18} color={colors.text} />
                </View>
              </View>

              <View style={styles.nameRow}>
                <Text style={globalStyles.cardTitle}>{item.name}</Text>
                {showSpeakerIcons && (
                  <TouchableOpacity
                    onPress={() => speakIfEnabled(item.name, language)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name="volume-medium"
                      size={14}
                      color={colors.text}
                      style={styles.speakerIconSmall}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={globalStyles.cardSubtitle}>{item.number}</Text>

              <TouchableOpacity
                style={styles.callRow}
                onPress={() => handleCall(item.number)}
              >
                <Text style={styles.callText}>{t("llamar")}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.doctorsPreviewCard}>
          <View style={styles.doctorsPreviewIconCircle}>
            <Ionicons name="medkit" size={32} color={colors.text} />
          </View>

          <View style={styles.doctorsPreviewTextBlock}>
            <View style={styles.nameRow}>
              <Text style={globalStyles.label}>{t("ListaDoctoresCentroSalud")}</Text>
              {showSpeakerIcons && (
                <TouchableOpacity
                  onPress={() => speakIfEnabled(t("ListaDoctoresCentroSalud"), language)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name="volume-medium"
                    size={14}
                    color={colors.text}
                    style={styles.speakerIconSmall}
                  />
                </TouchableOpacity>
              )}
            </View>

           <TouchableOpacity
  style={styles.masButton}
  onPress={() => router.push("/ayuda/doctor")}
>
  <Text style={styles.masButtonText}>Más</Text>
  <Ionicons name="chevron-forward" size={16} color={colors.text} />
</TouchableOpacity>

{showSpeakerIcons && (
  <TouchableOpacity
    onPress={() => speakIfEnabled("Más", language)}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Ionicons name="volume-medium" size={14} color={colors.text} style={{ marginLeft: 4 }} />
  </TouchableOpacity>
)}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  titleRow: { flexDirection: "row", alignItems: "center" },
  speakerIcon: { marginLeft: 8 },
  speakerIconSmall: { marginLeft: 6 },

  nameRow: { flexDirection: "row", alignItems: "center" },

  emergencyRow: { flexDirection: "row", gap: 14 },
  emergencyCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 18,
    padding: 16,
  },
  emergencyIconsRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  callRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 12 },
  callText: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 14,
    color: colors.text,
    textDecorationLine: "underline",
  },

  doctorsPreviewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginTop: 24,
  },
  doctorsPreviewIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  doctorsPreviewTextBlock: { flex: 1 },
  masButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingVertical: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  masButtonText: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 14,
    color: colors.text,
  },
});