import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseconfig";

export type UserSettings = {
  backgroundColor?: string;
  notificationsEnabled?: boolean;
};

export const loadUserSettings = async (uid: string): Promise<UserSettings | null> => {
  try {
    const docRef = doc(db, "userSettings", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserSettings;
    }
    return null;
  } catch (error) {
    console.error("Error loading user settings:", error);
    return null;
  }
};

export const saveUserSettings = async (uid: string, settings: UserSettings): Promise<void> => {
  try {
    const docRef = doc(db, "userSettings", uid);
    await setDoc(docRef, settings, { merge: true });
  } catch (error) {
    console.error("Error saving user settings:", error);
  }
};
