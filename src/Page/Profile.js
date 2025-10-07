import { useState, useEffect } from "react"
import {
  Box, Typography, Button, Alert, Snackbar, Accordion, AccordionSummary,
  AccordionDetails, Grid, Divider, Card, CardContent, Avatar, Chip
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  ExpandMore as ExpandMoreIcon, Edit as EditIcon, ArrowBack as ArrowBackIcon,
  Email as EmailIcon, Phone as PhoneIcon, LocationOn as LocationIcon,
  Work as WorkIcon, School as SchoolIcon, CardMembership as CertIcon
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/landing-page/Navbar"
import Footer from "../components/Footer"
import { getDoc, doc } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "../lib/auth-context"

const PageWrapper = styled(Box)({ 
  backgroundColor: "#004D40", 
  minHeight: "100vh", 
  display: "flex", 
  justifyContent: "center", 
  padding: "20px" 
})

const ProfileWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#004D40", 
  maxWidth: "1000px", 
  width: "100%", 
  padding: "40px",
  [theme.breakpoints.down("sm")]: { padding: "20px" },
}))

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "32px", 
  fontWeight: "bold", 
  color: "white", 
  marginBottom: "8px", 
  [theme.breakpoints.down("sm")]: { fontSize: "28px" },
}))

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: "18px", 
  color: "rgba(255, 255, 255, 0.8)", 
  marginBottom: "32px", 
  [theme.breakpoints.down("sm")]: { fontSize: "16px" },
}))

const InfoCard = styled(Card)({
  backgroundColor: "#00574B",
  color: "white",
  marginBottom: "24px",
  border: "1px solid #00A389",
  borderRadius: "8px",
})

const SectionTitle = styled(Typography)({ 
  color: "white", 
  fontSize: 24, 
  fontWeight: 600, 
  marginBottom: 24, 
  marginTop: 32 
})

const InfoItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: "16px",
  "& .MuiSvgIcon-root": {
    marginRight: "12px",
    color: "#00A389",
  }
})

const InfoText = styled(Typography)({
  color: "white",
  fontSize: "16px",
})

const InfoLabel = styled(Typography)({
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "14px",
  marginBottom: "4px",
})

const EditButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#00A389", 
  color: "white", 
  height: "48px", 
  borderRadius: "4px",
  textTransform: "none", 
  fontSize: "16px", 
  fontWeight: "500", 
  padding: "12px 24px",
  "&:hover": { backgroundColor: "#00897B" }, 
  [theme.breakpoints.down("sm")]: { width: "100%" },
}))

const BackButton = styled(Button)({
  color: "white",
  marginBottom: "16px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  }
})

const SummaryCard = styled(Card)({
  backgroundColor: "#00574B",
  color: "white",
  marginBottom: "24px",
  border: "1px solid #00A389",
  borderRadius: "8px",
  padding: "24px",
})

const ExperienceCard = styled(Card)({
  backgroundColor: "#00574B",
  color: "white",
  marginBottom: "16px",
  border: "1px solid #00A389",
  borderRadius: "8px",
})

const DateChip = styled(Chip)({
  backgroundColor: "#00A389",
  color: "white",
  fontSize: "12px",
  height: "24px",
})

const CurrentChip = styled(Chip)({
  backgroundColor: "#4CAF50",
  color: "white",
  fontSize: "12px",
  height: "24px",
})

