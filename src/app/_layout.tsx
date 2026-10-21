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
import { requestSync, startSync, syncNow } from "@/sync/engine";
import { migrateLegacyData } from "@/sync/migrate";
import { isSignedIn } from "@/sync/session";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    LeagueSpartan_400Regular,
    LeagueSpartan_700Bold,
  });

  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    // Primero se pasan los datos antiguos al formato por cuenta; las pantallas esperan a que termine.
    void startSync(migrateLegacyData);
  }, []);

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
    // Al recuperar la conexión se suben los cambios pendientes y se descargan los nuevos.
    return NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) {
        void isSignedIn().then((signedIn) => {
          if (signedIn) void syncNow().catch((error) => console.warn("Sync falló", error));
          else requestSync();
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