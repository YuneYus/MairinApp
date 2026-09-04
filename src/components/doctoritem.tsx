
import { router } from "expo-router";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type DoctorItemProps = {

  id: string;

  name: string;

  professionalism: string;

  phonenumber: string;

};


export default function DoctorItem({

  id,
  name,

  professionalism,

  phonenumber,

}: DoctorItemProps) {


  return (

  <TouchableOpacity
    style={styles.card}
    onPress={() =>
  router.push({
    pathname: "/ayuda/adddoctors",
    params: { id },
  })
}
  >

      <View style={styles.info}>

        <Text style={styles.name}>
          {name}
        </Text>


        <Text style={styles.profession}>
          {professionalism}
        </Text>


        <Text style={styles.phone}>
          {phonenumber}
        </Text>
        

      </View>

    </TouchableOpacity>

  );

}


const styles = StyleSheet.create({

  card: {

    backgroundColor: "#FDE8EF",

    borderRadius: 20,

    padding: 20,

    marginBottom: 15,

  },


  info: {

    gap: 5,

  },


  name: {

    fontSize: 20,

    fontWeight: "bold",

    color: "#B0195B",

  },


  profession: {

    fontSize: 16,

  },


  phone: {

    fontSize: 18,

    color: "#B0195B",

  },


  details: {

    fontSize: 15,

    marginTop: 8,

  },

});