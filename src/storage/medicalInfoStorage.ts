// storage/medicalInfoStorage.ts
//
// Historial médico (sync/store.ts), se sincroniza. Nombre, nacimiento, teléfono y correo
// son del perfil: si el formulario los tiene vacíos, se completan desde ahí.

import { emptyMedicalInfo, getMedical, getProfile, saveMedical } from "@/sync/store";
import type { Cirugia, MedicalInfo } from "@/sync/store";
import { isoToDmy } from "@/utils/dates";

export type { Cirugia, MedicalInfo };
export { emptyMedicalInfo };

export async function getMedicalInfo(): Promise<MedicalInfo> {
  const info = await getMedical();
  const profile = await getProfile();
  return {
    ...info,
    fullName: info.fullName || `${profile.firstName} ${profile.lastName}`.trim(),
    birthDate: info.birthDate || (/^\d{4}-\d{2}-\d{2}$/.test(profile.birthDate) ? isoToDmy(profile.birthDate) : profile.birthDate),
    phone: info.phone || profile.phone,
    email: info.email || profile.email,
  };
}

export async function saveMedicalInfo(info: MedicalInfo): Promise<void> {
  await saveMedical(info);
}
