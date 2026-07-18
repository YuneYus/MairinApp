

import EmergencyCard from "@/components/emergencycard";
import { globalStyles } from "@/styles/global";
import { Linking, Pressable, Text, View } from "react-native";

export default function HelpScreen() {
  const handleCall = () => {
    Linking.openURL("tel:911");
  };

  return (
    <View style={globalStyles.container}>
      <Pressable onPress={handleCall}>
        <Text>Call for Help</Text>
      </Pressable>

      <EmergencyCard/>
    </View>




  );
}