import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, doc, getDoc, setDoc, deleteDoc, Timestamp, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Helper: recursively convert any Firestore Timestamp to ISO string
function convertTimestamps(obj) {
  if (obj instanceof Timestamp) {
    return obj.toDate().toISOString();
  }
  if (Array.isArray(obj)) {
    return obj.map(convertTimestamps);
  }
  if (obj && typeof obj === "object") {
    const result = {};
    for (const key in obj) {
      result[key] = convertTimestamps(obj[key]);
    }
    return result;
  }
  return obj;
}

// Get resumes collection for user
const getResumesCollectionRef = () => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error("User not authenticated.");
  return collection(db, "employees", userId, "resumes");
};

// Create a new resume and return its ID
export const createNewResume = async (resumeData) => {
  const colRef = getResumesCollectionRef();
  const createdAt = new Date().toISOString();
  const lastUpdated = Timestamp.now();
  const docRef = await addDoc(colRef, {
    ...resumeData,
    createdAt,
    lastUpdated,
  });
  // Convert timestamps before returning
  return { id: docRef.id, ...convertTimestamps(resumeData), createdAt, lastUpdated: new Date().toISOString() };
};

// Save/update all resume data into specific resume document
export const saveResumeToDocument = async (resumeId, resumeData) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error("User not authenticated.");
  if (!resumeId) throw new Error("resumeId is required.");
  const docRef = doc(db, "employees", userId, "resumes", resumeId);
  await setDoc(
    docRef,
    {
      ...resumeData,
      lastUpdated: Timestamp.now(),
      createdAt: resumeData.createdAt || new Date().toISOString(),
    },
    { merge: true }
  );
};

// Get all resumes for the current user
export const getAllResumeData = async () => {
  const colRef = getResumesCollectionRef();
  const querySnapshot = await getDocs(colRef);
  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...convertTimestamps(data),
    };
  });
};

// Get a single resume by its document ID
export const getResumeData = async (resumeID) => {
  if (!resumeID) throw new Error("resumeID is required.");
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error("User not authenticated.");
  const docRef = doc(db, "employees", userId, "resumes", resumeID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return { id: docSnap.id, ...convertTimestamps(data) };
  }
  throw new Error("Resume not found");
};

// Update a specific resume (merge only the provided fields)
export const updateThisResume = async (resumeID, resumeData) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error("User not authenticated.");
  if (!resumeID) throw new Error("resumeID is required.");
  const docRef = doc(db, "employees", userId, "resumes", resumeID);
  await setDoc(docRef, { ...resumeData, lastUpdated: Timestamp.now() }, { merge: true });
  return { success: true };
};

// Delete a specific resume by ID
export const deleteThisResume = async (resumeID) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error("User not authenticated.");
  if (!resumeID) throw new Error("resumeID is required.");
  const docRef = doc(db, "employees", userId, "resumes", resumeID);
  await deleteDoc(docRef);
  return { success: true };
};

// Find resume by its title field
export const getResumeByTitle = async (title) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error("User not authenticated.");
  const colRef = collection(db, "employees", userId, "resumes");
  const q = query(colRef, where("title", "==", title));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...convertTimestamps(docSnap.data()) };
  }
  throw new Error("Resume with the given title not found");
};