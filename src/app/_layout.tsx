// app/_layout.tsx

import {
  LeagueSpartan_400Regular,
  LeagueSpartan_700Bold,
  useFonts,
} from "@expo-google-fonts/league-spartan";

import {
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

import {
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";

import { useEffect } from "react";

import { Stack } from "expo-router";

import {
  requestPermissions,
  schedulePeriodReminder,
  scheduleQuoteReminders,
} from "@/utils/notifications";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    LeagueSpartan_400Regular,
    LeagueSpartan_700Bold,
    Montserrat_400Regular,
    Montserrat_700Bold,
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}