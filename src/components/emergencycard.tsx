import { globalStyles } from "@/styles/global";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface IconBadgeProps {
  name: React.ComponentProps<typeof FontAwesome5>['name'];
  style?: ViewStyle;
}

function IconBadge({ name, style }: IconBadgeProps) {
  return (
    <View style={[styles.badge, style]}>
      <FontAwesome5 name={name} size={28} color="#B23A6B" />
    </View>
  );
}
export default function EmergencyCard() {
  return (


    <View style={styles.grid}>
      
     <View style={styles.card}>
        <View style={styles.iconRow}>
          <IconBadge name="phone-volume" />
          <IconBadge name="hands-helping" style={{ marginLeft: -12 }} />
        </View>
        <Text style={styles.value}>Cruz Blanca</Text>
        <Text style={styles.goal}>128</Text>
        <Text>Llamar  ›</Text>
      </View>


    <View style={[styles.card]}>
      <View style={{flexDirection:"row"}}>
        <FontAwesome5
              name="plus-square"
              size= {30}
              color={"red"}
            />
            <FontAwesome5
              name="briefcase-medical"
              size= {30}
              color={"red"}
            />
          </View>
      <Text style={styles.value}>value</Text>
      <Text style={styles.goal}>goal</Text>
    </View>

      <View style={[styles.card]}>
        <View style={{flexDirection:"row"}}>
        <FontAwesome5
              name="hand-holding-medical"
              size= {30}
              color={"red"}
            />
            <FontAwesome5
              name="hand-holding-heart"
              size= {30}
              color={"red"}
            />
            <FontAwesome5
              name="plus-circle"
              size= {30}
              color={"red"}
            />
            <FontAwesome5
              name="plus"
              size= {30}
              color={"red"}
            />
            <FontAwesome5
              name="first-aid"
              size= {30}
              color={"red"}
            />
            <FontAwesome5
              name="volume-up"
              size= {30}
              color={"red"}
            />
          </View>
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
    fontFamily:globalStyles.title.fontFamily
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
    paddingTop:50,
  },
   badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#B23A6B',
    backgroundColor: '#F7DDE6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap:15,
  },
 
});