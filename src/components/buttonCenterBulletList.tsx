import { colors, globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function ButtonCenterBulletList({ items }: { items: string[] }) {
  return (
    <View style={{ marginTop: 12 }}>
      {items.map((item, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.chevronCircle}>
            <Ionicons name="chevron-forward" size={14} color={colors.text} />
          </View>
          <Text style={[globalStyles.textNormal, styles.itemText]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 10 },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.inputBackground,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  itemText: { flex: 1, minWidth: 0 },
});