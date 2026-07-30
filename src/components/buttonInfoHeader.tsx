// components/buttonInfoHeader.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import SpeakableText from "@/components/SpeakableText";
import { colors, globalStyles } from "@/styles/global";

type Props = {
  title: string;
  searchValue: string;
  onSearchChange: (text: string) => void;
  searchPlaceholder?: string;
};

export default function ButtonInfoHeader({
  title,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar",
}: Props) {
  return (
    <View style={globalStyles.pinkHeader}>
      <TouchableOpacity style={globalStyles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <SpeakableText text={title} style={globalStyles.pinkHeaderTitle} iconSize={20} />

      <View style={styles.searchBar}>
        <TextInput
          value={searchValue}
          onChangeText={onSearchChange}
          placeholder={searchPlaceholder}
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
        <Ionicons name="search" size={20} color="#999" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
  },
  searchInput: {
    flex: 1,
    fontFamily: "LeagueSpartan_400Regular",
    fontSize: 16,
    color: colors.textSecondary,
  },
});