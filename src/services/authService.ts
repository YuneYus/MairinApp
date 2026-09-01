// src/services/authService.ts

import { getAccessToken, saveTokens } from "@/storage/authTokenStorage";
import { saveProfileInfo } from "@/storage/profilenameStorage";
import { apiRequest } from "./apiClient";

export async function registerUser(
  email: string,
  password: string,
  name: string,
  lastName: string,
  birthDate?: string
) {
  const formData = new FormData();
  formData.append("username", email);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("name", name);
  formData.append("last_name", lastName);
  if (birthDate) {
    formData.append("birth_date", birthDate);
  }

  return apiRequest("/register/", {
    method: "POST",
    body: formData,
  });
}

export async function loginUser(email: string, password: string) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const data = await apiRequest("/api/token/", {
    method: "POST",
    body: formData,
  });

  await saveTokens(data.access, data.refresh);

  const profile = await getProfile();
  await saveProfileInfo({
    firstName: profile.first_name,
    lastName: profile.last_name,
    phone: profile.phone ?? "",
    email: profile.email ?? email,
    birthDate: profile.birth_date ?? "",
  });

  return data;
}

export async function getProfile() {
  const token = await getAccessToken();

  return apiRequest("/profile/", {
    headers: { Authorization: `Bearer ${token}` },
  });
}