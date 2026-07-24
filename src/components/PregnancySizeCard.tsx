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

import { colors, globalStyles } from "@/styles/global";

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
      <Text style={[globalStyles.titleBig, {textAlign: "left"}]}>Tamaño De Tu Bebé</Text>
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/tamano-bebe")}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="baby-face-outline" size={44} color={colors.text} />
        <Text style={[globalStyles.label, styles.cardText]}>
          Quiero ver cómo está{"\n"}creciendo mi bebé
        </Text>
        <Ionicons name="chevron-forward" size={22} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
    marginBottom: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  cardText: {
    flex: 1,
    minWidth: 0,
    textAlign: "center",
    marginTop: 0,
    marginBottom: 0,
  },
});