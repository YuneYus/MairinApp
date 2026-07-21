// app/(tabs)/perfil/settings.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Eliminar Cuenta",
      "¿Estás seguro? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            // TODO: hook up real account deletion
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Ajustes</Text>
      </View>


      <View style={styles.list}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push("/(tabs)/perfil/audio" as any)}
        >
          <Ionicons name="globe-outline" size={20} color="#B0195B" />
          <Text style={styles.rowLabel}>Cambiar Idioma De Audio</Text>
          <Ionicons name="chevron-forward" size={18} color="#C9B7D6" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            router.push("/(tabs)/perfil/change-password" as any)
          }
        >
          <Ionicons name="key-outline" size={20} color="#B0195B" />
          <Text style={styles.rowLabel}>Cambiar Contraseña</Text>
          <Ionicons name="chevron-forward" size={18} color="#C9B7D6" />
        </TouchableOpacity>

        <View style={styles.row}>
          <Ionicons name="bulb-outline" size={20} color="#B0195B" />
          <Text style={styles.rowLabel}>Permitir Notificaciones</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#F6D9E4", true: "#B0195B" }}
            thumbColor="white"
          />
        </View>

        <TouchableOpacity style={styles.row} onPress={handleDeleteAccount}>
          <Ionicons name="person-outline" size={20} color="#B0195B" />
          <Text style={styles.rowLabel}>Eliminar Cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  header: {
    backgroundColor: "#F6C6D6",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },

  list: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 18,
  },

  rowLabel: {
    flex: 1,
    fontSize: 15,
    color: "#222",
  },
});