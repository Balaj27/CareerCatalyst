import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

// Send a job offer to a candidate
export async function sendJobOffer({
  candidateId,
  jobId,
  employerId,
  employerEmail,
  candidateEmail,
  jobTitle,
  company,
  salaryMin,
  salaryMax,
  currency = "USD",
  jobType = "Full-time",
  startDate,
  description,
}) {
  if (!candidateId || !jobId || !employerId || !candidateEmail) {
    throw new Error("Missing required offer fields");
  }

  const offersRef = collection(db, "job_offers");
  const docRef = await addDoc(offersRef, {
    candidateId,
    jobId,
    employerId,
    employerEmail: employerEmail || "",
    candidateEmail,
    jobTitle,
    company,
    salary: {
      min: salaryMin,
      max: salaryMax,
      currency,
    },
    jobType,
    startDate: startDate || new Date(),
    description,
    status: "pending", // pending, accepted, rejected
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return docRef.id;
}

// Get all offers for a specific candidate
export async function getOffersForCandidate(candidateId) {
  const q = query(collection(db, "job_offers"), where("candidateId", "==", candidateId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Get all offers from an employer
export async function getOffersFromEmployer(employerId) {
  const q = query(collection(db, "job_offers"), where("employerId", "==", employerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Get a single offer by ID
export async function getOfferById(offerId) {
  const docRef = doc(db, "job_offers", offerId);
  const snap = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Accept or reject an offer
export async function updateOfferStatus(offerId, status) {
  if (!["accepted", "rejected"].includes(status)) {
    throw new Error("Invalid status. Must be 'accepted' or 'rejected'");
  }

  const offerRef = doc(db, "job_offers", offerId);
  await updateDoc(offerRef, {
    status,
    updatedAt: Timestamp.now(),
  });
}

// Get pending offers for a candidate
export async function getPendingOffersForCandidate(candidateId) {
  const q = query(
    collection(db, "job_offers"),
    where("candidateId", "==", candidateId),
    where("status", "==", "pending")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
