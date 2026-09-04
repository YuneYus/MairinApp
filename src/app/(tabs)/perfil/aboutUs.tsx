// app/(tabs)/aboutUs.tsx

import SpeakableText from "@/components/SpeakableText";
import { useLanguage } from "@/contexts/LanguageContext";
import { colors, globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AboutUsScreen() {
  const { t } = useLanguage();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={globalStyles.pinkHeaderTitle}>{t("quienesSomosTitulo")}</Text>
      </View>

      <View style={styles.mainCard}>
        <View style={styles.logoCircle}>
          <Image
            source={require("@/app/assets/images/transRelaxPink.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.mairinTitle}>{t("sloganTitulo")}</Text>
        <SpeakableText
          text={t("slogan")}
          style={[globalStyles.textNormal, styles.centeredText]}
        />
      </View>

      <View style={styles.card}>
        <SpeakableText text={t("quienesSomosTitulo")} style={styles.cardTitleCentered} />
        <SpeakableText
          text={t("quienesSomos")}
          style={[globalStyles.textNormal, styles.centeredText]}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.sideBarWrapper}>
          <View style={styles.sideBar} />
          <View style={styles.sideBarContent}>
            <SpeakableText text={t("misionTitulo")} style={styles.sectionTitle} />
            <SpeakableText
              text={t("mision")}
              style={[globalStyles.textNormal, styles.bodyText]}
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sideBarWrapper}>
          <View style={styles.sideBar} />
          <View style={styles.sideBarContent}>
            <SpeakableText text={t("visionTitulo")} style={styles.sectionTitle} />
            <SpeakableText
              text={t("vision")}
              style={[globalStyles.textNormal, styles.bodyText]}
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.heartCircle}>
          <Ionicons name="heart-outline" size={26} color={colors.text} />
        </View>
        <SpeakableText text={t("corazonMairinTitulo")} style={styles.cardTitleCentered} />
        <SpeakableText
          text={t("corazonMairin")}
          style={[globalStyles.textNormal, styles.centeredText]}
        />
      </View>

      <View style={styles.card}>
        <SpeakableText text={t("contenidoVerificadoTitulo")} style={styles.cardTitleCentered} />
        <SpeakableText
          text={t("contenidoVerificado")}
          style={[globalStyles.textNormal, styles.centeredText]}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },

  header: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    marginHorizontal: -20,
    marginTop: -20,
    marginBottom: 20,
  },
  backButton: { position: "absolute", top: 60, left: 20 },

  card: {
    backgroundColor: "white",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EEE",
    padding: 20,
    marginBottom: 16,
  },

  mainCard: {
    backgroundColor: "white",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EEE",
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },

  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  logoImage: {
    width: 50,
    height: 50,
  },

  mairinTitle: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 24,
    color: "#222",
    marginBottom: 8,
  },

  centeredText: {
    textAlign: "center",
    color: "#444",
    lineHeight: 21,
  },

  cardTitleCentered: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 18,
    color: "#222",
    textAlign: "center",
    marginBottom: 10,
  },

  sideBarWrapper: {
    flexDirection: "row",
  },

  sideBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: colors.text,
    marginRight: 14,
  },

  sideBarContent: { flex: 1 },

  sectionTitle: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 18,
    color: "#222",
    marginBottom: 8,
  },

  bodyText: {
    color: "#444",
    lineHeight: 21,
  },

  heartCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
});