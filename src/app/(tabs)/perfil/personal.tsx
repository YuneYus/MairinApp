// app/(tabs)/perfil/personal.tsx

import { getProfilePhoto, setProfilePhoto } from "@/storage/profileStorage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PersonalScreen() {
  const [name, setName] = useState("Lily Hernandez");
  const [phone, setPhone] = useState("+505 5678 9000");
  const [email, setEmail] = useState("johndoe@example.com");
  const [birthDate, setBirthDate] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadPhoto = async () => {
        const uri = await getProfilePhoto();
        setPhotoUri(uri);
      };
      loadPhoto();
    }, [])
  );

  const handlePickPhoto = async () => {
    console.log("Edit photo button pressed");

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("Permission result:", permission);

    if (!permission.granted) {
      Alert.alert(
        "Permiso necesario",
        "Necesitamos acceso a tus fotos para cambiar tu imagen de perfil."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setPhotoUri(uri);
    await setProfilePhoto(uri);
  };

  const handleUpdate = () => {
    Alert.alert("Éxito", "Perfil actualizado correctamente");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#B0195B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Perfil</Text>

        <View style={styles.avatarWrapper}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={40} color="#B0195B" />
            </View>
          )}

          <TouchableOpacity style={styles.editBadge} onPress={handlePickPhoto}>
            <Ionicons name="pencil" size={12} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Número De Telefono</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Fecha De Nacimiento</Text>
        <TextInput
          style={styles.input}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="DD / MM / YYYY"
          placeholderTextColor="#B0195B"
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  header: {
    backgroundColor: "#F6C6D6",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ddd",
  },

  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },

  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#B0195B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },

  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
    marginTop: 16,
  },

  input: {
    backgroundColor: "#FDE8EF",
    color: "#B0195B",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
  },

  button: {
    backgroundColor: "#F6C6D6",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 36,
  },

  buttonText: {
    color: "#B0195B",
    fontSize: 16,
    fontWeight: "bold",
  },
});