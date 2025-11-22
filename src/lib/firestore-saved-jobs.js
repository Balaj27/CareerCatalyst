import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

// Save a job for a user
export async function saveJob({ jobId, userId }) {
  if (!jobId || !userId) throw new Error("Missing jobId or userId");
  const savedJobsRef = collection(db, "savedJobs");
  await addDoc(savedJobsRef, { jobId, userId });
}

// Remove a saved job for a user
export async function unsaveJob({ jobId, userId }) {
  const savedJobsRef = collection(db, "savedJobs");
  const q = query(savedJobsRef, where("jobId", "==", jobId), where("userId", "==", userId));
  const snap = await getDocs(q);
  for (const d of snap.docs) {
    await deleteDoc(doc(db, "savedJobs", d.id));
  }
}

// Get all saved jobs for a user
export async function getSavedJobsForUser(userId) {
  const q = query(collection(db, "savedJobs"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data().jobId);
}
