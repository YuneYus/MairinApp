// app/_layout.tsx

import {
  LeagueSpartan_400Regular,
  LeagueSpartan_700Bold,
  useFonts,
} from "@expo-google-fonts/league-spartan";

import { useEffect, useState } from "react";

import { Stack } from "expo-router";

import { LanguageProvider } from "@/contexts/LanguageContext";

import AppIntro from "@/components/AppIntro";

import {
  requestPermissions,
  schedulePeriodReminder,
  scheduleQuoteReminders,
} from "@/utils/notifications";
import NetInfo from "@react-native-community/netinfo";
import { syncPendingDoctorChanges } from "@/services/doctorService";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    LeagueSpartan_400Regular,
    LeagueSpartan_700Bold,
  });

  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const setupNotifications = async () => {
      const granted = await requestPermissions();

      console.log("Permission:", granted);

      if (granted) {
        await scheduleQuoteReminders();
        await schedulePeriodReminder();
        console.log("Notifications scheduled!");
      }
    };

    setupNotifications();
  }, []);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) {
        void syncPendingDoctorChanges().catch((error) => {
          console.error("Failed to sync pending doctor changes:", error);
        });
      }
    });
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  if (!introDone) {
    return <AppIntro onFinish={() => setIntroDone(true)} />;
  }

  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </LanguageProvider>
  );
}