import { getConfirmation } from "@/services/phoneAuth";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";


export default function VerifyCodeScreen() {

  const [code, setCode] = useState("");


  async function handleVerify() {

    try {

      const confirmation = getConfirmation();


      if (!confirmation) {
        Alert.alert("No verification found");
        return;
      }


      await confirmation.confirm(code);


      router.replace("/(tabs)");


    } catch(error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Wrong verification code"
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

      <Text
        style={{
          fontSize:25,
          fontWeight:"bold",
        }}
      >
        Enter verification code
      </Text>


      <TextInput
        placeholder="123456"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        style={{
          borderWidth:1,
          padding:15,
          marginVertical:20,
        }}
      />


      <Button
        title="Verify"
        onPress={handleVerify}
      />

    </View>
  );
}