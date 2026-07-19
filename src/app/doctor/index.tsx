import { globalStyles } from "@/styles/global";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import DoctorItem from "@/components/doctoritem";

import {
  DoctorProfile,
  getDoctors,
} from "../../storage/doctorStorage";


export default function DoctorsScreen() {

  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);

  const [searchText, setSearchText] = useState("");


  // Load doctors from AsyncStorage
  const loadDoctors = async () => {

    const data = await getDoctors();

    setDoctors(data);

  };


  // Reload doctors every time we return to this screen
  useFocusEffect(

    useCallback(() => {

      loadDoctors();

    }, [])

  );


  // Search doctors by name
const filteredDoctors = doctors.filter((doctor) => {
  const search = searchText.toLowerCase();

  return (
    doctor.name.toLowerCase().includes(search) ||
    doctor.professionalism.toLowerCase().includes(search) ||
    doctor.phonenumber.toLowerCase().includes(search)
  );
});

  return (

    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.content}
    >

      {/* TITLE */}

      <Text style={globalStyles.title}>
        Mis Listas De Doctores
      </Text>


      {/* SEARCH BAR */}

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar doctor..."
        placeholderTextColor="#B0195B"
        value={searchText}
        onChangeText={setSearchText}
      />


      {/* ADD DOCTOR BUTTON */}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/doctor/adddoctors")}
      >

        <Text style={styles.addButtonText}>
          + Agregar Mis Doctores
        </Text>

      </TouchableOpacity>


      {/* DOCTORS LIST */}

      <View style={styles.doctorsContainer}>

        {filteredDoctors.length === 0 ? (

          <Text style={globalStyles.empty}>
            No hay doctores guardados.
          </Text>

        ) : (

          filteredDoctors.map((doctor) => (

            <DoctorItem
              key={doctor.id}

              id={doctor.id}

              name={doctor.name}

              professionalism={
                doctor.professionalism
              }

              phonenumber={
                doctor.phonenumber
              }

            />

          ))

        )}

      </View>

    </ScrollView>

  );

}


const styles = StyleSheet.create({

  content: {
    padding: 20,
  },


  searchInput: {
    backgroundColor: "#FDE8EF",

    borderRadius: 15,

    padding: 15,

    fontSize: 16,

    marginTop: 20,

  },


  addButton: {
    backgroundColor: "#B0195B",

    padding: 16,

    borderRadius: 30,

    alignItems: "center",

    marginTop: 20,

  },


  addButtonText: {
    color: "white",

    fontSize: 17,

    fontWeight: "bold",

  },


  doctorsContainer: {
    marginTop: 25,

  },

});