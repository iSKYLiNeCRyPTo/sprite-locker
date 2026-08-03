// IndexedDB persistence — same no-backend pattern as the other trackers.
// Key = entryId. Value = { ts, m?, l? }. m (mastered) is a permanent flag
// independent of l (lost) — mastery survives losing and buying a sprite
// back. l true = lost/needs buy-back; l absent (key present) = owned.
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
          const v = valsReq.result[i] || {};
          if (v.l) lost.add(k);
          else owned.add(k);
          if (v.m) mastered.add(k);
        });
        resolve({ owned, mastered, lost });
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return { owned: new Set(), mastered: new Set(), lost: new Set() };
  }
}

// state: "none" | "owned" | "lost". masteredEver is stored alongside and
// persists across owned <-> lost transitions; "none" is a full clear.
export async function setEntry(entryId, state, masteredEver = false) {
  try {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      if (state === "none") store.delete(entryId);
      else {
        const rec = { ts: Date.now() };
        if (state === "lost") rec.l = true;
        if (masteredEver) rec.m = true;
        store.put(rec, entryId);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    /* memory-only fallback; UI state still updates */
  }
}

// masteredIds: entries among entryIds that should keep/gain the mastered
// flag (e.g. mastery earned before a sprite was lost and just bought back).
export async function setManyOwned(entryIds, masteredIds = []) {
  try {
    const db = await open();
    const masteredSet = masteredIds instanceof Set ? masteredIds : new Set(masteredIds);
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      const ts = Date.now();
      for (const id of entryIds) {
        const rec = { ts };
        if (masteredSet.has(id)) rec.m = true;
        store.put(rec, id);
      }
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
