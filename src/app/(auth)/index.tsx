import { router } from "expo-router";
import { Button, Text, View } from "react-native";


export default function LoginScreen() {

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 25,
      }}
    >

      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          marginBottom: 40,
        }}
      >
        Mairin
      </Text>


      <Button
        title="Continue with Google"
        onPress={() => {
          console.log("Google pressed");
        }}
      />


      <View style={{ height: 20 }} />


      <Button
        title="Continue with Phone Number"
        onPress={() => router.push("/(auth)/phone-login")}
      />


    </View>
  );
}

