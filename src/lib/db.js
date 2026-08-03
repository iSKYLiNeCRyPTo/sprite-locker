// IndexedDB persistence — same no-backend pattern as the other trackers.
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
      keysReq.onsuccess = () => resolve(new Set(keysReq.result));
      keysReq.onerror = () => reject(keysReq.error);
    });
  } catch {
    return new Set();
  }
}

export async function setOwned(entryId, owned) {
  try {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      if (owned) store.put({ ts: Date.now() }, entryId);
      else store.delete(entryId);
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
