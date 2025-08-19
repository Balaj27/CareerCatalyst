import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "../lib/firebase";

export const getEmployeeJobTitle = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  const profileRef = doc(getFirestore(), "employees", user.uid, "employee data", "profile");
  const profileSnap = await getDoc(profileRef);
  if (!profileSnap.exists()) throw new Error("Profile not found");
  const data = profileSnap.data();
  console.log("Profile data for job title:", data); // <--- DEBUG LINE
  return data.personalInfo?.jobTitle || ""; // Make sure this matches your Firestore field
};