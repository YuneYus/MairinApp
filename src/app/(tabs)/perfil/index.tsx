// app/(tabs)/perfil/index.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { speakIfEnabled } from "@/hooks/useSpeak";
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
import { clearTokens } from "@/storage/authTokenStorage";

export default function PerfilScreen() {
  const { t, language } = useLanguage();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [isGuest, setIsGuest] = useState(false);

  const showSpeakerIcons = language === "es";

  const MENU_ITEMS = [
    { labelKey: "menuPerfil" as const, icon: "person-outline", route: "/(tabs)/perfil/personal" },
    { labelKey: "menuInfoMedica" as const, icon: "document-text-outline", route: "/(tabs)/perfil/medical" },
    { labelKey: "menuAjustes" as const, icon: "settings-outline", route: "/(tabs)/perfil/settings" },
    { labelKey: "quienesSomosTitulo" as const, icon: "help-circle-outline", route: "/(tabs)/perfil/aboutUs" },
    { labelKey: "menuAsistencia" as const, icon: "help-circle-outline", route: "/(tabs)/perfil/support" },
    { labelKey: "menuEtapaSalud" as const, icon: "heart-outline", route: "/(tabs)/perfil/health-stage" },
  ];

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const uri = await getProfilePhoto();
        setPhotoUri(uri);

        const info = await getProfileInfo();
        const name = `${info.firstName} ${info.lastName}`.trim();
        setFullName(name || "usuaria");

        const accountType = await getAccountType();
        setIsGuest(accountType === "guest");
      };
      load();
    }, [t])
  );

const handleLogout = async () => {
  console.log("CERRANDO SESIÓN...");

  try {
    await clearTokens();

    console.log("TOKENS ELIMINADOS");

    router.replace("/(auth)/login");

    console.log("REDIRIGIDO AL LOGIN");
  } catch (error) {
    console.error("ERROR AL CERRAR SESIÓN:", error);
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.titleRow}
          onPress={() => speakIfEnabled(t("miPerfil"), language)}
          disabled={!showSpeakerIcons}
        >
          <Text style={globalStyles.pinkHeaderTitle}>{t("miPerfil")}</Text>
          {showSpeakerIcons && (
            <Ionicons name="volume-medium" size={20} color={colors.text} style={styles.speakerIcon} />
          )}
        </TouchableOpacity>

        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={40} color={colors.text} />
          </View>
        )}

        <Text style={globalStyles.label}>{fullName}</Text>
      </View>

      {isGuest && (
        <TouchableOpacity
          style={styles.upgradeBanner}
          onPress={() => router.push("/(auth)/crear-cuenta-desde-invitado" as any)}
        >
          <Text style={globalStyles.label}>{t("invitadoBanner")}</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 40 }}>
        {MENU_ITEMS.map((item) => (
          <View key={item.labelKey} style={styles.row}>
            <TouchableOpacity
              style={styles.rowMain}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon as any} size={20} color={colors.primary ?? colors.text} />
              </View>

              <Text style={globalStyles.label}>{t(item.labelKey)}</Text>
            </TouchableOpacity>

            {showSpeakerIcons && (
              <TouchableOpacity onPress={() => speakIfEnabled(t(item.labelKey), language)}>
                <Ionicons name="volume-medium" size={18} color={colors.surface} style={{ marginHorizontal: 8 }} />
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => router.push(item.route as any)}>
              <Ionicons name="chevron-forward" size={20} color={colors.surface} />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.row} onPress={handleLogout}>
          <View style={styles.iconCircle}>
            <Ionicons name="log-out-outline" size={20} color={colors.primary ?? colors.text} />
          </View>

          <Text style={globalStyles.label}>{t("cerrarSesion")}</Text>
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

  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  speakerIcon: { marginLeft: 8 },

  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#ddd" },
  avatarPlaceholder: { alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },

  upgradeBanner: { backgroundColor: colors.surface, marginHorizontal: 24, marginTop: 16, padding: 14, borderRadius: 14 },

  list: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },

  row: { flexDirection: "row", alignItems: "center", paddingVertical: 16 },
  rowMain: { flex: 1, flexDirection: "row", alignItems: "center" },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
});