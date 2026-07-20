
// components/buttonInfo.tsx

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
        <Ionicons name={icon} size={size === "big" ? 22 : 18} color="#B0195B" />
      </View>

      <Text style={size === "big" ? styles.bigTitle : styles.smallTitle}>
        {title}
      </Text>

      <View style={styles.linkRow}>
        <Text style={styles.link} numberOfLines={1}>
          {subtitle}
        </Text>
        <Ionicons name="chevron-forward" size={14} color="#B0195B" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bigCard: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F0DCE4",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },

  smallCard: {
    flexBasis: "48%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F0DCE4",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },

  iconCircleBig: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FBDCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  iconCircleSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FBDCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  bigTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
  },

  smallTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
  },

  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  link: {
    fontSize: 12,
    color: "#B0195B",
    textDecorationLine: "underline",
    flexShrink: 1,
  },
});