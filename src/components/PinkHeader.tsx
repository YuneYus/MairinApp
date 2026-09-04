import { colors, globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

export default function PinkHeader({ title, onBack, showBack = true }: Props) {
  return (
    <View style={globalStyles.pinkHeader}>
      {showBack && (
        <TouchableOpacity
          style={globalStyles.backButton}
          onPress={onBack ?? (() => router.back())}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
      )}
      <Text style={globalStyles.pinkHeaderTitle}>{title}</Text>
    </View>
  );
}