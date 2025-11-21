import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

// Add a new job application
export async function submitApplication({ jobId, userId, coverLetter, email, phone, resumeId }) {
  if (!jobId || !userId || !coverLetter || !email || !phone || !resumeId) {
    throw new Error("Missing required application fields");
  }
  const applicationsRef = collection(db, "applications");
  const docRef = await addDoc(applicationsRef, {
    jobId,
    userId,
    coverLetter,
    email,
    phone,
    resumeId,
    appliedAt: Timestamp.now(),
  });
  return docRef.id;
}

// Get all applications for a specific job
export async function getApplicationsForJob(jobId) {
  const q = query(collection(db, "applications"), where("jobId", "==", jobId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get all applications for a specific employer's jobs
export async function getApplicationsForEmployer(employerId) {
  // First, get all jobs for this employer
  const jobsQ = query(collection(db, "jobs"), where("employerId", "==", employerId));
  const jobsSnap = await getDocs(jobsQ);
  const jobIds = jobsSnap.docs.map(doc => doc.id);
  if (jobIds.length === 0) return [];
  // Get all applications for these jobs
  const appsQ = query(collection(db, "applications"), where("jobId", "in", jobIds.slice(0,10)));
  // Firestore 'in' queries are limited to 10 elements
  const appsSnap = await getDocs(appsQ);
  return appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get all applications submitted by a user
export async function getApplicationsForUser(userId) {
  const q = query(collection(db, "applications"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get a single application by ID
export async function getApplicationById(applicationId) {
  const docRef = doc(db, "applications", applicationId);
  const snap = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}