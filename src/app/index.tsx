


/*import { Redirect } from "expo-router";

export default function Index() {

  return <Redirect href="/(tabs)" />;
  
}
*/


import { getOnboardingComplete } from "@/storage/onboardingStorage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [checking, setChecking] = useState(true);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    const check = async () => {
      const complete = await getOnboardingComplete();
      setOnboarded(complete);
      setChecking(false);
    };
    check();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#B0195B" />
      </View>
    );
  }

  return <Redirect href={onboarded ? "/(tabs)" : "/(auth)/login"} />;
}