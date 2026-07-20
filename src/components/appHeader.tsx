import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ScreenHeaderProps = {
  title: string;
};

export default function ScreenHeader({
  title,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons
          name="chevron-back"
          size={24}
          color="#B0195B"
        />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#F6C6D6",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",

    paddingTop: 40,
    paddingBottom: 30,

    marginBottom: 25,
  },

  backButton: {
    position: "absolute",
    left: 20,
    top: 60,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#B0195B",
  },
});