import { useState, useEffect } from "react"
import { db } from "../lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { useAuth } from "../lib/auth-context"
// import { getAllResumeData } from "../app/services/ResumeAPI"
import { submitApplication, getApplicationsForUser } from "../lib/firestore-application"
import { saveJob, unsaveJob, getSavedJobsForUser } from "../lib/firestore-saved-jobs";
import { sendCandidateEmail } from "../Services/sendCandidateEmail";
import { getUserProfileData } from "../Services/userProfileAPI";
import { generateCoverLetterAI } from "../Services/generateCoverLetterAI";
import { getAllResumeData } from "../Services/resumeAPI"
import {
  Box,
  Typography,
  Checkbox,
  Slider,
  FormControlLabel,
  FormGroup,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Collapse,
  Fade,
  TextField,
  Dialog,
  DialogTitle,
  ListItem,
  InputAdornment,
  Container,
  List,
  ListItemText,
  CircularProgress,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import { styled } from "@mui/material/styles"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import FacebookIcon from "@mui/icons-material/Facebook"
import GoogleIcon from "@mui/icons-material/Google"
import TwitterIcon from "@mui/icons-material/Twitter"
import AppleIcon from "@mui/icons-material/Apple"
import LocalShippingIcon from "@mui/icons-material/LocalShipping" // For Amazon
import WindowIcon from "@mui/icons-material/Window" // For Microsoft
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart" // For E-commerce
import MovieIcon from "@mui/icons-material/Movie" // For Netflix
import CameraIcon from "@mui/icons-material/Camera" // For Instagram
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CheckIcon from "@mui/icons-material/Check" // For custom checkbox
import PeopleIcon from "@mui/icons-material/People" // For Human Research
import SecurityIcon from "@mui/icons-material/Security" // For Armforce Guide & Security
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter" // For Business & Consulting
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic" // For Customer Care & Support
import AssignmentIcon from "@mui/icons-material/Assignment" // For Project Management
import AccountBalanceIcon from "@mui/icons-material/AccountBalance" // For Finance
import CampaignIcon from "@mui/icons-material/Campaign" // For Marketing
import SearchIcon from "@mui/icons-material/Search"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import MyLocationIcon from "@mui/icons-material/MyLocation"

// Import components
import Footer from "../components/Footer"
import Navbar from "../components/landing-page/Navbar"


// Animation keyframes
const fadeInKeyframes = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

// Styled components
const PageContainer = styled(Box)({
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
})

// Hero Section Components
const HeroContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#004D40", // Dark green background
  color: "white",
  padding: theme.spacing(8, 0, 6),
  textAlign: "center",
}))

// Completely redesigned search container with explicit CSS
const SearchContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  maxWidth: "950px",
  margin: "0 auto",
  marginTop: theme.spacing(4),
  backgroundColor: "white",
  borderRadius: "50px",
  padding: "6px",
  position: "relative", // For absolute positioning of children if needed
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    borderRadius: "25px",
    padding: "10px",
  },
}))

// First element - Search Input
const SearchInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
  flex: "1 1 40%", // Take 40% of the space
  [theme.breakpoints.down("md")]: {
    width: "100%",
    marginBottom: "10px",
  },
}))

// Middle element - Location Input
const LocationInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
      borderLeft: "1px solid #e0e0e0",
    },
    "&:hover fieldset": {
      border: "none",
      borderLeft: "1px solid #e0e0e0",
    },
    "&.Mui-focused fieldset": {
      border: "none",
      borderLeft: "1px solid #e0e0e0",
    },
  },
  flex: "1 1 30%", // Take 30% of the space
  [theme.breakpoints.down("md")]: {
    width: "100%",
    marginBottom: "10px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "none",
        borderTop: "1px solid #e0e0e0",
        borderBottom: "1px solid #e0e0e0",
      },
      "&:hover fieldset": {
        border: "none",
        borderTop: "1px solid #e0e0e0",
        borderBottom: "1px solid #e0e0e0",
      },
      "&.Mui-focused fieldset": {
        border: "none",
        borderTop: "1px solid #e0e0e0",
        borderBottom: "1px solid #e0e0e0",
      },
    },
  },
}))

// Last element - Search Button
const SearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#004D40",
  color: "white",
  borderRadius: "50px",
  padding: "10px 40px",
  fontWeight: 500,
  fontSize: "16px",
  textTransform: "none",
  flex: "0 0 auto", // Don't grow or shrink, stay at natural size
  "&:hover": {
    backgroundColor: "#00695C",
  },
  [theme.breakpoints.down("md")]: {
    width: "100%",
    borderRadius: "25px",
  },
}))

const ContentContainer = styled(Box)({
  padding: "40px 20px",
  maxWidth: "1200px",
  margin: "0 auto",
})

const SectionTitle = styled(Typography)({
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "24px",
  color: "#000000", // Black color as requested
})

const FilterContainer = styled(Box)({
  backgroundColor: "#004D40",
  color: "white",
  padding: "24px",
  borderRadius: "8px",
  height: "800px", // Make it full height
})

// Custom checkbox with white tick
const CustomCheckbox = styled(Checkbox)({
  color: "white",
  "&.Mui-checked": {
    color: "white",
  },
  "& .MuiSvgIcon-root": {
    fontSize: 24,
  },
})

const FilterCheckbox = styled(FormControlLabel)({
  color: "white",
  marginLeft: "-8px",
  "& .MuiCheckbox-root": {
    color: "white",
  },
  "& .Mui-checked": {
    color: "white", // Changed to white
  },
})

const SalaryFilterText = styled(Typography)({
  display: "flex",
  justifyContent: "space-between",
  marginTop: "8px",
  fontSize: "14px",
})

const ClearAllButton = styled(Button)({
  color: "white",
  textTransform: "none",
  padding: "0",
  fontSize: "14px",
  "&:hover": {
    backgroundColor: "transparent",
    textDecoration: "underline",
  },
})

const SortButton = styled(Button)({
  border: "1px solid #00A389", // Teal green border color
  borderRadius: "50px",
  padding: "8px 16px",
  textTransform: "none",
  color: "#333",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
})

