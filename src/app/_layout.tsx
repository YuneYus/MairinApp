// app/_layout.tsx

import {
  LeagueSpartan_400Regular,
  LeagueSpartan_700Bold,
  useFonts,
} from "@expo-google-fonts/league-spartan";

import { useEffect } from "react";

import { Stack } from "expo-router";

import { LanguageProvider } from "@/contexts/LanguageContext";

import {
  requestPermissions,
  schedulePeriodReminder,
  scheduleQuoteReminders,
} from "@/utils/notifications";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    LeagueSpartan_400Regular,
    LeagueSpartan_700Bold,
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
  <LanguageProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  </LanguageProvider>
);
}