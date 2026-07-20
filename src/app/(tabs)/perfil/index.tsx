// app/(tabs)/perfil/index.tsx

import { colors } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MENU_ITEMS = [
  {
    label: "Perfil",
    icon: "person-outline",
    route: "/(tabs)/perfil/personal",
  },
  {
    label: "Mi Información Médica",
    icon: "document-text-outline",
    route: "/(tabs)/perfil/medical",
  },
  {
    label: "Ajustes",
    icon: "settings-outline",
    route: "/(tabs)/perfil/settings",
  },
  {
    label: "Asistencia",
    icon: "help-circle-outline",
    route: "/(tabs)/perfil/support",
  },
  {
    label: "Cambiar Idioma De Audio",
    icon: "globe-outline",
    route: "/(tabs)/perfil/audio",
  },
] as const;

export default function PerfilScreen() {
  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: () => {
          // TODO: hook up your actual sign-out logic here
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>

        <Image
          source={{
            uri: "https://placehold.co/200x200/png",
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>Lily Hernandez</Text>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.row}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.iconCircle}>
              <Ionicons
                name={item.icon as any}
                size={20}
                color={colors.primary ?? "#B0195B"}
              />
            </View>

            <Text style={styles.rowLabel}>{item.label}</Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#C9B7D6"
            />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.row} onPress={handleLogout}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color={colors.primary ?? "#B0195B"}
            />
          </View>

          <Text style={styles.rowLabel}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
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

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#B0195B",
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginTop: 14,
  },

  list: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FBDCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
});