// ===== FROM POPULAR JOBS COMPONENT =====

// Animated container for job cards
const AnimatedContainer = styled(Box)(({ theme, delay = 0 }) => ({
  animation: `fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
  animationDelay: `${delay}ms`,
  opacity: 0,
  transform: "translateY(20px)",
}))

// Grid container with fixed dimensions
const GridContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)", // 3 equal columns
  gap: "24px", // Equal spacing between cards
  width: "100%",
  marginBottom: "24px",
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, 1fr)", // 2 columns on medium screens
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr", // 1 column on small screens
  },
}))

// Card with white background and border
const JobCard = styled(Card)(({ theme }) => ({
  width: "100%", // Take full width of grid cell
  height: "340px", // Fixed height
  display: "flex",
  flexDirection: "column",
  borderRadius: "12px",
  border: `1px solid #e0e0e0`, // Light border
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
  overflow: "hidden",
  position: "relative",
  backgroundColor: "#ffffff", // White background
  color: "#000000", // Black text
  "&:hover": {
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
    transform: "translateY(-3px)",
    backgroundColor: "#004D40", // Dark green background on hover
    color: "#ffffff", // White text on hover
    "& .MuiCardContent-root": {
      color: "#ffffff", // White text for card content
    },
    "& .MuiTypography-root": {
      color: "#ffffff", // White text for all typography
    },
    "& .location-text, & .job-type-text, & .application-status span, & .salary-text span": {
      color: "rgba(255, 255, 255, 0.8)", // Slightly transparent white for secondary text
    },
  },
}))

// Clean content area with proper spacing
const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: "24px", // Fixed padding
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  height: "276px", // Fixed height (340px - 64px for action area)
  boxSizing: "border-box", // Include padding in height calculation
}))

// Company section with logo and name
const CompanySection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: "24px",
}))

const CompanyLogo = styled(Avatar)(({ theme, bgcolor }) => ({
  width: 36,
  height: 36,
  backgroundColor: bgcolor || "#1877F2", // Company color
  borderRadius: "4px",
  "& .MuiSvgIcon-root": {
    color: "#ffffff", // White icon
  },
}))

const CompanyInfo = styled(Box)(({ theme }) => ({
  marginLeft: "12px",
}))

const CompanyName = styled(Typography)({
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: 1.2,
  color: "#000000", // Black text
  className: "company-name",
})

const LocationText = styled(Typography)({
  fontSize: "14px",
  color: "#6E6E6E", // Gray text
  marginTop: "2px",
  className: "location-text",
})

const JobTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: "24px",
  lineHeight: 1.3,
  marginBottom: "8px",
  color: "#000000", // Black text
  className: "job-title",
})

const JobTypeText = styled(Typography)({
  fontSize: "16px",
  color: "#6E6E6E", // Gray text
  marginBottom: "24px",
  className: "job-type-text",
})

const ApplicationStatus = styled(Typography)({
  fontSize: "16px",
  marginBottom: "8px",
  color: "#000000", // Black text
  "& span": {
    color: "#6E6E6E", // Gray text
    className: "application-status-span",
  },
  className: "application-status",
})

const SalaryText = styled(Typography)({
  fontSize: "18px",
  fontWeight: 600,
  color: "#000000", // Black text
  marginTop: "auto",
  marginBottom: "24px",
  "& span": {
    color: "#6E6E6E", // Gray text
    fontWeight: 400,
    className: "salary-text-span",
  },
  className: "salary-text",
})

// Button container
const ButtonContainer = styled(CardActions)(({ theme }) => ({
  padding: "0 24px 24px",
  display: "flex",
  gap: "12px",
  marginTop: "5px", // Add space above buttons
  marginBottom: "16px", // Add space below buttons
}))

// Apply button
const ApplyButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#004D40", // Dark green background
  color: "white", // White text
  borderRadius: "4px",
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "16px",
  flex: 1,
  whiteSpace: "nowrap",
  "&:hover": {
    backgroundColor: "#00695C", // Darker green on hover
  },
  ".MuiCard-root:hover &": {
    backgroundColor: "white", // White background when card is hovered
    color: "#004D40", // Green text when card is hovered
  },
}))

// Contact button
const ContactButton = styled(Button)(({ theme }) => ({
  backgroundColor: "transparent", // Transparent background
  color: "#6E6E6E", // Gray text
  borderRadius: "4px",
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "16px",
  border: "1px solid #E0E0E0", // Light border
  flex: 1,
  whiteSpace: "nowrap",
  "&:hover": {
    backgroundColor: "#F5F5F5", // Light gray on hover
    borderColor: "#BDBDBD", // Darker border on hover
  },
  ".MuiCard-root:hover &": {
    backgroundColor: "transparent", // Transparent background when card is hovered
    color: "white", // White text when card is hovered
    borderColor: "white", // White border when card is hovered
  },
}))

// Action buttons container - Moved to bottom of page
const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: "16px",
  marginTop: "40px",
  marginBottom: "40px",
  width: "100%",
}))

// View more button
const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: "30px",
  borderColor: variant === "outlined" ? theme.palette.primary.main : "transparent",
  backgroundColor: variant === "contained" ? theme.palette.primary.main : "transparent",
  color: variant === "contained" ? "white" : theme.palette.primary.main,
  padding: "10px 30px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
  "&:hover": {
    backgroundColor: variant === "contained" ? "#00695C" : "rgba(0, 109, 91, 0.1)",
    transform: "translateY(-3px)",
    boxShadow: variant === "contained" ? "0px 4px 12px rgba(0, 109, 91, 0.2)" : "none",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "20px",
    transition: "all 0.3s ease",
  },
}))

// Job categories
const jobCategories = [
  "Marketing & Communication",
  "Design & Development",
  "Human Research",
  "Finance",
  "Armforce Guide & Security",
  "Business & Consulting",
  "Customer Care & Support",
  "Project Management",
]

// Job types
const jobTypes = ["Full Time", "Part Time", "Internship", "Project Work", "Volunteering"]

// Update the SortButton dropdown menu to have teal background
const SortMenu = styled(Box)({
  position: "absolute",
  right: "0",
  top: "40px",
  backgroundColor: "#004D40", // Teal background
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  borderRadius: "4px",
  zIndex: 10,
  display: "none",
  width: "150px",
})

