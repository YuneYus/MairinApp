

// storage/profileStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "profile_photo_uri";

export async function getProfilePhoto(): Promise<string | null> {
  return await AsyncStorage.getItem(KEY);
}

export async function setProfilePhoto(uri: string): Promise<void> {
  await AsyncStorage.setItem(KEY, uri);
}