



// components/welcomeBanner.tsx

import { getHealthStage, HealthStage } from "@/storage/healthStageStorage";
import { getProfileInfo } from "@/storage/profilenameStorage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const STAGE_MESSAGES: Record<HealthStage, string> = {
  menstruacion: "conozcas más sobre tu ciclo menstrual",
  embarazo: "conozcas más sobre tu viaje de embarazo",
  menopausia: "conozcas más sobre tu etapa de menopausia",
};

export default function WelcomeBanner() {
  const [firstName, setFirstName] = useState("");
  const [stage, setStage] = useState<HealthStage>("menstruacion");

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const info = await getProfileInfo();
        setFirstName(info.firstName);

        const currentStage = await getHealthStage();
        setStage(currentStage);
      };
      load();
    }, [])
  );

  const displayName = firstName || "Usuaria";

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>¡Bienvenida {displayName}!</Text>
      <Text style={styles.subtitle}>
        Estas en la pantalla de inicio te invitamos a que {STAGE_MESSAGES[stage]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 10 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8A1F4D",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#222",
    lineHeight: 20,
  },
});