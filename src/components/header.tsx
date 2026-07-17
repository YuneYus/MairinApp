import { StyleSheet, Text, View } from 'react-native';
import { colors, globalStyles } from "../../styles/global";

export default function HomeHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={globalStyles.header}>
      <Text style={styles.date}>{currentDate}</Text>
      <Text>Hi There</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle:"italic",
    marginTop: 4,
    marginBottom: 30,
  },
});