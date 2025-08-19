"use client"

import { Box, Typography, Card, CardContent, CardActions, Button, Avatar, Collapse, Fade } from "@mui/material"
import { styled } from "@mui/material/styles"
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
import { useState, useEffect } from "react"

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

// Animated container for job cards
const AnimatedContainer = styled(Box)(({ theme, delay = 0 }) => ({
  animation: `fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
  animationDelay: `${delay}ms`,
  opacity: 0,
  transform: "translateY(20px)",
}))

const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  display: "flex",
  justifyContent: "center",
}))

// Fixed width container to ensure consistent grid
const ContentContainer = styled(Box)(({ theme }) => ({
  width: "1200px", // Fixed width
  maxWidth: "100%", // Responsive
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
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

// Card with smoother hover effect and border color
const JobCard = styled(Card)(({ theme, hovered }) => ({
  width: "100%", // Take full width of grid cell
  height: "340px", // Fixed height
  display: "flex",
  flexDirection: "column",
  borderRadius: "12px",
  border: `1px solid #878383`, // Added border with specified color
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
  overflow: "hidden",
  position: "relative",
  backgroundColor: hovered ? "#004D40" : "#ffffff", // Dark green on hover
  color: hovered ? "#ffffff" : "#000000", // White text on hover
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#004D40", // Dark green on hover
    color: "#ffffff", // White text on hover
    borderColor: "#004D40", // Border color changes on hover
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

const CompanyLogo = styled(Avatar)(({ theme, hovered, bgcolor }) => ({
  width: 36,
  height: 36,
  backgroundColor: hovered ? "#ffffff" : bgcolor || "#000000", // White background on hover, company color otherwise
  borderRadius: "4px",
  "& .MuiSvgIcon-root": {
    color: hovered ? bgcolor || "#004D40" : "#ffffff", // Company color icon on hover
  },
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
}))

const CompanyInfo = styled(Box)(({ theme }) => ({
  marginLeft: "12px",
}))

const CompanyName = styled(Typography)(({ theme, hovered }) => ({
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: 1.2,
  color: "inherit", // Inherit from parent
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
}))

const LocationText = styled(Typography)(({ theme, hovered }) => ({
  fontSize: "14px",
  color: hovered ? "rgba(255, 255, 255, 0.7)" : "#6E6E6E", // Lighter white on hover
  marginTop: "2px",
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
}))

// Job title with proper styling
const JobTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "24px",
  lineHeight: 1.3,
  marginBottom: "8px",
  color: "inherit", // Inherit from parent
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
}))

// Job type chip with minimalist styling
const JobTypeText = styled(Typography)(({ theme, hovered }) => ({
  fontSize: "16px",
  color: hovered ? "rgba(255, 255, 255, 0.7)" : "#6E6E6E", // Lighter white on hover
  marginBottom: "24px",
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
}))

// Application status text
const ApplicationStatus = styled(Typography)(({ theme, hovered }) => ({
  fontSize: "16px",
  marginBottom: "8px",
  color: "inherit", // Inherit from parent
  "& span": {
    color: hovered ? "rgba(255, 255, 255, 0.7)" : "#6E6E6E", // Lighter white on hover
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
  },
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
}))

// Salary text
const SalaryText = styled(Typography)(({ theme, hovered }) => ({
  fontSize: "18px",
  fontWeight: 600,
  color: "inherit", // Inherit from parent
  marginTop: "auto",
  marginBottom: "24px",
  "& span": {
    color: hovered ? "rgba(255, 255, 255, 0.7)" : "#6E6E6E", // Lighter white on hover
    fontWeight: 400,
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
  },
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
}))

// Button container
const ButtonContainer = styled(CardActions)(({ theme }) => ({
  padding: "0 24px 24px",
  display: "flex",
  gap: "12px",
}))

// Apply button with hover state
const ApplyButton = styled(Button)(({ theme, hovered }) => ({
  backgroundColor: hovered ? "#ffffff" : "#004D40", // White background on hover
  color: hovered ? "#004D40" : "#ffffff", // Dark green text on hover
  borderRadius: "8px",
  padding: "10px 16px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "16px",
  flex: 1,
  "&:hover": {
    backgroundColor: hovered ? "#f0f0f0" : "#00695C", // Slightly darker on button hover
  },
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
}))

// Contact button with hover state
const ContactButton = styled(Button)(({ theme, hovered }) => ({
  backgroundColor: "transparent",
  color: hovered ? "#ffffff" : "#6E6E6E", // White text on hover
  borderRadius: "8px",
  padding: "10px 16px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "16px",
  border: hovered ? "1px solid #ffffff" : "1px solid #E0E0E0", // White border on hover
  flex: 1,
  "&:hover": {
    backgroundColor: hovered ? "rgba(255, 255, 255, 0.1)" : "#F5F5F5", // Slight white overlay on hover
    borderColor: hovered ? "#ffffff" : "#BDBDBD",
  },
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
}))

// Section title without the green underline
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: "4px", // Reduced margin to remove space
}))

