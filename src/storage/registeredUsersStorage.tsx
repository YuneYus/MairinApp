// storage/registeredUsersStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "registered_users";

export type RegisteredUser = {
  email: string;
  firstName: string;
  lastName: string;
  password: string; // ⚠️ stored in plaintext locally — not secure, demo only
  createdAt: string; // ISO date string
};

export async function getRegisteredUsers(): Promise<RegisteredUser[]> {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export async function addRegisteredUser(
  user: Omit<RegisteredUser, "createdAt">
): Promise<void> {
  const users = await getRegisteredUsers();

  // Avoid duplicate entries for the same email
  const filtered = users.filter(
    (u) => u.email.toLowerCase() !== user.email.toLowerCase()
  );

  filtered.push({ ...user, createdAt: new Date().toISOString() });

  await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
}

export async function findRegisteredUser(
  email: string
): Promise<RegisteredUser | null> {
  const users = await getRegisteredUsers();
  return (
    users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
  );
}