const SortMenuItem = styled(Box)({
  padding: "10px 16px",
  cursor: "pointer",
  color: "white", // White text
  "&:hover": {
    backgroundColor: "#00695C", // Darker teal on hover
  },
})

// Update the location dialog styling
const LocationDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    borderRadius: "8px",
    overflow: "hidden",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e0e0e0",
    backgroundColor: "#ffffff",
  },
})

const LocationDialogTitle = styled(DialogTitle)({
  padding: "16px 24px",
  fontSize: "20px",
  fontWeight: "600",
  color: "#333",
  borderBottom: "1px solid #f0f0f0",
})

const CurrentLocationButton = styled(Button)({
  color: "#00796b",
  borderColor: "#e0e0e0",
  borderRadius: "4px",
  padding: "12px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: "500",
  marginBottom: "16px",
  width: "100%",
  justifyContent: "center", // Center the text
  "& .MuiSvgIcon-root": {
    color: "#00796b",
    marginRight: "8px",
  },
  "&:hover": {
    backgroundColor: "rgba(0, 121, 107, 0.04)",
    borderColor: "#e0e0e0",
  },
})

const LocationListItem = styled(ListItem)({
  padding: "16px 24px",
  transition: "all 0.2s ease",
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  "&.selected": {
    backgroundColor: "#f5f5f5",
  },
})

const CancelButton = styled(Button)({
  color: "#00796b",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: "500",
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: "transparent",
    opacity: 0.8,
  },
})

