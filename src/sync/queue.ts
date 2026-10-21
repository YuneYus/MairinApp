// sync/queue.ts
//
// Cola de cambios pendientes de subir al servidor. Guarda *qué* cambió, no los datos:
// al enviarse, el motor lee el estado local actual. Por eso hay una sola entrada por
// registro y diez cambios seguidos al mismo día se suben una sola vez.

import { isSignedIn, scopedGet, scopedSet } from "./session";

export type SyncOp = (
  | { kind: "profile" }
  | { kind: "medical" }
  | { kind: "daily_log"; date: string }
  | { kind: "chat_summary"; date: string }
  | { kind: "reminder"; localId: string; serverId?: number }
  | { kind: "doctor"; localId: string; serverId?: number }
) & {
  // Cambia en cada enqueue: si el registro se modifica mientras se sube, la entrada
  // nueva no se borra al terminar el envío anterior.
  rev?: number;
};

let revCounter = 0;

const QUEUE_KEY = "sync_queue";

export function opKey(op: SyncOp): string {
  switch (op.kind) {
    case "daily_log":
    case "chat_summary":
      return `${op.kind}:${op.date}`;
    case "reminder":
    case "doctor":
      return `${op.kind}:${op.localId}`;
    default:
      return op.kind;
  }
}

let onEnqueue: () => void = () => {};

/** El motor de sincronización se registra aquí para enviar los cambios en cuanto se puede. */
export function setOnEnqueue(listener: () => void) {
  onEnqueue = listener;
}

export async function getQueue(): Promise<SyncOp[]> {
  return scopedGet<SyncOp[]>(QUEUE_KEY, []);
}

export async function saveQueue(queue: SyncOp[]): Promise<void> {
  await scopedSet(QUEUE_KEY, queue);
}

/** Marca un registro como pendiente de subir. En modo invitada no se sincroniza nada. */
export async function enqueue(...ops: SyncOp[]): Promise<void> {
  if (!(await isSignedIn())) return;
  const queue = await getQueue();
  for (const raw of ops) {
    const op = { ...raw, rev: Date.now() * 1000 + (revCounter++ % 1000) } as SyncOp;
    const key = opKey(op);
    const index = queue.findIndex((item) => opKey(item) === key);
    if (index === -1) {
      queue.push(op);
    } else {
      // Conserva el id del servidor que ya se conocía (lo necesita un DELETE posterior).
      const previous = queue[index] as { serverId?: number };
      queue[index] = { ...op, serverId: (op as { serverId?: number }).serverId ?? previous.serverId } as SyncOp;
    }
  }
  await saveQueue(queue);
  onEnqueue();
}

/** Quita una entrada ya enviada, solo si nadie la volvió a modificar mientras tanto. */
export async function removeSent(op: SyncOp): Promise<void> {
  const queue = await getQueue();
  await saveQueue(queue.filter((item) => !(opKey(item) === opKey(op) && item.rev === op.rev)));
}

export async function pendingKeys(): Promise<Set<string>> {
  return new Set((await getQueue()).map(opKey));
}
