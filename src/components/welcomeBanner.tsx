// components/welcomeBanner.tsx

import { getHealthStage, HealthStage } from "@/storage/healthStageStorage";
import { getProfileInfo } from "@/storage/profilenameStorage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";

import { globalStyles } from "@/styles/global";

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
    <View style={globalStyles.pinkHeader}>
      <Text style={globalStyles.pinkHeaderTitle}>¡Bienvenida {displayName}!</Text>
      <Text style={[globalStyles.textNormal, { marginTop: 10, textAlign: "center" }]}>
        Estas en la pantalla de inicio te invitamos a que {STAGE_MESSAGES[stage]}
      </Text>
    </View>
  );
}