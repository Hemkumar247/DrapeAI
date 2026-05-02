const DB_NAME = "drape_wardrobe_db";
const DB_VERSION = 2; // Incremented version
const STORE_NAME = "saved_looks";
const GARMENT_STORE = "garments";

export type SavedLook = {
  id: string;
  generatedImage: string;
  garmentImages: string[]; // base64 garment thumbnails
  garmentLabels: { subType: string; brand: string | null }[];
  caption: string | null;
  createdAt: number;
};

import { GarmentAnalysisResult } from "./ai";

export type SavedGarment = {
  id: string;
  image: string;
  analysis: GarmentAnalysisResult;
  createdAt: number;
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(GARMENT_STORE)) {
        db.createObjectStore(GARMENT_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveLook(look: SavedLook): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(look);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllLooks(): Promise<SavedLook[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const looks = (request.result as SavedLook[]).sort((a, b) => b.createdAt - a.createdAt);
      resolve(looks);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteLook(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveGarment(garment: SavedGarment): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(GARMENT_STORE, "readwrite");
    const store = tx.objectStore(GARMENT_STORE);
    store.put(garment);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllGarments(): Promise<SavedGarment[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(GARMENT_STORE, "readonly");
    const store = tx.objectStore(GARMENT_STORE);
    const request = store.getAll();
    request.onsuccess = () => {
      const garments = (request.result as SavedGarment[]).sort((a, b) => b.createdAt - a.createdAt);
      resolve(garments);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteGarment(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(GARMENT_STORE, "readwrite");
    const store = tx.objectStore(GARMENT_STORE);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

