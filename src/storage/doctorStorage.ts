import AsyncStorage from "@react-native-async-storage/async-storage";

export type DoctorProfile = {
  id: string;
  name: string;
  professionalism: string;
  phonenumber: string;
  details: string;
  createdAt: string;
};

export type DoctorPayload = Omit<DoctorProfile, "id" | "createdAt">;

export type PendingDoctorChange = {
  doctorId: string;
  method: "POST" | "PUT" | "DELETE";
  payload?: DoctorPayload;
};

const DOCTORS_KEY = "doctor";
const PENDING_DOCTOR_CHANGES_KEY = "pending_doctor_changes";

export const getDoctors = async (): Promise<DoctorProfile[]> => {
  const data = await AsyncStorage.getItem(DOCTORS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveDoctors = async (doctors: DoctorProfile[]): Promise<void> => {
  await AsyncStorage.setItem(DOCTORS_KEY, JSON.stringify(doctors));
};

export const getPendingDoctorChanges = async (): Promise<PendingDoctorChange[]> => {
  const data = await AsyncStorage.getItem(PENDING_DOCTOR_CHANGES_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePendingDoctorChanges = async (
  changes: PendingDoctorChange[]
): Promise<void> => {
  await AsyncStorage.setItem(PENDING_DOCTOR_CHANGES_KEY, JSON.stringify(changes));
};

export const queueDoctorChange = async (
  change: PendingDoctorChange
): Promise<void> => {
  const changes = await getPendingDoctorChanges();
  const existingIndex = changes.findIndex((item) => item.doctorId === change.doctorId);

  if (existingIndex === -1) {
    changes.push(change);
  } else {
    changes[existingIndex] = change;
  }

  await savePendingDoctorChanges(changes);
};

export const removePendingDoctorChange = async (
  doctorId: string
): Promise<void> => {
  const changes = await getPendingDoctorChanges();
  await savePendingDoctorChanges(changes.filter((item) => item.doctorId !== doctorId));
};

export const getDoctorById = async (
  id: string
): Promise<DoctorProfile | undefined> => {
  const doctors = await getDoctors();
  return doctors.find((doctor) => doctor.id === id);
};

export const addDoctor = async (doctor: DoctorPayload): Promise<DoctorProfile> => {
  const doctors = await getDoctors();
  const newDoctor: DoctorProfile = {
    ...doctor,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  await saveDoctors([newDoctor, ...doctors]);
  return newDoctor;
};

export const updateDoctor = async (updatedDoctor: DoctorProfile): Promise<void> => {
  const doctors = await getDoctors();
  const updatedDoctors = doctors.map((doctor) =>
    doctor.id === updatedDoctor.id ? updatedDoctor : doctor
  );
  await saveDoctors(updatedDoctors);
};

export const replaceDoctorId = async (
  temporaryId: string,
  doctor: DoctorProfile
): Promise<void> => {
  const doctors = await getDoctors();
  await saveDoctors(
    doctors.map((item) => (item.id === temporaryId ? doctor : item))
  );
};

export const deleteDoctor = async (id: string): Promise<void> => {
  const doctors = await getDoctors();
  await saveDoctors(doctors.filter((doctor) => doctor.id !== id));
};

export const clearAllDoctors = async (): Promise<void> => {
  await AsyncStorage.multiRemove([DOCTORS_KEY, PENDING_DOCTOR_CHANGES_KEY]);
};
