

// components/PregnancySizeCard.tsx
//
// Drop this into app/(tabs)/index.tsx, e.g.:
//
//   import { PregnancySizeCard } from "@/components/PregnancySizeCard";
//   ...
//   <PregnancySizeCard />
//
// It reads the saved health stage every time the tab gains focus, and
// renders nothing unless the stage is "embarazo".

import { getHealthStage } from "@/storage/healthStageStorage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PINK_DARK = "#B0195B";
const PINK_LIGHT = "#F6C6D6";

export function PregnancySizeCard() {
  const [visible, setVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const check = async () => {
        const stage = await getHealthStage();
        setVisible(stage === "embarazo");
      };
      check();
    }, [])
  );

  if (!visible) return null;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Tamaño De Tu Bebé</Text>
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/tamano-bebe")}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="baby-face-outline" size={44} color={PINK_DARK} />
        <Text style={styles.cardText}>Quiero ver cómo está{"\n"}creciendo mi bebé</Text>
        <Ionicons name="chevron-forward" size={22} color={PINK_DARK} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: PINK_DARK,
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FDF1F5",
    borderWidth: 1.5,
    borderColor: PINK_LIGHT,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  cardText: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: 21,
  },
});
