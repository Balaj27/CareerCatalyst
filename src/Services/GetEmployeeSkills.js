import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "../lib/firebase"; // Adjust if your firebase config is in another path

const db = getFirestore();

export const getEmployeeSkills = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  // Adjust the document path as per your Firestore structure
  const profileRef = doc(db, "employees", user.uid, "employee data", "profile");
  const profileSnap = await getDoc(profileRef);
  if (!profileSnap.exists()) throw new Error("Profile not found");

  // Assuming skills are stored as an array in the "skills" field
  const data = profileSnap.data();
  return data.skills || [];
};