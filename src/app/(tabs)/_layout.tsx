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
          title: "Inicio",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="home" label="Inicio" />
          ),
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendario",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName="calendar"
              label="Calendario"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="ayuda"
        options={{
          title: "Ayuda",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName="warning-outline"
              label="Ayuda"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Apoyanos"
        options={{
          title: "Apóyanos",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="heart" label="Apóyanos" />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="person" label="Perfil" />
          ),
        }}
      />

      <Tabs.Screen name="leer-mas-ciclo" options={{ href: null }} />
      <Tabs.Screen name="tamano-bebe" options={{ href: null }} />
       <Tabs.Screen name="detalle-semana" options={{ href: null }} />
       <Tabs.Screen name="viaje-embarazo" options={{ href: null }} />
    </Tabs>
  );
}