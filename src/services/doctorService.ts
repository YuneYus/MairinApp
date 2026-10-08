import { getAccessToken } from "@/storage/authTokenStorage";
import {
  addDoctor as addLocalDoctor,
  deleteDoctor as deleteLocalDoctor,
  DoctorPayload,
  DoctorProfile,
  getDoctorById,
  getDoctors,
  getPendingDoctorChanges,
  queueDoctorChange,
  removePendingDoctorChange,
  replaceDoctorId,
  saveDoctors,
  updateDoctor as updateLocalDoctor,
} from "@/storage/doctorStorage";
import { apiRequest } from "./apiClient";

type DoctorServerPayload = DoctorPayload & {
  id: number | string;
  created_at?: string;
};

type DoctorSaveResult = {
  doctor: DoctorProfile;
  synced: boolean;
};

async function getAuthHeaders() {
  const token = (await getAccessToken())?.trim();
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

function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError;
}

let syncInProgress: Promise<boolean> | null = null;

async function syncQueuedDoctorChanges(): Promise<boolean> {
  if (syncInProgress) {
    return syncInProgress;
  }

  syncInProgress = (async () => {
    const changes = await getPendingDoctorChanges();
    if (changes.length === 0) {
      return true;
    }

    let headers: Awaited<ReturnType<typeof getAuthHeaders>>;
    try {
      headers = await getAuthHeaders();
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("No auth token")) {
        return false;
      }
      throw error;
    }

    for (const change of changes) {
      try {
        const response = await apiRequest(
          change.method === "POST"
            ? "/api/doctors/"
            : `/api/doctors/${change.doctorId}/`,
          {
            method: change.method,
            headers,
            ...(change.payload ? { body: JSON.stringify(change.payload) } : {}),
          }
        );

        if (change.method === "POST") {
          await replaceDoctorId(change.doctorId, mapDoctor(response as DoctorServerPayload));
        } else if (change.method === "PUT") {
          await updateLocalDoctor(mapDoctor(response as DoctorServerPayload));
        }

        await removePendingDoctorChange(change.doctorId);
      } catch (error) {
        if (isNetworkError(error)) {
          return false;
        }
        throw error;
      }
    }

    return true;
  })();

  try {
    return await syncInProgress;
  } finally {
    syncInProgress = null;
  }
}

export async function syncPendingDoctorChanges(): Promise<boolean> {
  return syncQueuedDoctorChanges();
}

export async function fetchDoctors(): Promise<DoctorProfile[]> {
  await syncQueuedDoctorChanges();

  try {
    const headers = await getAuthHeaders();
    const data = await apiRequest("/api/doctors/", { headers });
    const remoteDoctors = (data as DoctorServerPayload[]).map(mapDoctor);
    const localDoctors = await getDoctors();
    const pendingChanges = await getPendingDoctorChanges();
    const pendingById = new Map(
      pendingChanges.map((change) => [change.doctorId, change])
    );
    const remoteIds = new Set(remoteDoctors.map((doctor) => doctor.id));
    const merged = remoteDoctors.map((remoteDoctor) => {
      const pending = pendingById.get(remoteDoctor.id);
      if (pending?.method === "DELETE") {
        return null;
      }
      if (pending) {
        return localDoctors.find((doctor) => doctor.id === remoteDoctor.id) ?? remoteDoctor;
      }
      return remoteDoctor;
    });
    const localOnlyDoctors = localDoctors.filter(
      (doctor) =>
        !remoteIds.has(doctor.id) && pendingById.get(doctor.id)?.method !== "DELETE"
    );
    const doctors = [...merged.filter((doctor): doctor is DoctorProfile => doctor !== null), ...localOnlyDoctors];

    await saveDoctors(doctors);
    return doctors;
  } catch (error) {
    if (isNetworkError(error)) {
      return getDoctors();
    }
    throw error;
  }
}

export async function fetchDoctorById(id: string): Promise<DoctorProfile> {
  const localDoctor = await getDoctorById(id);
  if (localDoctor) {
    return localDoctor;
  }

  const headers = await getAuthHeaders();
  const data = await apiRequest(`/api/doctors/${id}/`, { headers });
  const doctor = mapDoctor(data as DoctorServerPayload);
  await saveDoctors([doctor, ...(await getDoctors())]);
  return doctor;
}

export async function updateDoctorRemote(
  id: string,
  payload: DoctorPayload
): Promise<DoctorSaveResult> {
  const currentDoctor = await getDoctorById(id);
  if (!currentDoctor) {
    throw new Error("No se encontró el doctor guardado en este dispositivo.");
  }

  const doctor = { ...currentDoctor, ...payload };
  await updateLocalDoctor(doctor);

  const pending = (await getPendingDoctorChanges()).find(
    (change) => change.doctorId === id
  );
  await queueDoctorChange({
    doctorId: id,
    method: pending?.method === "POST" ? "POST" : "PUT",
    payload,
  });

  return { doctor, synced: await syncQueuedDoctorChanges() };
}

export async function createDoctor(
  payload: DoctorPayload
): Promise<DoctorSaveResult> {
  const doctor = await addLocalDoctor(payload);
  await queueDoctorChange({ doctorId: doctor.id, method: "POST", payload });
  return { doctor, synced: await syncQueuedDoctorChanges() };
}

export async function deleteDoctorForSync(id: string): Promise<boolean> {
  const pending = (await getPendingDoctorChanges()).find(
    (change) => change.doctorId === id
  );
  await deleteLocalDoctor(id);

  if (pending?.method === "POST") {
    await removePendingDoctorChange(id);
    return true;
  }

  await queueDoctorChange({ doctorId: id, method: "DELETE" });
  return syncQueuedDoctorChanges();
}
