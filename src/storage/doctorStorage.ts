// storage/doctorStorage.ts
//
// Doctores guardados en el teléfono (sync/store.ts). Las pantallas cambian datos a
// través de services/doctorService.ts, que también los sincroniza.

import { getDoctorsLocal, LocalDoctor } from "@/sync/store";

export type DoctorProfile = {
  id: string;
  name: string;
  professionalism: string;
  phonenumber: string;
  details: string;
  createdAt: string;
};

export type DoctorPayload = Omit<DoctorProfile, "id" | "createdAt">;

export const toDoctorProfile = ({ serverId: _serverId, ...doctor }: LocalDoctor): DoctorProfile => doctor;

export const getDoctors = async (): Promise<DoctorProfile[]> =>
  (await getDoctorsLocal()).map(toDoctorProfile);

export const getDoctorById = async (id: string): Promise<DoctorProfile | undefined> =>
  (await getDoctors()).find((doctor) => doctor.id === id);
