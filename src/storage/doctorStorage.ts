import AsyncStorage from "@react-native-async-storage/async-storage";

export type DoctorProfile = {
  id: string;
  name: string;
  professionalism: string;
  phonenumber: string;
  details: string;
  createdAt: string;
};

const DOCTORS_KEY = "doctor";

export const getDoctors = async (): Promise<DoctorProfile[]> => {
  const data = await AsyncStorage.getItem(DOCTORS_KEY);

  return data ? JSON.parse(data) : [];
};

export const getDoctorById = async (
  id: string
): Promise<DoctorProfile | undefined> => {

  const doctors = await getDoctors();

  return doctors.find((doctor) => doctor.id === id);

};

export const addDoctor = async (
  doctor: Omit<DoctorProfile, "id" | "createdAt">
): Promise<DoctorProfile> => {

  const doctors = await getDoctors();

  const newDoctor: DoctorProfile = {

    ...doctor,

    id: Date.now().toString(),

    createdAt: new Date().toISOString(),

  };

  await AsyncStorage.setItem(

    DOCTORS_KEY,

    JSON.stringify([newDoctor, ...doctors])

  );

  return newDoctor;

};

export const updateDoctor = async (

  updatedDoctor: DoctorProfile

): Promise<void> => {

  const doctors = await getDoctors();

  const updatedDoctors = doctors.map((doctor) =>

    doctor.id === updatedDoctor.id

      ? updatedDoctor

      : doctor

  );

  await AsyncStorage.setItem(

    DOCTORS_KEY,

    JSON.stringify(updatedDoctors)

  );

};

export const deleteDoctor = async (

  id: string

): Promise<void> => {

  const doctors = await getDoctors();

  const filteredDoctors = doctors.filter(

    (doctor) => doctor.id !== id

  );

  await AsyncStorage.setItem(

    DOCTORS_KEY,

    JSON.stringify(filteredDoctors)

  );

};

export const clearAllDoctors = async (): Promise<void> => {

  await AsyncStorage.removeItem(DOCTORS_KEY);

};