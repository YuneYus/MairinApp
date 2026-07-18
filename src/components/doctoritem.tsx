import {
  StyleSheet,
  Text,
  View,
} from "react-native";


type DoctorItemProps = {

  id: string;

  name: string;

  professionalism: string;

  phonenumber: string;

  details: string;

};


export default function DoctorItem({

  name,

  professionalism,

  phonenumber,

  details,

}: DoctorItemProps) {


  return (

    <View style={styles.card}>

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


        {details ? (

          <Text style={styles.details}>
            {details}
          </Text>

        ) : null}

      </View>

    </View>

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