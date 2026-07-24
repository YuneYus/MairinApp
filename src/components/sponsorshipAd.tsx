// components/sponsorshipAd.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, globalStyles } from "@/styles/global";

export default function SponsorshipAd() {
  return (
    <View style={styles.card}>
      <Text style={[globalStyles.label, styles.title]}>Nuestro patrocinadores</Text>

      <View style={styles.logosRow}>
        <Image
          source={require("@/app/assets/images/vivianPellas.png")}
          style={styles.logoWide}
          resizeMode="contain"
        />

        <View style={styles.uamBox}>
          <Image
            source={require("@/app/assets/images/UAM.png")}
            style={styles.logoUam}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={[globalStyles.textNormal, styles.thanksText]}>
          ¡Gracias por tu apoyo que nos ayuda a crecer!
        </Text>

        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => router.push("/(tabs)/Apoyanos" as any)}
        >
          <Text style={styles.joinButtonText}>¡Únete!</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    padding: 20,
    marginTop: 20,
  },
  title: {
    textAlign: "center",
    marginTop: 0,
    marginBottom: 20,
  },
  logosRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  logoWide: {
    width: 150,
    height: 60,
  },
  uamBox: {
    backgroundColor: "#3E9BA6",
    borderRadius: 16,
    width: 120,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  logoUam: {
    width: 90,
    height: 50,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  thanksText: {
    flex: 1,
    minWidth: 0,
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  joinButtonText: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 14,
    color: colors.text,
  },
});