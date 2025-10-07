import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getAuth } from "firebase/auth";

// Get user profile data for auto-filling resume
export const getUserProfileData = async () => {
  try {
    const userId = getAuth().currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    console.log("Fetching profile data for user:", userId); // Debug log

    // Fetch from main user document
    const userDocRef = doc(db, "employees", userId);
    const userDocSnap = await getDoc(userDocRef);
    
    // Fetch from profile subdocument
    const profileRef = doc(db, "employees", userId, "employee data", "profile");
    const profileSnap = await getDoc(profileRef);

    let profileData = {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      skills: [],
      desiredJobTitle: ""
    };

    // Fill from user doc fields
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      console.log("User doc data:", userData); // Debug log
      profileData.fullName = userData.displayName || "";
      profileData.jobTitle = userData.jobTitle || "";
      profileData.email = userData.email || "";
      profileData.phone = userData.phone || "";
      profileData.location = userData.location || "";
      profileData.summary = userData.summary || "";
    }

    // Fill from profile subdoc fields if present (priority)
    if (profileSnap.exists()) {
      const data = profileSnap.data();
      console.log("Profile doc data:", data); // Debug log
      profileData.fullName = data.fullName || data.personalInfo?.fullName || profileData.fullName;
      profileData.jobTitle = data.desiredJobTitle || data.jobTitle || data.personalInfo?.jobTitle || profileData.jobTitle;
      profileData.email = data.email || data.personalInfo?.email || profileData.email;
      profileData.phone = data.phone || data.personalInfo?.phone || profileData.phone;
      profileData.location = data.location || data.personalInfo?.location || profileData.location;
      profileData.summary = data.summary || data.personalInfo?.summary || profileData.summary;
      profileData.skills = Array.isArray(data.skills) ? data.skills : [];
      profileData.desiredJobTitle = data.jobPreferences?.desiredJobTitle || "";
    }

    console.log("Final profile data:", profileData); // Debug log
    return profileData;
  } catch (error) {
    console.error("Error fetching user profile data:", error);
    throw error;
  }
};

// Convert profile data to resume format
export const convertProfileToResumeData = (profileData) => {
  const [firstName, ...lastNameParts] = (profileData.fullName || "").split(" ");
  const lastName = lastNameParts.join(" ") || "";

  const resumeData = {
    personal: {
      firstName: firstName || "",
      lastName: lastName || "",
      jobTitle: profileData.desiredJobTitle || profileData.jobTitle || "",
      email: profileData.email || "",
      phone: profileData.phone || "",
      address: profileData.location || "",
    },
    summary: profileData.summary || "",
    skills: profileData.skills || [],
    // Add other sections as needed
    experience: [],
    education: [],
    projects: []
  };

  console.log("Converted profile to resume data:", resumeData); // Debug log
  return resumeData;
};
