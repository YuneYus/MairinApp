import { getAccessToken } from "@/storage/authTokenStorage";
import { DoctorProfile } from "@/storage/doctorStorage";
import { apiRequest } from "./apiClient";

export type DoctorCreatePayload = {
  name: string;
  professionalism: string;
  phonenumber: string;
  details: string;
};

type DoctorServerPayload = DoctorCreatePayload & {
  id: number | string;
  created_at?: string;
};

async function getAuthHeaders() {
  const token = (await getAccessToken())?.trim();
  console.log("Doctor service auth token present:", !!token);

  if (!token) {
    throw new Error("No auth token found. Por favor inicia sesión antes de usar esta función.");
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

const mapDoctor = (doctor: DoctorServerPayload): DoctorProfile => ({
  id: String(doctor.id),
  name: doctor.name,
  professionalism: doctor.professionalism,
  phonenumber: doctor.phonenumber,
  details: doctor.details,
  createdAt: doctor.created_at ?? new Date().toISOString(),
});

export async function fetchDoctors(): Promise<DoctorProfile[]> {
  const headers = await getAuthHeaders();
  const data = await apiRequest("/api/doctors/", {
    headers,
  });

  return (data as DoctorServerPayload[]).map(mapDoctor);
}

export async function fetchDoctorById(id: string): Promise<DoctorProfile> {
  const headers = await getAuthHeaders();
  const data = await apiRequest(`/api/doctors/${id}/`, {
    headers,
  });

  return mapDoctor(data as DoctorServerPayload);
}

export async function updateDoctorRemote(
  id: string,
  doctor: DoctorCreatePayload
): Promise<DoctorProfile> {
  const headers = await getAuthHeaders();

  const data = await apiRequest(`/api/doctors/${id}/`, {
    method: "PUT",
    headers,
    body: JSON.stringify(doctor),
  });

  return mapDoctor(data as DoctorServerPayload);
}

export async function createDoctor(doctor: DoctorCreatePayload) {
  const headers = await getAuthHeaders();

  const data = await apiRequest("/api/doctors/", {
    method: "POST",
    headers,
    body: JSON.stringify(doctor),
  });

  return mapDoctor(data as DoctorServerPayload);
}