const Profile = () => {
  const navigate = useNavigate()
  const { currentUser, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({
    open: false, message: "", severity: "success"
  })
  const [profileData, setProfileData] = useState({
    fullName: "", jobTitle: "", email: "", phone: "", location: "", summary: "",
    education: [],
    experience: [],
    certifications: [],
    skills: [],
    desiredJobTitle: "",
    jobType: "",
    workEnvironment: "",
    salaryMin: "",
    salaryMax: "",
    availability: ""
  })

  // FETCH DATA FROM FIRESTORE
  useEffect(() => {
    if (loading || !currentUser?.uid) return;
    async function fetchProfile() {
      setIsLoading(true)
      try {
        // 1. Fetch top-level user doc
        const userDocRef = doc(db, "employees", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        // 2. Fetch profile subdoc
        const profileRef = doc(db, "employees", currentUser.uid, "employee data", "profile")
        const profileSnap = await getDoc(profileRef)
        
        let fullName = "", jobTitle = "", email = "", phone = "", location = "", summary = "";
        
        // Fill from user doc fields
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          fullName = userData.displayName || "";
          jobTitle = userData.jobTitle || "";
          email = userData.email || "";
          phone = userData.phone || "";
          location = userData.location || "";
          summary = userData.summary || "";
        }
        
        // Fill from profile subdoc fields if present (priority)
        if (profileSnap.exists()) {
          const data = profileSnap.data()
          fullName = data.fullName || data.personalInfo?.fullName || fullName;
          jobTitle = data.jobTitle || data.personalInfo?.jobTitle || jobTitle;
          email = data.email || data.personalInfo?.email || email;
          phone = data.phone || data.personalInfo?.phone || phone;
          location = data.location || data.personalInfo?.location || location;
          summary = data.summary || data.personalInfo?.summary || summary;
          
          setProfileData({
            fullName,
            jobTitle,
            email,
            phone,
            location,
            summary,
            education: Array.isArray(data.education) && data.education.length > 0
              ? data.education.map(edu => ({
                  institution: edu.institution || "",
                  degree: edu.degree || "",
                  fieldOfStudy: edu.field || "",
                  startDate: edu.startDate || "",
                  endDate: edu.endDate || "",
                  description: edu.description || ""
                }))
              : [],
            experience: Array.isArray(data.experience) && data.experience.length > 0
              ? data.experience.map(exp => ({
                company: exp.company || "",
                position: exp.position || "",
                location: exp.location || "",
                startDate: exp.startDate || "",
                endDate: exp.endDate || "",
                current: exp.current || false,
                description: exp.description || ""
              }))
              : [],
            certifications: Array.isArray(data.certifications) && data.certifications.length > 0
              ? data.certifications.map(cert => ({
                name: cert.name || "",
                organization: cert.organization || cert.issuer || "",
                issueDate: cert.issueDate || cert.date || "",
                expiryDate: cert.expiryDate || "",
                credentialID: cert.credentialID || cert.url || "",
                description: cert.description || ""
              }))
              : [],
            skills: Array.isArray(data.skills) ? data.skills : [],
            desiredJobTitle: data.jobPreferences?.desiredJobTitle || "",
            jobType: data.jobPreferences?.jobType || "",
            workEnvironment: data.jobPreferences?.workEnvironment || "",
            salaryMin: data.jobPreferences?.salaryMin || "",
            salaryMax: data.jobPreferences?.salaryMax || "",
            availability: data.jobPreferences?.availability || ""
          })
        } else {
          setProfileData({
            fullName, jobTitle, email, phone, location, summary,
            education: [],
            experience: [],
            certifications: [],
            skills: [],
            desiredJobTitle: "",
            jobType: "",
            workEnvironment: "",
            salaryMin: "",
            salaryMax: "",
            availability: ""
          })
        }
      } catch (e) {
        setNotification({
          open: true, message: "Failed to load profile from database.", severity: "error"
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [currentUser, loading])

  const formatDate = (dateString) => {
    if (!dateString) return "Present"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <>
      <Navbar/>
      <PageWrapper>
        <ProfileWrapper>
          <BackButton startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Back
          </BackButton>
          
          <Title>My Profile</Title>
          <Subtitle>View and manage your professional information</Subtitle>

          {/* Profile Header */}
          <InfoCard>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Box display="flex" justifyContent="center" mb={2}>
                    <Avatar 
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        backgroundColor: "#00A389",
                        fontSize: "48px",
                        fontWeight: "bold"
                      }}
                    >
                      {getInitials(profileData.fullName)}
                    </Avatar>
                  </Box>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Typography variant="h4" sx={{ color: "white", mb: 1, fontWeight: "bold" }}>
                    {profileData.fullName || "Your Name"}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#00A389", mb: 2 }}>
                    {profileData.desiredJobTitle || profileData.jobTitle || "Your Job Title"}
                  </Typography>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <EditButton
                      startIcon={<EditIcon />}
                      onClick={() => navigate("/edit-profile")}
                    >
                      Edit Profile
                    </EditButton>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </InfoCard>

          {/* Contact Information */}
          <InfoCard>
            <CardContent>
              <Typography variant="h6" sx={{ color: "white", mb: 3, fontWeight: "600" }}>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InfoItem>
                    <EmailIcon />
                    <Box>
                      <InfoLabel>Email</InfoLabel>
                      <InfoText>{profileData.email || "Not provided"}</InfoText>
                    </Box>
                  </InfoItem>
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem>
                    <PhoneIcon />
                    <Box>
                      <InfoLabel>Phone</InfoLabel>
                      <InfoText>{profileData.phone || "Not provided"}</InfoText>
                    </Box>
                  </InfoItem>
                </Grid>
                <Grid item xs={12}>
                  <InfoItem>
                    <LocationIcon />
                    <Box>
                      <InfoLabel>Location</InfoLabel>
                      <InfoText>{profileData.location || "Not provided"}</InfoText>
                    </Box>
                  </InfoItem>
                </Grid>
              </Grid>
            </CardContent>
          </InfoCard>

          {/* Professional Summary */}
          {profileData.summary && (
            <SummaryCard>
              <Typography variant="h6" sx={{ color: "white", mb: 2, fontWeight: "600" }}>
                Professional Summary
              </Typography>
              <Typography sx={{ color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.6 }}>
                {profileData.summary}
              </Typography>
            </SummaryCard>
          )}

          {/* Education Section */}
          {profileData.education.length > 0 && (
            <Box>
              <SectionTitle>
                <SchoolIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Education
              </SectionTitle>
              {profileData.education.map((edu, i) => (
                <ExperienceCard key={i}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6" sx={{ color: "white", fontWeight: "600" }}>
                          {edu.degree || "Degree"}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: "#00A389", mb: 1 }}>
                          {edu.institution || "Institution"}
                        </Typography>
                        {edu.fieldOfStudy && (
                          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                            {edu.fieldOfStudy}
                          </Typography>
                        )}
                      </Box>
                      <Box display="flex" gap={1}>
                        {edu.startDate && (
                          <DateChip label={formatDate(edu.startDate)} />
                        )}
                        {edu.endDate && (
                          <DateChip label={formatDate(edu.endDate)} />
                        )}
                      </Box>
                    </Box>
                    {edu.description && (
                      <Typography sx={{ color: "rgba(255, 255, 255, 0.9)", mt: 1 }}>
                        {edu.description}
                      </Typography>
                    )}
                  </CardContent>
                </ExperienceCard>
              ))}
            </Box>
          )}

          {/* Experience Section */}
          {profileData.experience.length > 0 && (
            <Box>
              <SectionTitle>
                <WorkIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Work Experience
              </SectionTitle>
              {profileData.experience.map((exp, i) => (
                <ExperienceCard key={i}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6" sx={{ color: "white", fontWeight: "600" }}>
                          {exp.position || "Position"}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: "#00A389", mb: 1 }}>
                          {exp.company || "Company"}
                        </Typography>
                        {exp.location && (
                          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                            {exp.location}
                          </Typography>
                        )}
                      </Box>
                      <Box display="flex" gap={1} alignItems="center">
                        {exp.current && (
                          <CurrentChip label="Current" />
                        )}
                        {exp.startDate && (
                          <DateChip label={formatDate(exp.startDate)} />
                        )}
                        {exp.endDate && !exp.current && (
                          <DateChip label={formatDate(exp.endDate)} />
                        )}
                      </Box>
                    </Box>
                    {exp.description && (
                      <Typography sx={{ color: "rgba(255, 255, 255, 0.9)", mt: 1 }}>
                        {exp.description}
                      </Typography>
                    )}
                  </CardContent>
                </ExperienceCard>
              ))}
            </Box>
          )}

          {/* Certifications Section */}
          {profileData.certifications.length > 0 && (
            <Box>
              <SectionTitle>
                <CertIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Certifications
              </SectionTitle>
              {profileData.certifications.map((cert, i) => (
                <ExperienceCard key={i}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6" sx={{ color: "white", fontWeight: "600" }}>
                          {cert.name || "Certification"}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: "#00A389", mb: 1 }}>
                          {cert.organization || "Organization"}
                        </Typography>
                        {cert.credentialID && (
                          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                            Credential ID: {cert.credentialID}
                          </Typography>
                        )}
                      </Box>
                      <Box display="flex" gap={1}>
                        {cert.issueDate && (
                          <DateChip label={`Issued: ${formatDate(cert.issueDate)}`} />
                        )}
                        {cert.expiryDate && (
                          <DateChip label={`Expires: ${formatDate(cert.expiryDate)}`} />
                        )}
                      </Box>
                    </Box>
                    {cert.description && (
                      <Typography sx={{ color: "rgba(255, 255, 255, 0.9)", mt: 1 }}>
                        {cert.description}
                      </Typography>
                    )}
                  </CardContent>
                </ExperienceCard>
              ))}
            </Box>
          )}

          {/* Skills Section */}
          {profileData.skills.length > 0 && (
            <Box>
              <SectionTitle>
                <WorkIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Skills
              </SectionTitle>
              <InfoCard>
                <CardContent>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {profileData.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        sx={{
                          backgroundColor: "#00A389",
                          color: "white",
                          fontWeight: "500",
                          "&:hover": {
                            backgroundColor: "#00897B"
                          }
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </InfoCard>
            </Box>
          )}

          {/* Job Preferences Section */}
          {(profileData.desiredJobTitle || profileData.jobType || profileData.workEnvironment || profileData.salaryMin || profileData.salaryMax || profileData.availability) && (
            <Box>
              <SectionTitle>
                <WorkIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Job Preferences
              </SectionTitle>
              <InfoCard>
                <CardContent>
                  <Grid container spacing={3}>
                    {profileData.desiredJobTitle && (
                      <Grid item xs={12} md={6}>
                        <InfoItem>
                          <WorkIcon />
                          <Box>
                            <InfoLabel>Desired Job Title</InfoLabel>
                            <InfoText>{profileData.desiredJobTitle}</InfoText>
                          </Box>
                        </InfoItem>
                      </Grid>
                    )}
                    {profileData.jobType && (
                      <Grid item xs={12} md={6}>
                        <InfoItem>
                          <WorkIcon />
                          <Box>
                            <InfoLabel>Job Type</InfoLabel>
                            <InfoText>{profileData.jobType}</InfoText>
                          </Box>
                        </InfoItem>
                      </Grid>
                    )}
                    {profileData.workEnvironment && (
                      <Grid item xs={12} md={6}>
                        <InfoItem>
                          <LocationIcon />
                          <Box>
                            <InfoLabel>Work Environment</InfoLabel>
                            <InfoText>{profileData.workEnvironment}</InfoText>
                          </Box>
                        </InfoItem>
                      </Grid>
                    )}
                    {profileData.availability && (
                      <Grid item xs={12} md={6}>
                        <InfoItem>
                          <WorkIcon />
                          <Box>
                            <InfoLabel>Availability</InfoLabel>
                            <InfoText>{profileData.availability}</InfoText>
                          </Box>
                        </InfoItem>
                      </Grid>
                    )}
                    {(profileData.salaryMin || profileData.salaryMax) && (
                      <Grid item xs={12}>
                        <InfoItem>
                          <WorkIcon />
                          <Box>
                            <InfoLabel>Salary Range</InfoLabel>
                            <InfoText>
                              {profileData.salaryMin && profileData.salaryMax 
                                ? `$${profileData.salaryMin} - $${profileData.salaryMax}`
                                : profileData.salaryMin 
                                  ? `$${profileData.salaryMin}+`
                                  : `Up to $${profileData.salaryMax}`
                              }
                            </InfoText>
                          </Box>
                        </InfoItem>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </InfoCard>
            </Box>
          )}

          {/* Empty State */}
          {profileData.education.length === 0 && profileData.experience.length === 0 && profileData.certifications.length === 0 && profileData.skills.length === 0 && !profileData.summary && !profileData.desiredJobTitle && (
            <InfoCard>
              <CardContent>
                <Box textAlign="center" py={4}>
                  <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
                    Complete Your Profile
                  </Typography>
                  <Typography sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 3 }}>
                    Add your education, experience, and certifications to create a comprehensive profile.
                  </Typography>
                  <EditButton
                    startIcon={<EditIcon />}
                    onClick={() => navigate("/edit-profile")}
                  >
                    Get Started
                  </EditButton>
                </Box>
              </CardContent>
            </InfoCard>
          )}

          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={() => setNotification({ ...notification, open: false })}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setNotification({ ...notification, open: false })}
              severity={notification.severity}
              sx={{ width: "100%" }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </ProfileWrapper>
      </PageWrapper>
      <Footer/>
    </>
  )
}

export default Profile
