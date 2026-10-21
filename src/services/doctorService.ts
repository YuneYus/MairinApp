// services/doctorService.ts
//
// Cada cambio se guarda primero en el teléfono y se sube con el motor de sincronización
// (sync/engine.ts). `synced` indica si ya llegó al servidor; si no, se subirá solo
// cuando haya conexión.

import { DoctorPayload, DoctorProfile, getDoctorById, getDoctors, toDoctorProfile } from "@/storage/doctorStorage";
import { flush, syncDoctors } from "@/sync/engine";
import { enqueue } from "@/sync/queue";
import { isSignedIn } from "@/sync/session";
import { getDoctorsLocal, newId, saveDoctorsLocal } from "@/sync/store";

type DoctorSaveResult = {
  doctor: DoctorProfile;
  synced: boolean;
};

async function uploaded(): Promise<boolean> {
  return (await isSignedIn()) && (await flush());
}

export async function syncPendingDoctorChanges(): Promise<boolean> {
  return uploaded();
}

export async function fetchDoctors(): Promise<DoctorProfile[]> {
  await syncDoctors().catch(() => false);
  return getDoctors();
}

export async function fetchDoctorById(id: string): Promise<DoctorProfile> {
  const doctor = await getDoctorById(id);
  if (!doctor) {
    throw new Error("No se encontró el doctor guardado en este dispositivo.");
  }
  return doctor;
}

export async function createDoctor(payload: DoctorPayload): Promise<DoctorSaveResult> {
  const doctor = { ...payload, id: newId(), createdAt: new Date().toISOString() };
  await saveDoctorsLocal([doctor, ...(await getDoctorsLocal())]);
  await enqueue({ kind: "doctor", localId: doctor.id });
  return { doctor, synced: await uploaded() };
}

export async function updateDoctorRemote(id: string, payload: DoctorPayload): Promise<DoctorSaveResult> {
  const doctors = await getDoctorsLocal();
  const current = doctors.find((d) => d.id === id);
  if (!current) {
    throw new Error("No se encontró el doctor guardado en este dispositivo.");
  }
  const updated = { ...current, ...payload };
  await saveDoctorsLocal(doctors.map((d) => (d.id === id ? updated : d)));
  await enqueue({ kind: "doctor", localId: id, serverId: current.serverId });
  return { doctor: toDoctorProfile(updated), synced: await uploaded() };
}

export async function deleteDoctorForSync(id: string): Promise<boolean> {
  const doctors = await getDoctorsLocal();
  const current = doctors.find((d) => d.id === id);
  await saveDoctorsLocal(doctors.filter((d) => d.id !== id));
  await enqueue({ kind: "doctor", localId: id, serverId: current?.serverId });
  return uploaded();
}
