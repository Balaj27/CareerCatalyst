import { useState, useEffect } from "react"
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
} from "@mui/material"
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
  // State for search inputs
  const [jobTitle, setJobTitle] = useState("")
  const [location, setLocation] = useState("")

  // State for filters - No filters applied by default
  const [selectedJobTypes, setSelectedJobTypes] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [salaryRange, setSalaryRange] = useState([0, 10]) // Full range
  const [showCategoriesFilter, setShowCategoriesFilter] = useState(true)

  // State for sorting
  const [sortBy, setSortBy] = useState("Most recent")

  // State for expanded jobs
  const [expanded, setExpanded] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)

  // State for location dialog
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [nearbyLocations, setNearbyLocations] = useState([])

  // Popular locations
  const popularLocations = [
    "Islamabad, Pakistan",
    "Lahore, Pakistan",
    "Karachi, Pakistan",
    "New York, USA",
    "London, UK",
    "Toronto, Canada",
    "Sydney, Australia",
  ]

  // Hero Section Functions
  const handleLocationClick = () => {
    setIsLocationDialogOpen(true)
  }

  const handleLocationDialogClose = () => {
    setIsLocationDialogOpen(false)
  }

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation)
    setIsLocationDialogOpen(false)
  }

  const getNearbyLocations = async (latitude, longitude) => {
    try {
      // Get the main location
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
      )
      const data = await response.json()

      let mainLocation = "Unknown Location"
      if (data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.county
        const country = data.address.country
        if (city && country) {
          mainLocation = `${city}, ${country}`
        }
      }

      // Set the main location
      setLocation(mainLocation)

      // Get nearby locations
      const nearbyResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=cities+near&lat=${latitude}&lon=${longitude}&addressdetails=1&limit=5`,
      )
      const nearbyData = await nearbyResponse.json()

      const locations = nearbyData
        .map((item) => {
          const city = item.address?.city || item.address?.town || item.address?.village || item.address?.county
          const country = item.address?.country
          if (city && country) {
            return `${city}, ${country}`
          }
          return null
        })
        .filter(Boolean)
        .filter((loc) => loc !== mainLocation) // Remove the main location from nearby

      setNearbyLocations(locations)
    } catch (error) {
      console.error("Error getting location data:", error)
      setNearbyLocations([])
    }
  }

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    setNearbyLocations([])

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          getNearbyLocations(latitude, longitude).finally(() => {
            setIsGettingLocation(false)
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocation("Location access denied")
          setIsGettingLocation(false)
        },
      )
    } else {
      setLocation("Geolocation not supported")
      setIsGettingLocation(false)
    }
  }

  // All jobs data (9 jobs total - 6 initial + 3 more)
  const allJobs = [
    {
      title: "Visual Designer",
      company: "Facebook",
      location: "Remote",
      type: "Full-Time",
      applicants: "10 Applied",
      capacity: "30 Capacity",
      salary: "$2000/month",
      logo: <FacebookIcon />,
      color: "#1877F2", // Facebook blue
      categories: ["Design & Development"],
      jobType: "Full Time",
    },
    {
      title: "Product Designer",
      company: "Google",
      location: "Remote",
      type: "Full-Time",
      applicants: "15 Applied",
      capacity: "25 Capacity",
      salary: "$2500/month",
      logo: <GoogleIcon />,
      color: "#4285F4", // Google blue
      categories: ["Design & Development"],
      jobType: "Full Time",
    },
    {
      title: "UI/UX Designer",
      company: "Twitter",
      location: "Remote",
      type: "Full-Time",
      applicants: "8 Applied",
      capacity: "20 Capacity",
      salary: "$1800/month",
      logo: <TwitterIcon />,
      color: "#1DA1F2", // Twitter blue
      categories: ["Design & Development"],
      jobType: "Full Time",
    },
    {
      title: "Frontend Developer",
      company: "Microsoft",
      location: "Remote",
      type: "Full-Time",
      applicants: "20 Applied",
      capacity: "40 Capacity",
      salary: "$2200/month",
      logo: <WindowIcon />,
      color: "#00A4EF", // Microsoft blue
      categories: ["Design & Development"],
      jobType: "Full Time",
    },
    {
      title: "Backend Developer",
      company: "Amazon",
      location: "Remote",
      type: "Full-Time",
      applicants: "12 Applied",
      capacity: "35 Capacity",
      salary: "$2300/month",
      logo: <LocalShippingIcon />,
      color: "#FF9900", // Amazon orange
      categories: ["Design & Development"],
      jobType: "Full Time",
    },
    {
      title: "Full Stack Developer",
      company: "Apple",
      location: "Remote",
      type: "Full-Time",
      applicants: "25 Applied",
      capacity: "30 Capacity",
      salary: "$2800/month",
      logo: <AppleIcon />,
      color: "#A2AAAD", // Apple silver
      categories: ["Design & Development"],
      jobType: "Full Time",
    },
    // Additional jobs for all categories
    {
      title: "E-commerce Specialist",
      company: "Shopify",
      location: "Remote",
      type: "Part-Time",
      applicants: "18 Applied",
      capacity: "25 Capacity",
      salary: "$2400/month",
      logo: <ShoppingCartIcon />,
      color: "#7AB55C", // Shopify green
      categories: ["Marketing & Communication"],
      jobType: "Part Time",
    },
    {
      title: "Data Analyst",
      company: "Netflix",
      location: "Remote",
      type: "Full-Time",
      applicants: "22 Applied",
      capacity: "30 Capacity",
      salary: "$2600/month",
      logo: <MovieIcon />,
      color: "#E50914", // Netflix red
      categories: ["Finance"],
      jobType: "Full Time",
    },
    {
      title: "Photographer",
      company: "Instagram",
      location: "Remote",
      type: "Part-Time",
      applicants: "15 Applied",
      capacity: "20 Capacity",
      salary: "$1900/month",
      logo: <CameraIcon />,
      color: "#C13584", // Instagram purple
      categories: ["Marketing & Communication"],
      jobType: "Part Time",
    },
    // New jobs for remaining categories
    {
      title: "HR Manager",
      company: "LinkedIn",
      location: "Remote",
      type: "Full-Time",
      applicants: "14 Applied",
      capacity: "25 Capacity",
      salary: "$3200/month",
      logo: <PeopleIcon />,
      color: "#0077B5", // LinkedIn blue
      categories: ["Human Research"],
      jobType: "Full Time",
    },
    {
      title: "Security Analyst",
      company: "Cisco",
      location: "Remote",
      type: "Full-Time",
      applicants: "9 Applied",
      capacity: "15 Capacity",
      salary: "$3500/month",
      logo: <SecurityIcon />,
      color: "#1BA0D7", // Cisco blue
      categories: ["Armforce Guide & Security"],
      jobType: "Full Time",
    },
    {
      title: "Business Consultant",
      company: "Deloitte",
      location: "Remote",
      type: "Full-Time",
      applicants: "17 Applied",
      capacity: "30 Capacity",
      salary: "$4000/month",
      logo: <BusinessCenterIcon />,
      color: "#86BC25", // Deloitte green
      categories: ["Business & Consulting"],
      jobType: "Full Time",
    },
    {
      title: "Customer Support Specialist",
      company: "Zendesk",
      location: "Remote",
      type: "Full-Time",
      applicants: "11 Applied",
      capacity: "20 Capacity",
      salary: "$2100/month",
      logo: <HeadsetMicIcon />,
      color: "#03363D", // Zendesk dark
      categories: ["Customer Care & Support"],
      jobType: "Full Time",
    },
    {
      title: "Project Manager",
      company: "Asana",
      location: "Remote",
      type: "Full-Time",
      applicants: "16 Applied",
      capacity: "25 Capacity",
      salary: "$3800/month",
      logo: <AssignmentIcon />,
      color: "#F06A6A", // Asana red
      categories: ["Project Management"],
      jobType: "Full Time",
    },
    {
      title: "Financial Analyst",
      company: "JP Morgan",
      location: "Remote",
      type: "Full-Time",
      applicants: "19 Applied",
      capacity: "30 Capacity",
      salary: "$3600/month",
      logo: <AccountBalanceIcon />,
      color: "#2E3F8F", // JP Morgan blue
      categories: ["Finance"],
      jobType: "Full Time",
    },
    {
      title: "Marketing Intern",
      company: "Spotify",
      location: "Remote",
      type: "Internship",
      applicants: "25 Applied",
      capacity: "40 Capacity",
      salary: "$1500/month",
      logo: <CampaignIcon />,
      color: "#1DB954", // Spotify green
      categories: ["Marketing & Communication"],
      jobType: "Internship",
    },
  ]

  // Apply filters
  const [filteredJobs, setFilteredJobs] = useState(allJobs)

  // Apply filters
  useEffect(() => {
    let filtered = [...allJobs]

    // Filter by job type
    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter((job) => selectedJobTypes.includes(job.jobType))
    }

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((job) => job.categories.some((category) => selectedCategories.includes(category)))
    }

    // Filter by salary
    filtered = filtered.filter((job) => {
      const salaryValue = Number.parseInt(job.salary.replace(/[^0-9]/g, ""))
      return salaryValue >= salaryRange[0] * 1000 && salaryValue <= salaryRange[1] * 1000
    })

    // Filter by search
    if (jobTitle) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(jobTitle.toLowerCase()) ||
          job.company.toLowerCase().includes(jobTitle.toLowerCase()),
      )
    }

    // Filter by location
    if (location) {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(location.toLowerCase()))
    }

    // Sort jobs
    if (sortBy === "Most recent") {
      // Keep original order for now
    } else if (sortBy === "Highest salary") {
      filtered.sort((a, b) => {
        const salaryA = Number.parseInt(a.salary.replace(/[^0-9]/g, ""))
        const salaryB = Number.parseInt(b.salary.replace(/[^0-9]/g, ""))
        return salaryB - salaryA
      })
    } else if (sortBy === "Lowest salary") {
      filtered.sort((a, b) => {
        const salaryA = Number.parseInt(a.salary.replace(/[^0-9]/g, ""))
        const salaryB = Number.parseInt(b.salary.replace(/[^0-9]/g, ""))
        return salaryA - salaryB
      })
    }

    setFilteredJobs(filtered)
  }, [selectedJobTypes, selectedCategories, salaryRange, jobTitle, location, sortBy])

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
              onClick={handleLocationClick}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon sx={{ color: "#757575" }} />
                  </InputAdornment>
                ),
                readOnly: true,
                style: { cursor: "pointer" },
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
              <CurrentLocationButton
                startIcon={isGettingLocation ? <CircularProgress size={20} color="inherit" /> : <MyLocationIcon />}
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                variant="outlined"
              >
                {isGettingLocation ? "Getting your location..." : "Use my current location"}
              </CurrentLocationButton>
            </Box>

            <Typography variant="subtitle2" sx={{ px: 3, mb: 1, fontWeight: 600, color: "#333" }}>
              Popular Locations
            </Typography>
            <List disablePadding>
              {popularLocations.map((loc) => (
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
            </List>
          </DialogContent>
          <DialogActions
            sx={{ justifyContent: "flex-end", p: 2, borderTop: "1px solid #f0f0f0", backgroundColor: "#ffffff" }}
          >
            <CancelButton onClick={handleLocationDialogClose}>Cancel</CancelButton>
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
                  Job Type
                </Typography>
                <ClearAllButton onClick={handleClearAll}>clear all</ClearAllButton>
              </Box>

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
            {filteredJobs.length > 0 ? (
              <GridContainer>
                {initialJobs.map((job, index) => (
                  <AnimatedContainer key={index} delay={index * 100}>
                    <JobCard>
                      <StyledCardContent>
                        <CompanySection>
                          <CompanyLogo bgcolor={job.color}>{job.logo}</CompanyLogo>
                          <CompanyInfo>
                            <CompanyName>{job.company}</CompanyName>
                            <LocationText>{job.location}</LocationText>
                          </CompanyInfo>
                        </CompanySection>

                        <JobTitle>{job.title}</JobTitle>
                        <JobTypeText>{job.type}</JobTypeText>

                        <ApplicationStatus>
                          {job.applicants} <span>of {job.capacity}</span>
                        </ApplicationStatus>

                        <SalaryText>
                          {job.salary.split("/")[0]}
                          <span>/{job.salary.split("/")[1]}</span>
                        </SalaryText>
                      </StyledCardContent>

                      <ButtonContainer>
                        <ApplyButton>Apply Now</ApplyButton>
                        <ContactButton>Contact</ContactButton>
                      </ButtonContainer>
                    </JobCard>
                  </AnimatedContainer>
                ))}
              </GridContainer>
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
                      <AnimatedContainer key={index + 6} delay={index * 100}>
                        <JobCard>
                          <StyledCardContent>
                            <CompanySection>
                              <CompanyLogo bgcolor={job.color}>{job.logo}</CompanyLogo>
                              <CompanyInfo>
                                <CompanyName>{job.company}</CompanyName>
                                <LocationText>{job.location}</LocationText>
                              </CompanyInfo>
                            </CompanySection>

                            <JobTitle>{job.title}</JobTitle>
                            <JobTypeText>{job.type}</JobTypeText>

                            <ApplicationStatus>
                              {job.applicants} <span>of {job.capacity}</span>
                            </ApplicationStatus>

                            <SalaryText>
                              {job.salary.split("/")[0]}
                              <span>/{job.salary.split("/")[1]}</span>
                            </SalaryText>
                          </StyledCardContent>

                          <ButtonContainer>
                            <ApplyButton>Apply Now</ApplyButton>
                            <ContactButton>Contact</ContactButton>
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

      {/* Footer */}
      <Footer />
    </PageContainer>
  )
}

export default FindJobs