const FindJobs = () => {
            // Add missing handler functions for location dialog and selection
            const handleLocationClick = () => {
              setIsLocationDialogOpen(true);
            };

            const handleLocationDialogClose = () => {
              setIsLocationDialogOpen(false);
            };

            const handleLocationSelect = (selectedLocation) => {
              setLocation(selectedLocation);
              setIsLocationDialogOpen(false);
            };

            const getCurrentLocation = () => {
              setIsGettingLocation(true);
              setNearbyLocations([]);

              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const { latitude, longitude } = position.coords;
                    // Dummy: just set a string for now
                    setLocation(`Lat: ${latitude}, Lon: ${longitude}`);
                    setIsGettingLocation(false);
                  },
                  (error) => {
                    setLocation("Location access denied");
                    setIsGettingLocation(false);
                  }
                );
              } else {
                setLocation("Geolocation not supported");
                setIsGettingLocation(false);
              }
            };
        // Add missing state for filters, sorting, and location
        const [selectedJobTypes, setSelectedJobTypes] = useState([]);
        const [selectedCategories, setSelectedCategories] = useState([]);
        const [salaryRange, setSalaryRange] = useState([0, 10]);
        const [sortBy, setSortBy] = useState("Most recent");
        const [jobTitle, setJobTitle] = useState("");
        const [location, setLocation] = useState("");
        const [showCategoriesFilter, setShowCategoriesFilter] = useState(true);
        const [expanded, setExpanded] = useState(false);
        const [fadeIn, setFadeIn] = useState(false);
        const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
        const [isGettingLocation, setIsGettingLocation] = useState(false);
        const [nearbyLocations, setNearbyLocations] = useState([]);
        const [locationSearch, setLocationSearch] = useState("");
        const popularLocations = [
          "Islamabad, Pakistan",
          "Lahore, Pakistan",
          "Karachi, Pakistan",
          "New York, USA",
          "London, UK",
          "Toronto, Canada",
          "Sydney, Australia",
        ];
    // --- Application Dialog State and Logic ---
    const { currentUser } = useAuth();
    const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
    const [applyJob, setApplyJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
    const [applying, setApplying] = useState(false);
    const [applyError, setApplyError] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [userApplications, setUserApplications] = useState([]);
    const [alreadyApplied, setAlreadyApplied] = useState(false);
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState("");
        // Fetch user resumes when dialog opens
        useEffect(() => {
          const fetchResumes = async () => {
            if (currentUser?.uid && isApplyDialogOpen) {
              try {
                const userResumes = await getAllResumeData();
                console.log('[FindJobs] Resumes fetched:', userResumes);
                setResumes(userResumes);
              } catch (err) {
                console.error('[FindJobs] Error fetching resumes:', err);
                setResumes([]);
              }
            } else {
              setResumes([]);
            }
          };
          fetchResumes();
        }, [currentUser, isApplyDialogOpen]);
    // Fetch user's applications on mount or when user changes
    useEffect(() => {
      const fetchUserApplications = async () => {
        if (currentUser?.uid) {
          try {
            const apps = await getApplicationsForUser(currentUser.uid);
            setUserApplications(apps);
          } catch {
            setUserApplications([]);
          }
        } else {
          setUserApplications([]);
        }
      };
      fetchUserApplications();
    }, [currentUser]);

    const handleOpenApplyDialog = async (job) => {
      setApplyJob(job);
      setIsApplyDialogOpen(true);
      setCoverLetter("");
      setApplyError("");
      setEmail("");
      setPhone("");
      setSelectedResumeId("");
      setGeneratingCoverLetter(false);
      
      // Check if user already applied to this job and fetch profile data
      if (currentUser) {
        try {
          const profile = await getUserProfileData();
          setEmail(profile.email || "");
          setPhone(profile.phone || "");
        } catch (err) {
          setEmail("");
          setPhone("");
        }
        // Check if already applied
        const hasApplied = userApplications.some(app => app.jobId === job.id);
        setAlreadyApplied(hasApplied);
      } else {
        setAlreadyApplied(false);
      }
    };

    // AI Cover Letter Generation Handler
    const handleGenerateCoverLetter = async () => {
      if (!applyJob) return;
      console.log("[FindJobs] Starting cover letter generation for job:", applyJob);
      setGeneratingCoverLetter(true);
      setApplyError("");
      try {
        // Fetch user profile data for complete cover letter
        let userName = currentUser?.displayName || "";
        let userEmail = email || "";
        let userPhone = phone || "";
        
        if (!userEmail || !userPhone) {
          try {
            const profile = await getUserProfileData();
            userName = profile?.displayName || profile?.name || userName;
            userEmail = userEmail || profile?.email || "";
            userPhone = userPhone || profile?.phone || "";
            console.log("[FindJobs] Fetched user profile:", { userName, userEmail, userPhone });
          } catch (err) {
            console.log("[FindJobs] Could not fetch profile, using available data");
          }
        }
        
        // Fetch user skills/experience from resume if available
        let userSkills = "";
        let userExperience = "";
        if (selectedResumeId && resumes.length > 0) {
          const selectedResume = resumes.find(r => r.id === selectedResumeId);
          userSkills = selectedResume?.skills?.join(", ") || "";
          userExperience = selectedResume?.summary || selectedResume?.experience || "";
          console.log("[FindJobs] Selected resume skills:", userSkills);
          console.log("[FindJobs] Selected resume experience:", userExperience);
        }
        
        console.log("[FindJobs] Calling generateCoverLetterAI with params:", {
          jobTitle: applyJob.title,
          company: applyJob.company,
          requirements: applyJob.requirements || applyJob.description || "",
          skills: userSkills,
          experience: userExperience,
          name: userName,
          email: userEmail,
          phone: userPhone,
        });
        
        const cover = await generateCoverLetterAI({
          jobTitle: applyJob.title,
          company: applyJob.company,
          requirements: applyJob.requirements || applyJob.description || "",
          skills: userSkills,
          experience: userExperience,
          name: userName,
          email: userEmail,
          phone: userPhone,
        });
        console.log("[FindJobs] Generated cover letter:", cover);
        setCoverLetter(cover);
        console.log("[FindJobs] Cover letter state updated successfully");
      } catch (err) {
        console.error("[FindJobs] Error generating cover letter:", err);
        setApplyError(err?.message || "Failed to generate cover letter. Try again.");
      } finally {
        setGeneratingCoverLetter(false);
      }
    };

    const handleCloseApplyDialog = () => {
      setIsApplyDialogOpen(false);
      setApplyJob(null);
      setCoverLetter("");
      setApplyError("");
      setEmail("");
      setPhone("");
    };

    const handleSubmitApplication = async () => {
      setApplying(true);
      setApplyError("");
      if (alreadyApplied) {
        setApplyError("You have already applied to this job.");
        setApplying(false);
        return;
      }
      if (!coverLetter || !email || !phone) {
        setApplyError("All fields are required.");
        setApplying(false);
        return;
      }
      if (!selectedResumeId) {
        setApplyError("Please select a resume to submit.");
        setApplying(false);
        return;
      }
      try {
        await submitApplication({
          jobId: applyJob.id,
          userId: currentUser.uid,
          coverLetter,
          email,
          phone,
          resumeId: selectedResumeId,
        });
        // Send confirmation email to applicant
        await sendCandidateEmail({
          to: email,
          subject: `Application Received for ${applyJob.title || "the job"}`,
          body: `Thank you for applying for the position of <b>${applyJob.title || "the job"}</b> at <b>${applyJob.company || "the company"}</b>.<br><br>Your application has been received. Our team will review your profile and contact you if you are shortlisted.`,
          company: applyJob.company || "Company",
          jobTitle: applyJob.title || "Job Title",
          candidateName: currentUser.displayName || email,
        });
        setIsApplyDialogOpen(false);
        setApplyJob(null);
        setCoverLetter("");
        setApplyError("");
        setEmail("");
        setPhone("");
        setSelectedResumeId("");
        // Refresh user applications
        const apps = await getApplicationsForUser(currentUser.uid);
        setUserApplications(apps);
      } catch (err) {
        setApplyError("Failed to submit application. Please try again.");
      } finally {
        setApplying(false);
      }
    };
            <Box>
              <TextField
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
                type="email"
              />
              <TextField
                label="Phone Number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                fullWidth
                margin="normal"
                required
                type="tel"
              />
              <TextField
                label="Cover Letter"
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                margin="normal"
                required
              />
              {applyError && <Typography color="error" mt={1}>{applyError}</Typography>}
            </Box>
  // Hero Section Functions removed (location, filters, etc.)

  // Firestore jobs state
  const [allJobs, setAllJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [jobsError, setJobsError] = useState("")
  // Saved jobs state
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [savingJobId, setSavingJobId] = useState("");
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Fetch jobs from Firestore on mount
  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      setJobsError("");
      try {
        const jobsSnapshot = await getDocs(collection(db, "jobs"));
        const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllJobs(jobs);
      } catch (err) {
        setJobsError("Failed to load jobs from database.");
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  // Fetch saved jobs for user
  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (currentUser?.uid) {
        try {
          const ids = await getSavedJobsForUser(currentUser.uid);
          setSavedJobIds(ids);
        } catch {}
      } else {
        setSavedJobIds([]);
      }
    };
    fetchSavedJobs();
  }, [currentUser]);
  // Save/Unsave job handlers
  const handleSaveJob = async (jobId) => {
    if (!currentUser?.uid) return;
    setSavingJobId(jobId);
    try {
      await saveJob({ jobId, userId: currentUser.uid });
      setSavedJobIds((prev) => [...prev, jobId]);
    } finally {
      setSavingJobId("");
    }
  };
  const handleUnsaveJob = async (jobId) => {
    if (!currentUser?.uid) return;
    setSavingJobId(jobId);
    try {
      await unsaveJob({ jobId, userId: currentUser.uid });
      setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
    } finally {
      setSavingJobId("");
    }
  };

  // Filter jobs based on search criteria
  useEffect(() => {
    let jobs = allJobs.filter((job) => job.status !== 'Paused');
    
    // Filter by job title/keyword search
    if (jobTitle.trim()) {
      jobs = jobs.filter((job) => 
        (job.title && job.title.toLowerCase().includes(jobTitle.toLowerCase())) ||
        (job.description && job.description.toLowerCase().includes(jobTitle.toLowerCase())) ||
        (job.company && job.company.toLowerCase().includes(jobTitle.toLowerCase()))
      );
    }
    
    // Filter by location
    if (location.trim()) {
      jobs = jobs.filter((job) => 
        job.location && job.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Filter by job type
    if (selectedJobTypes.length > 0) {
      jobs = jobs.filter((job) => 
        selectedJobTypes.includes(job.jobType) || selectedJobTypes.includes(job.type)
      );
    }
    
    // Filter by category
    if (selectedCategories.length > 0) {
      jobs = jobs.filter((job) => 
        selectedCategories.includes(job.category)
      );
    }
    
    // Filter by salary range
    if (salaryRange[0] > 0 || salaryRange[1] < 10) {
      jobs = jobs.filter((job) => {
        if (!job.salary) return false;
        const salaryStr = job.salary.toString();
        const salaryAmount = parseInt(salaryStr.split('/')[0].replace(/[^0-9]/g, ''));
        return salaryAmount >= salaryRange[0] * 1000 && salaryAmount <= salaryRange[1] * 1000;
      });
    }
    
    // Filter by saved jobs if needed
    if (showSavedOnly) {
      jobs = jobs.filter((job) => savedJobIds.includes(job.id));
    }
    
    setFilteredJobs(jobs);
  }, [allJobs, showSavedOnly, savedJobIds, jobTitle, location, selectedJobTypes, selectedCategories, salaryRange]);

  // Handle job type checkbox change
  const handleJobTypeChange = (type) => {
    if (selectedJobTypes.includes(type)) {
      setSelectedJobTypes(selectedJobTypes.filter((t) => t !== type))
    } else {
      setSelectedJobTypes([...selectedJobTypes, type])
    }
  }

  // Handle category checkbox change
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  // Handle salary range change
  const handleSalaryChange = (event, newValue) => {
    setSalaryRange(newValue)
  }

  // Clear all filters
  const handleClearAll = () => {
    setSelectedJobTypes([])
    setSelectedCategories([])
    setSalaryRange([0, 10])
    setJobTitle("")
    setLocation("")
  }

  // Handle "Find More Jobs" button click
  const handleFindMoreJobs = () => {
    setExpanded(true)
    // Trigger fade-in animation after expansion
    setTimeout(() => {
      setFadeIn(true)
    }, 100)
  }

  // Handle "Collapse" button click
  const handleCollapse = () => {
    setFadeIn(false)
    // Wait for fade-out animation to complete before collapsing
    setTimeout(() => {
      setExpanded(false)
      // Scroll back to top of job listings
      window.scrollTo({
        top: document.getElementById("job-listings").offsetTop - 100,
        behavior: "smooth",
      })
    }, 300)
  }

  // Reset fadeIn when expanded changes
  useEffect(() => {
    if (!expanded) {
      setFadeIn(false)
    }
  }, [expanded])

  // Get initial and additional jobs based on expanded state
  const initialJobs = filteredJobs.slice(0, 6)
  const additionalJobs = filteredJobs.slice(6)

  // Styled component for filter titles
  const FilterTitle = styled(Typography)({
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "12px",
    marginTop: "20px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  })

  // Update the handleSearch function
  const handleSearch = () => {
    // The filtering is already handled by the useEffect
  }


  // State for job details modal
  const [selectedJob, setSelectedJob] = useState(null)
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false)


  // Open job details modal
  const handleJobCardClick = (job) => {
    setSelectedJob(job)
    setIsJobDialogOpen(true)
  }

  // Close job details modal
  const handleJobDialogClose = () => {
    setIsJobDialogOpen(false)
    setSelectedJob(null)
  }



  return (
    <PageContainer>
      <style>{fadeInKeyframes}</style>
      <Navbar/>

      {/* Hero Section */}
      <HeroContainer>
        <Container>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, fontSize: { xs: "2.5rem", md: "3.5rem" } }}
          >
            Find Your Dream Job Easy &<br />
            Fast with CareerCatalyst
          </Typography>

          <Typography variant="subtitle1" sx={{ maxWidth: "700px", margin: "0 auto", mb: 4, opacity: 0.9 }}>
            Search and find your dream job is now easier than
            <br />
            ever you just browse and find job if you need it
          </Typography>

          {/* Search container with explicit order */}
          <SearchContainer>
            {/* 1. Search Input - First position */}
            <SearchInput
              placeholder="Job Title or Keyword"
              variant="outlined"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#757575" }} />
                  </InputAdornment>
                ),
                sx: {
                  "& input::placeholder": {
                    color: "#9e9e9e", // lighter gray for placeholder
                    opacity: 1,
                  },
                  color: "#000", // actual input text color
                },
              }}
            />

            {/* 2. Location Input - Middle position */}
            <LocationInput
              placeholder="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={handleLocationClick}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon sx={{ color: "#757575" }} />
                  </InputAdornment>
                ),
                sx: {
                  "& input::placeholder": {
                    color: "#9e9e9e",
                    opacity: 1,
                  },
                  color: "#000",
                },
              }}
            />

            {/* 3. Search Button - Last position */}
            <SearchButton variant="contained" onClick={handleSearch}>
              Search
            </SearchButton>
          </SearchContainer>

          <Button href="/scrap" target="_self" rel="noopener" variant="outlined" sx={{ mt: 2, mb: 1 }}>
            Scrape Jobs
          </Button>

          <Typography variant="body2" sx={{ mt: 3, fontStyle: "italic", opacity: 0.8 }}>
            • Popular Search: UI, Software Engineer
          </Typography>
        </Container>

        {/* Location Dialog */}
        <LocationDialog open={isLocationDialogOpen} onClose={handleLocationDialogClose} maxWidth="xs" fullWidth>
          <LocationDialogTitle>Choose Location</LocationDialogTitle>
          <DialogContent sx={{ p: 0, pt: 2, backgroundColor: "#ffffff" }}>
            <Box sx={{ p: "0 24px" }}>
              {/* Search/Type Location Input */}
              <TextField
                placeholder="Type or search location"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#00796b",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00796b",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon sx={{ color: "#00796b" }} />
                    </InputAdornment>
                  ),
                }}
                autoFocus
              />

              <CurrentLocationButton
                startIcon={isGettingLocation ? <CircularProgress size={20} color="inherit" /> : <MyLocationIcon />}
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                variant="outlined"
              >
                {isGettingLocation ? "Getting your location..." : "Use my current location"}
              </CurrentLocationButton>
            </Box>

            <Typography variant="subtitle2" sx={{ px: 3, mb: 1, fontWeight: 600, color: "#333", mt: 2 }}>
              {locationSearch ? "Filtered Locations" : "Popular Locations"}
            </Typography>
            <List disablePadding>
              {popularLocations
                .filter((loc) =>
                  locationSearch === "" ||
                  loc.toLowerCase().includes(locationSearch.toLowerCase())
                )
                .map((loc) => (
                  <LocationListItem
                    button
                    key={loc}
                    onClick={() => handleLocationSelect(loc)}
                    className={location === loc ? "selected" : ""}
                    sx={{
                      backgroundColor: location === loc ? "#f5f5f5" : "transparent",
                    }}
                  >
                    <ListItemText primary={loc} sx={{ "& .MuiTypography-root": { color: "#333" } }} />
                  </LocationListItem>
                ))}
              
              {/* If user typed something not in popular locations, show custom option */}
              {locationSearch && !popularLocations.some(loc => loc.toLowerCase() === locationSearch.toLowerCase()) && (
                <LocationListItem
                  button
                  onClick={() => {
                    setLocation(locationSearch);
                    setLocationSearch("");
                    setIsLocationDialogOpen(false);
                  }}
                  sx={{
                    backgroundColor: "#f0f7f6",
                    borderTop: "1px solid #e0e0e0",
                  }}
                >
                  <ListItemText 
                    primary={`Use "${locationSearch}"`} 
                    sx={{ "& .MuiTypography-root": { color: "#00796b", fontWeight: 600 } }} 
                  />
                </LocationListItem>
              )}
            </List>
          </DialogContent>
          <DialogActions
            sx={{ justifyContent: "space-between", p: 2, borderTop: "1px solid #f0f0f0", backgroundColor: "#ffffff" }}
          >
            <CancelButton onClick={() => {
              setLocationSearch("");
              handleLocationDialogClose();
            }}>Cancel</CancelButton>
          </DialogActions>
        </LocationDialog>
      </HeroContainer>

      {/* Main Content */}
      <ContentContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <SectionTitle>Recommended Jobs</SectionTitle>
          <Button
            variant={showSavedOnly ? "contained" : "outlined"}
            color="success"
            onClick={() => setShowSavedOnly((prev) => !prev)}
            sx={{ minWidth: 120, ml: 2 }}
          >
            {showSavedOnly ? "Show All" : "Show Saved"}
          </Button>
          <Box sx={{ position: "relative" }}>
            <SortButton
              endIcon={<KeyboardArrowDownIcon />}
              onClick={(e) => {
                const menu = document.getElementById("sort-menu")
                if (menu.style.display === "none" || menu.style.display === "") {
                  menu.style.display = "block"
                } else {
                  menu.style.display = "none"
                }
              }}
            >
              {sortBy}
            </SortButton>
            <SortMenu id="sort-menu">
              <SortMenuItem
                sx={{
                  fontWeight: sortBy === "Most recent" ? "bold" : "normal",
                  backgroundColor: sortBy === "Most recent" ? "#00695C" : "transparent",
                }}
                onClick={() => {
                  setSortBy("Most recent")
                  document.getElementById("sort-menu").style.display = "none"
                }}
              >
                Most recent
              </SortMenuItem>
              <SortMenuItem
                sx={{
                  fontWeight: sortBy === "Highest salary" ? "bold" : "normal",
                  backgroundColor: sortBy === "Highest salary" ? "#00695C" : "transparent",
                }}
                onClick={() => {
                  setSortBy("Highest salary")
                  document.getElementById("sort-menu").style.display = "none"
                }}
              >
                Highest salary
              </SortMenuItem>
              <SortMenuItem
                sx={{
                  fontWeight: sortBy === "Lowest salary" ? "bold" : "normal",
                  backgroundColor: sortBy === "Lowest salary" ? "#00695C" : "transparent",
                }}
                onClick={() => {
                  setSortBy("Lowest salary")
                  document.getElementById("sort-menu").style.display = "none"
                }}
              >
                Lowest salary
              </SortMenuItem>
            </SortMenu>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 0 }}>
          {/* Filters */}
          <Box sx={{ width: "280px", flexShrink: 0 }}>
            <FilterContainer>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Filters
                </Typography>
                <ClearAllButton onClick={handleClearAll}>clear all</ClearAllButton>
              </Box>

              {/* Location Filter */}
              <FilterTitle sx={{ mt: 0, mb: 1 }}>Location</FilterTitle>
              <TextField
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
                size="small"
                variant="outlined"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00A389",
                    },
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    color: "rgba(255, 255, 255, 0.7)",
                    opacity: 1,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon sx={{ color: "#00A389", mr: 1 }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Job Type Filter */}
              <FilterTitle sx={{ mt: 2 }}>Job Type</FilterTitle>

              {/* Job Type Filter with white tick */}
              <FormGroup>
                {jobTypes.map((type) => (
                  <FilterCheckbox
                    key={type}
                    control={
                      <CustomCheckbox
                        checked={selectedJobTypes.includes(type)}
                        onChange={() => handleJobTypeChange(type)}
                        icon={
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              border: "1px solid white",
                              borderRadius: 1,
                            }}
                          />
                        }
                        checkedIcon={
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              border: "1px solid white",
                              borderRadius: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#00A389",
                            }}
                          >
                            <CheckIcon sx={{ fontSize: 14, color: "white" }} />
                          </Box>
                        }
                      />
                    }
                    label={type}
                  />
                ))}
              </FormGroup>

              {/* Salary Range Filter */}
              <FilterTitle sx={{ mt: 3 }}>Salary Range</FilterTitle>
              <Slider
                value={salaryRange}
                onChange={handleSalaryChange}
                min={0}
                max={10}
                step={0.5}
                sx={{
                  color: "#00A389",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "white",
                    border: "2px solid #00A389",
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              />
              <SalaryFilterText>
                <span>${salaryRange[0]}k</span>
                <span>${salaryRange[1]}k</span>
              </SalaryFilterText>

              {/* Job Categories Filter with white tick */}
              <FilterTitle sx={{ mt: 3 }} onClick={() => setShowCategoriesFilter(!showCategoriesFilter)}>
                Job Categories
                {showCategoriesFilter ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </FilterTitle>
              {showCategoriesFilter && (
                <FormGroup>
                  {jobCategories.map((category) => (
                    <FilterCheckbox
                      key={category}
                      control={
                        <CustomCheckbox
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          icon={
                            <Box
                              sx={{
                                width: 18,
                                height: 18,
                                border: "1px solid white",
                                borderRadius: 1,
                              }}
                            />
                          }
                          checkedIcon={
                            <Box
                              sx={{
                                width: 18,
                                height: 18,
                                border: "1px solid white",
                                borderRadius: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#00A389",
                              }}
                            >
                              <CheckIcon sx={{ fontSize: 14, color: "white" }} />
                            </Box>
                          }
                        />
                      }
                      label={category}
                    />
                  ))}
                </FormGroup>
              )}
            </FilterContainer>
          </Box>

          {/* Job Listings - Right next to filter menu */}
          <Box sx={{ flex: 1, pl: 3 }} id="job-listings">
            {/* Initial jobs (always visible) */}
            {loadingJobs ? (
              <Box sx={{ width: "100%", textAlign: "center", py: 10 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>Loading jobs...</Typography>
              </Box>
            ) : jobsError ? (
              <Box sx={{ width: "100%", textAlign: "center", py: 10 }}>
                <Typography variant="h5" sx={{ color: "#000000", fontWeight: "bold", mb: 2 }}>
                  {jobsError}
                </Typography>
              </Box>
            ) : filteredJobs.length > 0 ? ( 
              <GridContainer>
                {filteredJobs.map((job, index) => (
                  <AnimatedContainer key={job.id || index} delay={index * 100}>
                    <JobCard onClick={() => handleJobCardClick(job)} sx={{ cursor: 'pointer' }}>
                      <StyledCardContent>
                        <CompanySection>
                          <CompanyLogo>{(job.company && job.company[0]) || '?'}</CompanyLogo>
                          <CompanyInfo>
                            <CompanyName>{job.company || 'Unknown Company'}</CompanyName>
                            <LocationText>{job.location || 'Unknown Location'}</LocationText>
                          </CompanyInfo>
                        </CompanySection>

                        <JobTitle>{job.title || 'Untitled Job'}</JobTitle>
                        <JobTypeText>{job.jobType || job.type || ''}</JobTypeText>

                        <ApplicationStatus>
                          {job.applicants !== undefined ? job.applicants : '—'} {job.capacity ? <span>of {job.capacity}</span> : null}
                        </ApplicationStatus>

                        <SalaryText>
                          {job.salary ? (job.salary.toString().split('/')[0]) : '—'}
                          <span>/{job.salary ? (job.salary.toString().split('/')[1] || '') : ''}</span>
                        </SalaryText>
                      </StyledCardContent>

                      <ButtonContainer>
                        <ApplyButton onClick={(e) => { e.stopPropagation(); handleOpenApplyDialog(job); }}>Apply Now</ApplyButton>
                        <IconButton
                          aria-label={savedJobIds.includes(job.id) ? "Unsave job" : "Save job"}
                          onClick={(e) => {
                            e.stopPropagation();
                            savedJobIds.includes(job.id)
                              ? handleUnsaveJob(job.id)
                              : handleSaveJob(job.id);
                          }}
                          disabled={savingJobId === job.id}
                          sx={{ color: savedJobIds.includes(job.id) ? "#00A389" : "#BDBDBD" }}
                        >
                          {savedJobIds.includes(job.id) ? (
                            <FavoriteIcon />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                      </ButtonContainer>
                    </JobCard>
                  </AnimatedContainer>
                ))}
              </GridContainer>
            ) : allJobs.length === 0 ? ( 
              <Box sx={{ width: "100%", textAlign: "center", py: 10 }}>
                <Typography variant="h5" sx={{ color: "#000000", fontWeight: "bold", mb: 2 }}>
                  No jobs found in the database.
                </Typography>
                <Typography variant="body1" sx={{ color: "#000000", mb: 3 }}>
                  No jobs were fetched from Firestore. Try posting a job from the employer dashboard first.
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  textAlign: "center",
                  py: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h5" sx={{ color: "#000000", fontWeight: "bold", mb: 2 }}>
                  No jobs found matching your criteria
                </Typography>
                <Typography variant="body1" sx={{ color: "#000000", mb: 3 }}>
                  Try adjusting your filters or search terms
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleClearAll}
                  sx={{
                    backgroundColor: "#004D40",
                    "&:hover": { backgroundColor: "#00695C" },
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
            )}

            {/* Additional jobs (shown/hidden based on expanded state) */}
            {additionalJobs.length > 0 && (
              <Collapse in={expanded} timeout={500} style={{ width: "100%" }}>
                <Fade in={fadeIn} timeout={800}>
                  <GridContainer>
                    {additionalJobs.map((job, index) => (
                      <AnimatedContainer key={job.id || index + 6} delay={index * 100}>
                        <JobCard>
                          <StyledCardContent>
                            <CompanySection>
                              <CompanyLogo>{(job.company && job.company[0]) || '?'}</CompanyLogo>
                              <CompanyInfo>
                                <CompanyName>{job.company || 'Unknown Company'}</CompanyName>
                                <LocationText>{job.location || 'Unknown Location'}</LocationText>
                              </CompanyInfo>
                            </CompanySection>

                            <JobTitle>{job.title || 'Untitled Job'}</JobTitle>
                            <JobTypeText>{job.jobType || job.type || ''}</JobTypeText>

                            <ApplicationStatus>
                              {job.applicants ? job.applicants : ''} {job.capacity ? <span>of {job.capacity}</span> : null}
                            </ApplicationStatus>

                            <SalaryText>
                              {(job.salary || '').toString().split('/')[0]}
                              <span>/{(job.salary || '').toString().split('/')[1] || ''}</span>
                            </SalaryText>
                          </StyledCardContent>

                          <ButtonContainer>
                            <ApplyButton onClick={(e) => { e.stopPropagation(); handleOpenApplyDialog(job); }}>Apply Now</ApplyButton>
                            <IconButton
                              aria-label={savedJobIds.includes(job.id) ? "Unsave job" : "Save job"}
                              onClick={(e) => {
                                e.stopPropagation();
                                savedJobIds.includes(job.id)
                                  ? handleUnsaveJob(job.id)
                                  : handleSaveJob(job.id);
                              }}
                              disabled={savingJobId === job.id}
                              sx={{ color: savedJobIds.includes(job.id) ? "#00A389" : "#BDBDBD" }}
                            >
                              {savedJobIds.includes(job.id) ? (
                                <FavoriteIcon />
                              ) : (
                                <FavoriteBorderIcon />
                              )}
                            </IconButton>
                          </ButtonContainer>
                        </JobCard>
                      </AnimatedContainer>
                    ))}
                  </GridContainer>
                </Fade>
              </Collapse>
            )}

            {/* Action buttons - Moved inside the job listings container */}
            {filteredJobs.length > 6 && (
              <ActionButtonsContainer id="action-buttons">
                {!expanded ? (
                  <ActionButton variant="outlined" onClick={handleFindMoreJobs}>
                    Find More Jobs <ExpandMoreIcon />
                  </ActionButton>
                ) : (
                  <ActionButton variant="contained" onClick={handleCollapse}>
                    Collapse <ExpandLessIcon />
                  </ActionButton>
                )}
              </ActionButtonsContainer>
            )}
          </Box>
        </Box>
      </ContentContainer>


      {/* Application Dialog */}
      <Dialog open={isApplyDialogOpen} onClose={handleCloseApplyDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for {applyJob?.title || "Job"}</DialogTitle>
        <DialogContent dividers>
          {applyJob && (
            <Box>
              <Typography variant="subtitle1" gutterBottom><b>Company:</b> {applyJob.company}</Typography>
              <Typography variant="subtitle1" gutterBottom><b>Location:</b> {applyJob.location}</Typography>
              <Typography variant="subtitle1" gutterBottom><b>Job Type:</b> {applyJob.jobType || applyJob.type}</Typography>
            </Box>
          )}
          <Box mt={2}>
            <TextField
              label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              type="email"
            />
            <TextField
              label="Phone Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              fullWidth
              margin="normal"
              required
              type="tel"
            />
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                label="Cover Letter"
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                margin="normal"
                required
              />
              <Button
                variant="outlined"
                onClick={handleGenerateCoverLetter}
                disabled={generatingCoverLetter || !applyJob}
                sx={{ minWidth: 160 }}
              >
                {generatingCoverLetter ? "Generating..." : "AI Generate"}
              </Button>
            </Box>
            {/* Resume selection dropdown */}
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>Select Resume</Typography>
              {resumes.length === 0 ? (
                <Typography color="text.secondary">No resumes found. Please create a resume in the Resume Builder first.</Typography>
              ) : (
                <TextField
                  select
                  label="Resume"
                  value={selectedResumeId}
                  onChange={e => setSelectedResumeId(e.target.value)}
                  fullWidth
                  SelectProps={{ native: true }}
                  margin="normal"
                  required
                >
                  <option value="">Select a resume</option>
                  {resumes.map(resume => (
                    <option key={resume.id} value={resume.id}>
                      {resume.title || resume.name || `Resume (${resume.id?.slice(-4)})`}
                    </option>
                  ))}
                </TextField>
              )}
            </Box>
            {applyError && <Typography color="error" mt={1}>{applyError}</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApplyDialog} disabled={applying}>Cancel</Button>
          <Button onClick={handleSubmitApplication} variant="contained" color="primary" disabled={applying || alreadyApplied}>
            {alreadyApplied ? "Already Applied" : (applying ? "Applying..." : "Submit Application")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Job Details Modal */}
      <Dialog open={isJobDialogOpen} onClose={handleJobDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent dividers>
          {selectedJob && (
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>{selectedJob.title}</Typography>
              <Typography variant="subtitle1" gutterBottom><b>Company:</b> {selectedJob.company}</Typography>
              <Typography variant="subtitle1" gutterBottom><b>Location:</b> {selectedJob.location}</Typography>
              <Typography variant="subtitle1" gutterBottom><b>Job Type:</b> {selectedJob.jobType || selectedJob.type}</Typography>
              {selectedJob.experience && (
                <Typography variant="subtitle1" gutterBottom><b>Experience:</b> {selectedJob.experience}</Typography>
              )}
              {selectedJob.salary && (
                <Typography variant="subtitle1" gutterBottom><b>Salary:</b> {selectedJob.salary}</Typography>
              )}
              {selectedJob.description && (
                <Typography variant="body1" gutterBottom><b>Description:</b> {selectedJob.description}</Typography>
              )}
              {selectedJob.requirements && (
                <Typography variant="body1" gutterBottom><b>Requirements:</b> {selectedJob.requirements}</Typography>
              )}
              {selectedJob.skills && Array.isArray(selectedJob.skills) && (
                <Box mb={2}>
                  <Typography variant="subtitle1" gutterBottom><b>Skills:</b></Typography>
                  <ul style={{ marginTop: 0 }}>
                    {selectedJob.skills.map((skill, idx) => (
                      <li key={idx}><Typography variant="body2">{skill}</Typography></li>
                    ))}
                  </ul>
                </Box>
              )}
              {selectedJob.employerId && (
                <Typography variant="body2" gutterBottom><b>Employer ID:</b> {selectedJob.employerId}</Typography>
              )}
              {selectedJob.postedAt && (
                <Typography variant="body2" gutterBottom><b>Posted At:</b> {new Date(selectedJob.postedAt).toLocaleString()}</Typography>
              )}
              {/* Show any other fields dynamically */}
              {Object.entries(selectedJob).map(([key, value]) => {
                if (["title","company","location","jobType","type","experience","salary","description","requirements","skills","employerId","postedAt","id","applicants","capacity"].includes(key)) return null;
                return (
                  <Typography variant="body2" gutterBottom key={key}><b>{key}:</b> {typeof value === 'object' ? JSON.stringify(value) : String(value)}</Typography>
                );
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleJobDialogClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Footer */}
      <Footer />
    </PageContainer>
  )
}

export default FindJobs
