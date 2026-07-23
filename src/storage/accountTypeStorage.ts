


import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "account_type";

export type AccountType = "guest" | "registered";

export async function getAccountType(): Promise<AccountType> {
  const value = await AsyncStorage.getItem(KEY);
  return value === "registered" ? "registered" : "guest";
}

export async function setAccountType(type: AccountType): Promise<void> {
  await AsyncStorage.setItem(KEY, type);
}