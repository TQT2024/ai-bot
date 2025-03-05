import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseconfig';

export async function grantAdminPrivileges(userId: string) {
  try {
    await setDoc(doc(db, 'admin', userId), { admin: true });
    console.log(`Admin privileges granted to user: ${userId}`);
  } catch (error) {
    console.error("Error granting admin privileges: ", error);
  }
}
export async function checkAdminPrivileges(userId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'admin', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.admin === true;
    } else {
      console.log("No such document!");
      return false;
    }
  } catch (error) {
    console.error("Error checking admin privileges: ", error);
    return false;
  }
}