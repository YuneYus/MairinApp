// app/(tabs)/perfil/index.tsx

import { colors, globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getAccountType } from "@/storage/accountTypeStorage";
import { getProfileInfo } from "@/storage/profilenameStorage";
import { getProfilePhoto } from "@/storage/profileStorage";

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
    label: "Cambiar Mi Etapa De Salud",
    icon: "heart-outline",
    route: "/(tabs)/perfil/health-stage",
  },
] as const;

export default function PerfilScreen() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [isGuest, setIsGuest] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const uri = await getProfilePhoto();
        setPhotoUri(uri);

        const info = await getProfileInfo();
        const name = `${info.firstName} ${info.lastName}`.trim();
        setFullName(name || "Usuaria");

        const accountType = await getAccountType();
        setIsGuest(accountType === "guest");
      };
      load();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: () => {
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={globalStyles.pinkHeaderTitle}>Mi Perfil</Text>

        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={40} color={colors.text} />
          </View>
        )}

        <Text style={styles.name}>{fullName}</Text>
      </View>

      {isGuest && (
        <TouchableOpacity
          style={styles.upgradeBanner}
          onPress={() => router.push("/(auth)/crear-cuenta-desde-invitado" as any)}
        >
          <Text style={styles.upgradeBannerText}>
            Estás usando Mairin como invitado. Toca aquí para crear tu cuenta y
            no perder tu información.
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView
        style={globalStyles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.row}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon as any} size={20} color={colors.text} />
            </View>

            <Text style={styles.rowLabel}>{item.label}</Text>

            <Ionicons name="chevron-forward" size={20} color="#C9B7D6" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.row} onPress={handleLogout}>
          <View style={styles.iconCircle}>
            <Ionicons name="log-out-outline" size={20} color={colors.text} />
          </View>

          <Text style={styles.rowLabel}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
    marginTop: 16,
  },

  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.inputBackground,
  },

  name: {
    fontFamily: "LeagueSpartan_700Bold",
    fontSize: 22,
    color: colors.textSecondary,
    marginTop: 14,
  },

  upgradeBanner: {
    backgroundColor: colors.surface,
    marginHorizontal: 24,
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
  },
  upgradeBannerText: {
    fontFamily: "LeagueSpartan_700Bold",
    color: colors.text,
    fontSize: 13,
    textAlign: "center",
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
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  rowLabel: {
    flex: 1,
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    color: colors.textSecondary,
  },
});