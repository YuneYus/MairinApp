

import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text } from "react-native";

type QuoteCardProps = {
  quote: string;
};

export default function QuoteCard({
  quote,
}: QuoteCardProps) {
  return (
  <LinearGradient
  colors={[
    "#FFE6F0",
    "#ffcce1",
    "#ffa8cc",
  ]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.card}
>
      <Text style={styles.title}>
        Un recordatorio amable
      </Text>

      <Text style={styles.quote}>
        "{quote}"
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
  borderRadius: 25,
  padding: 22,
  marginTop: 20,

  shadowColor: "#B0195B",
  shadowOpacity: 0.15,
  shadowRadius: 10,
  shadowOffset: {
    width: 0,
    height: 5,
  },

  elevation: 6,
},

  title: {
  fontSize: 21,
  fontWeight: "bold",
  color: "#9E2A62",
  marginBottom: 12,
},

quote: {
  fontSize: 18,
  lineHeight: 28,
  color: "#5E3551",
  fontStyle: "italic",
},
});