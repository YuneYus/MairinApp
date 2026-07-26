// app/(tabs)/perfil/settings.tsx

import SpeakableText from "@/components/SpeakableText";
import { useLanguage } from "@/contexts/LanguageContext";
import { colors, globalStyles } from "@/styles/global"; // adjust path if needed
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
  const { t } = useLanguage();
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
      <View style={globalStyles.pinkHeader}>
        <TouchableOpacity
          style={globalStyles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={globalStyles.pinkHeaderTitle}>{t("menuAjustes")}</Text>
      </View>

      <View style={globalStyles.content}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push("/(tabs)/perfil/textTranslate" as any)}
        >
          <Ionicons name="globe-outline" size={20} color={colors.text} />
          <SpeakableText
            text={t("cambiarIdiomaTexto")}
            style={[globalStyles.textNormal, styles.rowLabel]}
          />
          <Ionicons name="chevron-forward" size={18} color={colors.surface} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push("/(tabs)/perfil/audio" as any)}
        >
          <Ionicons name="globe-outline" size={20} color={colors.text} />
          <SpeakableText
            text={t("cambiarIdiomaAudio")}
            style={[globalStyles.textNormal, styles.rowLabel]}
          />
          <Ionicons name="chevron-forward" size={18} color={colors.surface} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            router.push("/(tabs)/perfil/change-password" as any)
          }
        >
          <Ionicons name="key-outline" size={20} color={colors.text} />
          <SpeakableText
            text={t("cambiarContrasena")}
            style={[globalStyles.textNormal, styles.rowLabel]}
          />
          <Ionicons name="chevron-forward" size={18} color={colors.surface} />
        </TouchableOpacity>

        <View style={styles.row}>
          <Ionicons name="bulb-outline" size={20} color={colors.text} />
          <SpeakableText
            text={t("PermitirNotificacion")}
            style={[globalStyles.textNormal, styles.rowLabel]}
          />
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.inputBackground, true: colors.text }}
            thumbColor="white"
          />
        </View>

        <TouchableOpacity style={styles.row} onPress={handleDeleteAccount}>
          <Ionicons name="person-outline" size={20} color={colors.text} />
          <SpeakableText
            text={t("EliminarCuenta")}
            style={[globalStyles.textNormal, styles.rowLabel]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 18,
  },

  rowLabel: {
    flex: 1,
  },
});