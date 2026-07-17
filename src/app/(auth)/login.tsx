import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function LoginScreen() {
  function handleGoogleLogin() {
    console.log("Google pressed");

  router.push("/(auth)/phone-login");
  }

  function handlePhoneLogin() {
    console.log("Phone pressed");

    router.push("/(auth)/phone-login");
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        Login Screen
      </Text>

      {/* Google Login Button */}
    <Pressable
  onPress={() => {
    console.log("Google pressed");
    router.replace("/(tabs)/calendar");
  }}
>
  <Text>Login with Google</Text>
</Pressable>

      {/* Phone Login Button */}
      <Pressable
        onPress={handlePhoneLogin}
        style={{
          padding: 15,
          backgroundColor: "#222",
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white" }}>
          Login with Phone
        </Text>
      </Pressable>
    </View>
  );
}