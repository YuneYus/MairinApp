import EmergencyCard from "@/components/emergencycard";
import { globalStyles } from "@/styles/global";
import { router } from "expo-router";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HelpScreen() {

  const handleCall = () => {
    Linking.openURL("tel:911");
  };

  return (
    <View style={[globalStyles.container, { paddingTop: 80 }]}>

      <Pressable onPress={handleCall}>
        <Text style={globalStyles.title}>
          Números de Emergencias
        </Text>
      </Pressable>

      <EmergencyCard />

      {/* Doctor List Button */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/doctor")}
      >
        <Text style={styles.buttonText}>
          Mis Listas de Doctores
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  button: {
    marginTop: 30,
    backgroundColor: "#B0195B",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

});