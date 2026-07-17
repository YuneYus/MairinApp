import { auth } from "@/services/firebase";
import { router } from "expo-router";
import { signInWithPhoneNumber } from "firebase/auth";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";


export default function PhoneLoginScreen() {

  const [phone, setPhone] = useState("");


  async function handleContinue() {

    try {

      const confirmation = await signInWithPhoneNumber(
        auth,
        phone
      );


      router.push({
        pathname: "/(auth)/verify-code",
        params: {
          verificationId: confirmation.verificationId,
        },
      });


    } catch(error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Could not send code"
      );

    }

  }


  return (
    <View
      style={{
        flex:1,
        justifyContent:"center",
        padding:25,
      }}
    >

      <Text>
        Enter your phone number
      </Text>


      <TextInput
        placeholder="+50588888888"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />


      <Button
        title="Continue"
        onPress={handleContinue}
      />

    </View>
  );
}