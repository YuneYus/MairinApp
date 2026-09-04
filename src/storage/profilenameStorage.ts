

// storage/profileInfoStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "profile_info";

export type ProfileInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
};

const DEFAULT_PROFILE: ProfileInfo = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  birthDate: "",
};

export async function getProfileInfo(): Promise<ProfileInfo> {
  const data = await AsyncStorage.getItem(KEY);
  if (!data) return DEFAULT_PROFILE;
  return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
}

export async function saveProfileInfo(info: ProfileInfo): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(info));
}