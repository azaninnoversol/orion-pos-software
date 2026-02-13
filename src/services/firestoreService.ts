// firebase
import { db } from "@/utils/config";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc, DocumentData, Timestamp } from "firebase/firestore";

class FirestoreService<T extends object> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async add(data: T) {
    const colRef = collection(db, this.collectionName);
    const now = Date.now();

    const docData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(colRef, docData as DocumentData);
    return { id: docRef.id, ...docData };
  }

  async set(id: string, data: T) {
    const now = Date.now();

    const docData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = doc(db, this.collectionName, id);
    await setDoc(docRef, docData as DocumentData);
    return { id, ...docData };
  }

  async update(id: string, data: Partial<T>) {
    const now = Date.now();

    const docData = {
      ...data,
      updatedAt: now,
    };

    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, docData as DocumentData);
    return { id, ...docData };
  }

  async getAll(): Promise<(T & { id: string })[]> {
    const colRef = collection(db, this.collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: this.convertTimestamp(data.createdAt),
        updatedAt: this.convertTimestamp(data.updatedAt),
      } as unknown as T & { id: string };
    });
  }

  async getById(id: string): Promise<(T & { id: string }) | null> {
    if (!this.collectionName) throw new Error("Collection name is undefined");
    if (!db) throw new Error("Firestore db is undefined");
    if (!id) throw new Error("id is undefined");

    const docRef = doc(db, this.collectionName, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      createdAt: this.convertTimestamp(data.createdAt),
      updatedAt: this.convertTimestamp(data.updatedAt),
    } as unknown as T & { id: string };
  }

  async deleteById(id: string) {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
    return true;
  }

  async updateWhere(fieldPath: string, value: any, data: Record<string, any>) {
    const colRef = collection(db, this.collectionName);
    const snapshot = await getDocs(colRef);

    const batchUpdates = snapshot.docs.filter((docSnap) => {
      const docData = docSnap.data();
      const fieldParts = fieldPath.split(".");
      let current = docData;
      for (const part of fieldParts) {
        current = current?.[part];
      }
      return current === value;
    });

    for (const docSnap of batchUpdates) {
      const docRef = doc(db, this.collectionName, docSnap.id);
      await updateDoc(docRef, data);
    }

    return true;
  }

  private convertTimestamp(value: any): number | undefined {
    if (!value) return undefined;
    if (value instanceof Timestamp) return value.toMillis();
    if (typeof value === "number") return value;
    return undefined;
  }
}

export default FirestoreService;
