import { colors } from "@/styles/global";
import { StyleSheet, View, ViewStyle } from "react-native";

export default function ButtonCenterCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
  },
});