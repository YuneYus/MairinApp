// components/buttonInfo.tsx

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import SpeakableText from "@/components/SpeakableText";
import { colors } from "@/styles/global";

type ButtonInfoProps = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  size?: "big" | "small";
  onPress?: () => void;
};

export default function ButtonInfo({
  title,
  subtitle,
  icon,
  size = "small",
  onPress,
}: ButtonInfoProps) {
  return (
    <TouchableOpacity
      style={size === "big" ? styles.bigCard : styles.smallCard}
      onPress={onPress}
    >
      <View
        style={size === "big" ? styles.iconCircleBig : styles.iconCircleSmall}
      >
        <Ionicons name={icon} size={size === "big" ? 22 : 18} color={colors.text} />
      </View>

      <SpeakableText
        text={title}
        style={size === "big" ? styles.bigTitle : styles.smallTitle}
        iconSize={size === "big" ? 15 : 13}
      />

      <View style={styles.linkRow}>
        <Text style={styles.link} numberOfLines={1}>
          {subtitle}
        </Text>
        <Ionicons name="chevron-forward" size={14} color={colors.text} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bigCard: {
    width: "100%",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },

  smallCard: {
    flexBasis: "48%",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },

  iconCircleBig: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  iconCircleSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  bigTitle: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 17,
    color: colors.textSecondary,
    marginBottom: 6,
  },

  smallTitle: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },

  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  link: {
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 12,
    color: colors.text,
    textDecorationLine: "underline",
    flexShrink: 1,
  },
});