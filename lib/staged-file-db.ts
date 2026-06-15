"use client";

const DB_NAME = "DataVisionStagedFileDB";
const STORE_NAME = "staged_files";

export function saveStagedFile(file?: File, prompt: string = ""): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.put({ file: file || null, prompt, timestamp: Date.now() }, "active_file");
      transaction.oncomplete = () => resolve();
      transaction.onerror = (err: any) => reject(err);
    };
    request.onerror = (err: any) => reject(err);
  });
}

export function getStagedFile(): Promise<{ file: File | null; prompt: string } | null> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const getReq = store.get("active_file");
      getReq.onsuccess = () => {
        resolve(getReq.result || null);
      };
      getReq.onerror = (err: any) => reject(err);
    };
    request.onerror = (err: any) => reject(err);
  });
}

export function clearStagedFile(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.delete("active_file");
      transaction.oncomplete = () => resolve();
      transaction.onerror = (err: any) => reject(err);
    };
    request.onerror = (err: any) => reject(err);
  });
}
