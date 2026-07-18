import AsyncStorage from '@react-native-async-storage/async-storage';

export type DoctorProfile = {
  id: string;
  name: string;
  professionalism: string;
  phonenumber: string;
  details: string;
  createdAt: string;
};

const DOCTORS_KEY = 'doctors';

export const getDoctors = async (): Promise<DoctorProfile[]> => {
  const data = await AsyncStorage.getItem(DOCTORS_KEY);

  return data ? JSON.parse(data) : [];
};

export const addDoctor = async (
  doctor: Omit<DoctorProfile, 'id' | 'createdAt'>
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

export const deleteDoctor = async (id: string): Promise<void> => {
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