import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from 'react-native';

export default function EmergencyCard() {
  return (


    <View style={styles.grid}>
    <View style={[styles.card]}>
        <Ionicons
              name="home"
              size= {12}
              color={"pink"}
            />
      <Text style={styles.value}>Cruz Blanca</Text>
      <Text style={styles.goal}>numero</Text>
      <Text style={styles.goal}>Llamar and icon</Text>
    </View>


    <View style={[styles.card]}>
      <Text style={styles.label}>label</Text>
      <Text style={styles.value}>value</Text>
      <Text style={styles.goal}>goal</Text>
    </View>

      <View style={[styles.card]}>
      <Text style={styles.label}>label</Text>
      <Text style={styles.value}>value</Text>
      <Text style={styles.goal}>goal</Text>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFF',
    borderRadius: 20,
    padding: 16,
    width: '47%',
    borderWidth: 1,
    borderColor: "grey"
  },
  label: {
    fontSize: 14,
    color: '#020202',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#020202',
    marginTop: 4,
  },
  goal: {
    fontSize: 14,
    color: '#020202',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});