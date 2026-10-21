// storage/profileStorage.ts
//
// La foto es una ruta a un archivo de este teléfono: se guarda por cuenta, pero no se sincroniza.

import { getDeviceValue, setDeviceValue } from "@/sync/store";

export async function getProfilePhoto(): Promise<string | null> {
  return getDeviceValue("profile_photo_uri");
}

export async function setProfilePhoto(uri: string): Promise<void> {
  await setDeviceValue("profile_photo_uri", uri);
}
