// storage/profilenameStorage.ts
//
// Nombre y datos de contacto: parte del perfil (sync/store.ts), se sincroniza.

import { getProfile, updateProfile } from "@/sync/store";

export type ProfileInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
};

export async function getProfileInfo(): Promise<ProfileInfo> {
  const { firstName, lastName, phone, email, birthDate } = await getProfile();
  return { firstName, lastName, phone, email, birthDate };
}

export async function saveProfileInfo(info: ProfileInfo): Promise<void> {
  await updateProfile(info);
}