// Action buttons container
const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "16px",
  marginTop: "40px",
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

function PopularJobs() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [expanded, setExpanded] = useState(false) // Track if additional jobs are shown
  const [fadeIn, setFadeIn] = useState(false) // Control fade-in animation

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
    },
    // Additional 3 jobs that will be shown when "Find More Jobs" is clicked
    {
      title: "E-commerce Specialist",
      company: "Shopify",
      location: "Remote",
      type: "Full-Time",
      applicants: "18 Applied",
      capacity: "25 Capacity",
      salary: "$2400/month",
      logo: <ShoppingCartIcon />,
      color: "#7AB55C", // Shopify green
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
    },
  ]

  // Initial jobs (always visible)
  const initialJobs = allJobs.slice(0, 6)

  // Additional jobs (shown/hidden based on expanded state)
  const additionalJobs = allJobs.slice(6)

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
    }, 300)
  }

  // Reset fadeIn when expanded changes
  useEffect(() => {
    if (!expanded) {
      setFadeIn(false)
    }
  }, [expanded])

  return (
    <>
      <style>{fadeInKeyframes}</style>
      <SectionContainer>
        <ContentContainer>
          <Box sx={{ textAlign: "center", mb: 6, width: "100%" }} data-aos="fade-up">
            <SectionTitle variant="h4" component="h2">
              Explore Popular Jobs
            </SectionTitle>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 0 }}>
              Check our featured jobs from companies that are actively hiring now
            </Typography>
          </Box>

          {/* Initial jobs (always visible) */}
          <GridContainer>
            {initialJobs.map((job, index) => {
              const isHovered = hoveredIndex === index
              return (
                <AnimatedContainer key={index} delay={index * 100}>
                  <JobCard
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    hovered={isHovered}
                  >
                    <StyledCardContent>
                      <CompanySection>
                        <CompanyLogo hovered={isHovered} bgcolor={job.color}>
                          {job.logo}
                        </CompanyLogo>
                        <CompanyInfo>
                          <CompanyName hovered={isHovered}>{job.company}</CompanyName>
                          <LocationText hovered={isHovered}>{job.location}</LocationText>
                        </CompanyInfo>
                      </CompanySection>

                      <JobTitle>{job.title}</JobTitle>
                      <JobTypeText hovered={isHovered}>{job.type}</JobTypeText>

                      <ApplicationStatus hovered={isHovered}>
                        {job.applicants} <span>of {job.capacity}</span>
                      </ApplicationStatus>

                      <SalaryText hovered={isHovered}>
                        {job.salary.split("/")[0]}
                        <span>/{job.salary.split("/")[1]}</span>
                      </SalaryText>
                    </StyledCardContent>

                    <ButtonContainer>
                      <ApplyButton hovered={isHovered}>Apply Now</ApplyButton>
                      <ContactButton hovered={isHovered}>Contact</ContactButton>
                    </ButtonContainer>
                  </JobCard>
                </AnimatedContainer>
              )
            })}
          </GridContainer>

          {/* Additional jobs (shown/hidden based on expanded state) */}
          <Collapse in={expanded} timeout={500} style={{ width: "100%" }}>
            <Fade in={fadeIn} timeout={800}>
              <GridContainer>
                {additionalJobs.map((job, index) => {
                  const jobIndex = index + 6
                  const isHovered = hoveredIndex === jobIndex
                  return (
                    <AnimatedContainer key={jobIndex} delay={index * 100}>
                      <JobCard
                        onMouseEnter={() => setHoveredIndex(jobIndex)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        hovered={isHovered}
                      >
                        <StyledCardContent>
                          <CompanySection>
                            <CompanyLogo hovered={isHovered} bgcolor={job.color}>
                              {job.logo}
                            </CompanyLogo>
                            <CompanyInfo>
                              <CompanyName hovered={isHovered}>{job.company}</CompanyName>
                              <LocationText hovered={isHovered}>{job.location}</LocationText>
                            </CompanyInfo>
                          </CompanySection>

                          <JobTitle>{job.title}</JobTitle>
                          <JobTypeText hovered={isHovered}>{job.type}</JobTypeText>

                          <ApplicationStatus hovered={isHovered}>
                            {job.applicants} <span>of {job.capacity}</span>
                          </ApplicationStatus>

                          <SalaryText hovered={isHovered}>
                            {job.salary.split("/")[0]}
                            <span>/{job.salary.split("/")[1]}</span>
                          </SalaryText>
                        </StyledCardContent>

                        <ButtonContainer>
                          <ApplyButton hovered={isHovered}>Apply Now</ApplyButton>
                          <ContactButton hovered={isHovered}>Contact</ContactButton>
                        </ButtonContainer>
                      </JobCard>
                    </AnimatedContainer>
                  )
                })}
              </GridContainer>
            </Fade>
          </Collapse>

          {/* Action buttons */}
          <ActionButtonsContainer>
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
        </ContentContainer>
      </SectionContainer>
    </>
  )
}

export default PopularJobs
