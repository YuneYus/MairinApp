// app/(tabs)/perfil/personal.tsx

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

import { getProfilePhoto, setProfilePhoto } from "@/storage/profileStorage";
import {
  getProfileInfo,
  saveProfileInfo,
} from "@/storage/profilenameStorage";
import { colors, globalStyles } from "@/styles/global";

export default function PersonalScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const uri = await getProfilePhoto();
        setPhotoUri(uri);

        const info = await getProfileInfo();
        setFirstName(info.firstName);
        setLastName(info.lastName);
        setPhone(info.phone);
        setEmail(info.email);
        setBirthDate(info.birthDate);
      };
      load();
    }, [])
  );

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

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

  const handleUpdate = async () => {
    await saveProfileInfo({ firstName, lastName, phone, email, birthDate });
    Alert.alert("Éxito", "Perfil actualizado correctamente");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={globalStyles.pinkHeaderTitle}>Perfil</Text>

        <View style={styles.avatarWrapper}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={40} color={colors.text} />
            </View>
          )}

          <TouchableOpacity style={styles.editBadge} onPress={handlePickPhoto}>
            <Ionicons name="pencil" size={12} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={globalStyles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={globalStyles.label}>Nombre</Text>
        <TextInput
          style={globalStyles.formInput}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Ejemplo: Lily"
          placeholderTextColor={colors.text}
        />

        <Text style={globalStyles.label}>Apellido</Text>
        <TextInput
          style={globalStyles.formInput}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Ejemplo: Hernandez"
          placeholderTextColor={colors.text}
        />

        <Text style={globalStyles.label}>Número De Telefono</Text>
        <TextInput
          style={globalStyles.formInput}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={globalStyles.label}>Email</Text>
        <TextInput
          style={globalStyles.formInput}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={globalStyles.label}>Fecha De Nacimiento</Text>
        <TextInput
          style={globalStyles.formInput}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="DD / MM / YYYY"
          placeholderTextColor={colors.text}
        />

        <TouchableOpacity style={globalStyles.actionButton} onPress={handleUpdate}>
          <Text style={globalStyles.actionButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },

  backButton: { position: "absolute", top: 60, left: 20 },

  avatarWrapper: { position: "relative", marginTop: 16 },

  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#ddd" },

  avatarPlaceholder: { alignItems: "center", justifyContent: "center" },

  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
});