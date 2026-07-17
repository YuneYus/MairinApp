import {
  LeagueSpartan_400Regular,
  LeagueSpartan_700Bold,
  useFonts,
} from "@expo-google-fonts/league-spartan";

import { Stack } from "expo-router";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    LeagueSpartan_400Regular,
    LeagueSpartan_700Bold,
  });

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