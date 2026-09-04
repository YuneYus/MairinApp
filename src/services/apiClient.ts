// src/services/apiClient.ts

import { getRefreshToken, saveAccessToken, saveTokens } from "@/storage/authTokenStorage";
import { Platform } from "react-native";

const API_ROOT = Platform.select({
  ios: "http://192.168.1.20:8000",
  android: "http://192.168.1.20:8000",
  default: "http://192.168.1.20:8000",

});

function normalizeHeaders(headers: RequestInit["headers"]) {
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return headers ? { ...headers } : {};
}

async function refreshAccessToken() {
  const refreshToken = (await getRefreshToken())?.trim();
  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${API_ROOT}/api/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json().catch(() => null);
  if (!data || !data.access) {
    return null;
  }

  if (data.refresh) {
    await saveTokens(data.access, data.refresh);
  } else {
    await saveAccessToken(data.access);
  }

  return data.access;
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const isFormData =
    typeof FormData !== "undefined" &&
    (options.body instanceof FormData || options.body?.constructor?.name === "FormData");

  const headers = normalizeHeaders(options.headers);
  const requestHeaders = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...headers,
  };

  const sendRequest = async (overrideHeaders = requestHeaders) =>
    fetch(`${API_ROOT}${endpoint}`, {
      ...options,
      headers: overrideHeaders,
    });

  let response = await sendRequest();

  if (
    response.status === 401 &&
    endpoint !== "/api/token/" &&
    endpoint !== "/api/token/refresh/"
  ) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      const retryHeaders = { ...requestHeaders };
      if (retryHeaders.Authorization) {
        retryHeaders.Authorization = `Bearer ${newAccessToken}`;
      }
      response = await sendRequest(retryHeaders);
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(JSON.stringify(errorBody) || `Request failed: ${response.status}`);
  }

  return response.json();
}