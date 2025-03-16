import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig";

export type FirebaseUser = {
  id?: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
};

export async function loadUsersFromFirebase(): Promise<FirebaseUser[]> {
  const querySnapshot = await getDocs(collection(db, "users"));
  const users: FirebaseUser[] = [];
  querySnapshot.forEach((docSnap) => {
    users.push({ id: docSnap.id, ...(docSnap.data() as FirebaseUser) });
  });
  return users;
}

export async function addUserToFirebase(user: FirebaseUser): Promise<string> {
  const docRef = await addDoc(collection(db, "users"), user);
  return docRef.id;
}

export async function updateUserInFirebase(userId: string, data: Partial<FirebaseUser>): Promise<void> {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, data);
}

export async function deleteUserFromFirebase(userId: string): Promise<void> {
  const docRef = doc(db, "users", userId);
  await deleteDoc(docRef);
}
