// storage/accountTypeStorage.ts
//
// Ya no se guarda: es "registered" si hay una cuenta con sesión iniciada.

import { isSignedIn } from "@/sync/session";

export type AccountType = "guest" | "registered";

export async function getAccountType(): Promise<AccountType> {
  return (await isSignedIn()) ? "registered" : "guest";
}

/** Se mantiene por compatibilidad con las pantallas; el tipo se deduce de la sesión. */
export async function setAccountType(_type: AccountType): Promise<void> {}
