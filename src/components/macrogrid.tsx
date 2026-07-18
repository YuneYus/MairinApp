import { StyleSheet, View } from 'react-native';
import EmergencyCard from './emergencycard';

//import { Meal } from '../storage/calendarStorage';


export default function MacroGrid() {

  return (
    <View style={styles.grid}>
      <EmergencyCard/>
      <EmergencyCard/>
      <EmergencyCard/>
      <EmergencyCard/>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});