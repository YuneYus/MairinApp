import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function PerfilScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/perfil/personal")}
      >
        <Text>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/perfil/medical")}
      >
        <Text>Mi Información Médica</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/perfil/settings")}
      >
        <Text>Ajustes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/perfil/support")}
      >
        <Text>Asistencia</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/perfil/audio")}
      >
        <Text>Cambiar Idioma</Text>
      </TouchableOpacity>

    </View>
  );
}