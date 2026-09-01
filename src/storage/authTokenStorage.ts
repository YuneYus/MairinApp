
// src/storage/authTokenStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export async function saveTokens(access: string, refresh: string) {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access);
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export async function saveAccessToken(access: string) {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access);
}

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function clearTokens() {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
}