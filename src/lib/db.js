// IndexedDB persistence — same no-backend pattern as the other trackers.
// Key = entryId. Value = { ts, m: true } when mastered, { ts, l: true } when
// lost (needs buy-back) — key presence alone means owned.
const DB_NAME = "sprite-locker";
const STORE = "collection";

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadCollection() {
  try {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const store = tx.objectStore(STORE);
      const keysReq = store.getAllKeys();
      const valsReq = store.getAll();
      tx.oncomplete = () => {
        const owned = new Set();
        const mastered = new Set();
        const lost = new Set();
        keysReq.result.forEach((k, i) => {
          const v = valsReq.result[i];
          if (v && v.l) lost.add(k);
          else {
            owned.add(k);
            if (v && v.m) mastered.add(k);
          }
        });
        resolve({ owned, mastered, lost });
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return { owned: new Set(), mastered: new Set(), lost: new Set() };
  }
}

// state: "none" | "owned" | "mastered" | "lost"
export async function setEntry(entryId, state) {
  try {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      if (state === "none") store.delete(entryId);
      else if (state === "mastered") store.put({ ts: Date.now(), m: true }, entryId);
      else if (state === "lost") store.put({ ts: Date.now(), l: true }, entryId);
      else store.put({ ts: Date.now() }, entryId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    /* memory-only fallback; UI state still updates */
  }
}

export async function setManyOwned(entryIds) {
  try {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      const ts = Date.now();
      for (const id of entryIds) store.put({ ts }, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    /* noop */
  }
}

export async function setManyMastered(entryIds) {
  try {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      const ts = Date.now();
      for (const id of entryIds) store.put({ ts, m: true }, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    /* noop */
  }
}

export async function clearCollection() {
  try {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    /* noop */
  }
}
