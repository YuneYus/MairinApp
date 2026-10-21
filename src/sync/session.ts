// sync/session.ts
//
// Separa los datos de cada cuenta en el teléfono. Todo se guarda con un prefijo:
//   "guest::<clave>"      modo invitada (sin cuenta, no se sincroniza)
//   "user:<id>::<clave>"  cuenta registrada (se sincroniza con el servidor)
// Así, al cerrar sesión o cambiar de cuenta nadie ve los datos de otra persona.

import AsyncStorage from "@react-native-async-storage/async-storage";

export type Scope = "guest" | `user:${string}`;

const ACTIVE_SCOPE_KEY = "active_scope";

let activeScope: Scope | null = null;
let markReady: () => void = () => {};
const ready = new Promise<void>((resolve) => {
  markReady = resolve;
});

/** Lo llama la migración inicial cuando terminó; antes de eso nadie lee datos. */
export function setStorageReady() {
  markReady();
}

export function whenStorageReady(): Promise<void> {
  return ready;
}

function isScope(value: string | null): value is Scope {
  return value === "guest" || (!!value && value.startsWith("user:"));
}

export async function getScope(): Promise<Scope> {
  if (activeScope) return activeScope;
  const saved = await AsyncStorage.getItem(ACTIVE_SCOPE_KEY);
  activeScope = isScope(saved) ? saved : "guest";
  return activeScope;
}

export async function setScope(scope: Scope): Promise<void> {
  activeScope = scope;
  await AsyncStorage.setItem(ACTIVE_SCOPE_KEY, scope);
}

export function isAccountScope(scope: Scope): boolean {
  return scope.startsWith("user:");
}

export async function isSignedIn(): Promise<boolean> {
  return isAccountScope(await getScope());
}

// --- Sesión vencida: el servidor rechazó el token de renovación ---

const SESSION_EXPIRED_KEY = "session_expired";

export async function setSessionExpired(expired: boolean): Promise<void> {
  if (expired) await AsyncStorage.setItem(SESSION_EXPIRED_KEY, "true");
  else await AsyncStorage.removeItem(SESSION_EXPIRED_KEY);
}

export async function isSessionExpired(): Promise<boolean> {
  return (await AsyncStorage.getItem(SESSION_EXPIRED_KEY)) === "true";
}

export function scopeKey(scope: Scope, key: string): string {
  return `${scope}::${key}`;
}

function decodeBase64Url(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let bits = 0;
  let value = 0;
  let output = "";
  for (const char of base64) {
    const index = chars.indexOf(char);
    if (index < 0) continue;
    value = (value << 6) | index;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((value >> bits) & 0xff);
    }
  }
  return output;
}

/** Id de la usuaria dentro del token JWT (`user_id`), o null si el token no se puede leer. */
export function userIdFromToken(accessToken: string): string | null {
  try {
    const payload = JSON.parse(decodeBase64Url(accessToken.split(".")[1] ?? ""));
    return payload.user_id != null ? String(payload.user_id) : null;
  } catch {
    return null;
  }
}

// --- Lectura y escritura en el espacio de la cuenta activa ---

export async function scopedGet<T>(key: string, fallback: T): Promise<T> {
  await ready;
  const raw = await AsyncStorage.getItem(scopeKey(await getScope(), key));
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function scopedSet<T>(key: string, value: T): Promise<void> {
  await ready;
  await AsyncStorage.setItem(scopeKey(await getScope(), key), JSON.stringify(value));
}

export async function scopedRemove(key: string): Promise<void> {
  await ready;
  await AsyncStorage.removeItem(scopeKey(await getScope(), key));
}

/** Todas las claves guardadas en un espacio (para copiar los datos de invitada a una cuenta nueva). */
export async function keysOfScope(scope: Scope): Promise<string[]> {
  const prefix = scopeKey(scope, "");
  const keys = await AsyncStorage.getAllKeys();
  return keys.filter((key) => key.startsWith(prefix)).map((key) => key.slice(prefix.length));
}
