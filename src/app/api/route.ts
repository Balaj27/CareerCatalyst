import { NextRequest, NextResponse } from "next/server";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

// Simulated user ID (replace with actual auth logic later)
const getUserId = (req: NextRequest) => {
  return "demo-user-id"; // Example: replace with Firebase Auth
};

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (id) {
    // Get a single resume
    const docRef = doc(db, "resumes", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    const resume = docSnap.data();
    if (resume.user !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(resume);
  } else {
    // Get all resumes
    const q = query(collection(db, "resumes"), where("user", "==", userId));
    const snapshot = await getDocs(q);
    const resumes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(resumes);
  }
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const { title, themeColor } = await req.json();

  if (!title || !themeColor) {
    return NextResponse.json({ message: "Title and themeColor are required" }, { status: 400 });
  }

  const newResume = {
    title,
    themeColor,
    user: userId,
    firstName: "",
    lastName: "",
    email: "",
    summary: "",
    jobTitle: "",
    phone: "",
    address: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    createdAt: Date.now(),
  };

  const docRef = await addDoc(collection(db, "resumes"), newResume);
  return NextResponse.json({ id: docRef.id, ...newResume }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const userId = getUserId(req);
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  const body = await req.json();

  if (!id) {
    return NextResponse.json({ message: "Resume ID is required" }, { status: 400 });
  }

  const resumeRef = doc(db, "resumes", id);
  const resumeSnap = await getDoc(resumeRef);

  if (!resumeSnap.exists()) {
    return NextResponse.json({ message: "Resume not found" }, { status: 404 });
  }

  if (resumeSnap.data().user !== userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  await updateDoc(resumeRef, { ...body, updatedAt: Date.now() });
  return NextResponse.json({ message: "Resume updated successfully" });
}

export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Resume ID is required" }, { status: 400 });
  }

  const resumeRef = doc(db, "resumes", id);
  const resumeSnap = await getDoc(resumeRef);

  if (!resumeSnap.exists()) {
    return NextResponse.json({ message: "Resume not found" }, { status: 404 });
  }

  if (resumeSnap.data().user !== userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  await deleteDoc(resumeRef);
  return NextResponse.json({ message: "Resume deleted successfully" });
}
