// src/services/authService.ts

import { getAccessToken, saveTokens } from "@/storage/authTokenStorage";
import { signIn, syncNow } from "@/sync/engine";
import { updateProfile } from "@/sync/store";
import { apiRequest } from "./apiClient";

const FIRST_SYNC_TIMEOUT_MS = 15000;

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

  const user = await apiRequest("/register/", {
    method: "POST",
    body: formData,
  });

  // /register/ no devuelve tokens: pedirlos para que la cuenta nueva quede con sesión iniciada.
  await requestTokens(email, password);

  return user;
}

async function requestTokens(email: string, password: string) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const data = await apiRequest("/api/token/", {
    method: "POST",
    body: formData,
  });

  await saveTokens(data.access, data.refresh);
  // Activa el espacio de datos de esta cuenta en el teléfono.
  await signIn(data.access);
  return data;
}

export async function loginUser(email: string, password: string) {
  const data = await requestTokens(email, password);

  // Descarga los datos de la cuenta antes de entrar (sin bloquear más de 15 s).
  await Promise.race([
    syncNow(true).catch((error) => console.warn("Primera sincronización falló", error)),
    new Promise((resolve) => setTimeout(resolve, FIRST_SYNC_TIMEOUT_MS)),
  ]);
  await updateProfile({ email }, { sync: false });

  return data;
}

export async function getProfile() {
  const token = await getAccessToken();
  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  return apiRequest("/profile/", {
    headers,
  });
}
