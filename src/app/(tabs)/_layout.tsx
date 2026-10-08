// app/(tabs)/_layout.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

const TAB_BAR_COLOR = "#A4195B"; // dark maroon background
const ACTIVE_PILL_COLOR = "#FFFF"; // pink highlight behind active tab
const ACTIVE_COLOR = "#A4195B"; // icon/label color when active
const INACTIVE_COLOR = "#FFFF"; // icon/label color when inactive


function TabIcon({
  focused,
  iconName,
  label,
}: {
  focused: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  const color = focused ? ACTIVE_COLOR : INACTIVE_COLOR;

  return (
    <View
      style={{
        backgroundColor: focused ? ACTIVE_PILL_COLOR : "transparent",
        borderRadius: 16,
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 60,
        height: 60,
      }}
    >
      <Ionicons name={iconName} size={22} color={color} />
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{
          color,
          fontFamily: "LeagueSpartan_700Bold",
          fontSize: 12,
          marginTop: 4,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: TAB_BAR_COLOR,
          borderTopColor: TAB_BAR_COLOR,
          height: 84,
          paddingTop: 12,
          paddingBottom: 12,
        },
        tabBarItemStyle: {
          alignItems: "center",
          justifyContent: "center",
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabInicio"),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="home" label={t("tabInicio")} />
          ),
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: t("tabCalendario"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName="calendar"
              label={t("tabCalendario")}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="ayuda"
        options={{
          title: t("tabAyuda"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName="warning-outline"
              label={t("tabAyuda")}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Apoyanos"
        options={{
          title: t("tabApoyanos"),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="heart" label={t("tabApoyanos")} />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: t("tabPerfil"),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="person" label={t("tabPerfil")} />
          ),
        }}
      />

      <Tabs.Screen name="leer-mas-ciclo" options={{ href: null }} />
      <Tabs.Screen name="tamano-bebe" options={{ href: null }} />
      <Tabs.Screen name="detalle-semana" options={{ href: null }} />
      <Tabs.Screen name="viaje-embarazo" options={{ href: null }} />
      <Tabs.Screen name="BreathingExercise" options={{ href: null }} />
      <Tabs.Screen name="embarazo-alimentacion" options={{ href: null }} />
      <Tabs.Screen name="embarazo-factoresRiesgo" options={{ href: null }} />
      <Tabs.Screen name="embarazo-info" options={{ href: null }} />
      <Tabs.Screen name="embarazo-serMama" options={{ href: null }} />
      <Tabs.Screen name="embarazo-prepParto" options={{ href: null }} />
      <Tabs.Screen name="mens-alimento" options={{ href: null }} />
      <Tabs.Screen name="mens-info" options={{ href: null }} />
      <Tabs.Screen name="mens-ejercicio" options={{ href: null }} />
      <Tabs.Screen name="mens-prevencion" options={{ href: null }} />
      <Tabs.Screen name="mens-recomendacion" options={{ href: null }} />
      <Tabs.Screen name="mens-sabiasq" options={{ href: null }} />
      <Tabs.Screen name="mens-educacion" options={{ href: null }} />
      <Tabs.Screen name="meno-ejercicio" options={{ href: null }} />
      <Tabs.Screen name="meno-menopausia" options={{ href: null }} />
      <Tabs.Screen name="meno-prevencion" options={{ href: null }} />
      <Tabs.Screen name="meno-posmenopausia" options={{ href: null }} />
      <Tabs.Screen name="meno-perimenopausia" options={{ href: null }} />
    </Tabs>
  );
}

