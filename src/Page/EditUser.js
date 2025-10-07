import { useState, useEffect } from "react"
import {
  Box, Typography, TextField, Button, Alert, Snackbar, Accordion, AccordionSummary,
  AccordionDetails, Grid, Divider, Switch, FormControlLabel, Chip, FormControl, InputLabel, Select, MenuItem
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  ExpandMore as ExpandMoreIcon, Add as AddIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/landing-page/Navbar"
import Footer from "../components/Footer"
import { getDoc, setDoc, doc } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "../lib/auth-context"

const PageWrapper = styled(Box)({ backgroundColor: "#004D40", minHeight: "100vh", display: "flex", justifyContent: "center", padding: "20px" })
const FormWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#004D40", maxWidth: "900px", width: "100%", padding: "40px",
  border: "1px solid #00A389", borderRadius: "8px", [theme.breakpoints.down("sm")]: { padding: "20px" },
}))
const Title = styled(Typography)(({ theme }) => ({
  fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px", [theme.breakpoints.down("sm")]: { fontSize: "24px" },
}))
const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px", color: "white", marginBottom: "16px", [theme.breakpoints.down("sm")]: { fontSize: "14px" },
}))
const DividerBox = styled(Box)({ height: "1px", backgroundColor: "#00A389", marginBottom: "32px" })
const SectionDivider = styled(Divider)({ background: "#00A389", margin: "32px 0" })
const InputField = styled(TextField)(({ error, multiline }) => ({
  "& .MuiOutlinedInput-root": { height: multiline ? "auto" : "56px", color: "white",
    "& fieldset": { borderColor: error ? "#f44336" : "#00A389", borderRadius: "4px" },
    "&:hover fieldset": { borderColor: error ? "#f44336" : "#00A389" },
    "&.Mui-focused fieldset": { borderColor: error ? "#f44336" : "#00A389" },
    "& input": { overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" },
    "& textarea": { overflow: "auto" }
  },
  "& .MuiInputBase-input": {
    color: "white", "&::placeholder": { color: "rgba(255, 255, 255, 0.7)", opacity: 1 },
  },
  "& .MuiSvgIcon-root": { color: "white" },
  "& .MuiFormHelperText-root": { color: "#f44336", marginLeft: 0 },
}))
const RegisterButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#00A389", color: "white", height: "56px", borderRadius: "4px",
  textTransform: "none", fontSize: "16px", fontWeight: "500", width: "100%", maxWidth: "400px",
  margin: "0 auto", display: "block",
  "&:hover": { backgroundColor: "#00897B" }, [theme.breakpoints.down("sm")]: { maxWidth: "100%" },
}))
const SectionTitle = styled(Typography)({ color: "white", fontSize: 20, fontWeight: 600, marginBottom: 24, marginTop: 32 })

const MAX_FIELD_LENGTH = 50
const MAX_SUMMARY_LENGTH = 300

const EditProfile = () => {
  const navigate = useNavigate()
  const { currentUser, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({
    open: false, message: "", severity: "success"
  })
  const [formData, setFormData] = useState({
    fullName: "", jobTitle: "", email: "", phone: "", location: "", summary: "",
    education: [{ institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "" }],
    experience: [{ company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" }],
    certifications: [{ name: "", organization: "", issueDate: "", expiryDate: "", credentialID: "", description: "" }],
    skills: [],
    currentSkill: "",
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
          setFormData({
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
              : [{ institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "" }],
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
              : [{ company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" }],
            certifications: Array.isArray(data.certifications) && data.certifications.length > 0
              ? data.certifications.map(cert => ({
                name: cert.name || "",
                organization: cert.organization || cert.issuer || "",
                issueDate: cert.issueDate || cert.date || "",
                expiryDate: cert.expiryDate || "",
                credentialID: cert.credentialID || cert.url || "",
                description: cert.description || ""
              }))
              : [{ name: "", organization: "", issueDate: "", expiryDate: "", credentialID: "", description: "" }],
            skills: Array.isArray(data.skills) ? data.skills : [],
            desiredJobTitle: data.jobPreferences?.desiredJobTitle || "",
            jobType: data.jobPreferences?.jobType || "",
            workEnvironment: data.jobPreferences?.workEnvironment || "",
            salaryMin: data.jobPreferences?.salaryMin || "",
            salaryMax: data.jobPreferences?.salaryMax || "",
            availability: data.jobPreferences?.availability || ""
          })
        } else {
          setFormData({
            fullName, jobTitle, email, phone, location, summary,
            education: [{ institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "" }],
            experience: [{ company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" }],
            certifications: [{ name: "", organization: "", issueDate: "", expiryDate: "", credentialID: "", description: "" }],
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

  // Utility handlers
  const updateForm = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Auto-sync desiredJobTitle to jobTitle
      if (field === 'desiredJobTitle' && value) {
        newData.jobTitle = value
      }
      
      return newData
    })
  }
  const updateArrayField = (arrayField, index, field, value) => {
    setFormData(prev => {
      const arr = [...prev[arrayField]]
      arr[index] = { ...arr[index], [field]: value }
      return { ...prev, [arrayField]: arr }
    })
  }
  const addArrayItem = (arrayField, defaultItem) =>
    setFormData(prev => ({ ...prev, [arrayField]: [...prev[arrayField], defaultItem] }))
  const removeArrayItem = (arrayField, index) =>
    setFormData(prev => ({ ...prev, [arrayField]: prev[arrayField].filter((_, i) => i !== index) }))

  // Save to Firestore (update both docs)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Update top-level user doc with displayName and jobTitle
      const userDocRef = doc(db, "employees", currentUser.uid);
      await setDoc(userDocRef, {
        displayName: formData.fullName,
        jobTitle: formData.desiredJobTitle || formData.jobTitle, // Use desiredJobTitle if available, fallback to jobTitle
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        summary: formData.summary,
        lastUpdated: new Date()
      }, { merge: true });
      
      // Update profile subdoc with all data
      const profileRef = doc(db, "employees", currentUser.uid, "employee data", "profile")
      await setDoc(profileRef, {
        // Personal info
        fullName: formData.fullName,
        jobTitle: formData.desiredJobTitle || formData.jobTitle, // Use desiredJobTitle if available, fallback to jobTitle
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        summary: formData.summary,
        // Also update personalInfo object for backward compatibility
        personalInfo: {
          fullName: formData.fullName,
          jobTitle: formData.desiredJobTitle || formData.jobTitle, // Use desiredJobTitle if available, fallback to jobTitle
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          summary: formData.summary
        },
        // Education
        education: formData.education.map(edu => ({
          institution: edu.institution,
          degree: edu.degree,
          field: edu.fieldOfStudy,
          startDate: edu.startDate,
          endDate: edu.endDate,
          description: edu.description
        })),
        // Experience
        experience: formData.experience.map(exp => ({
          company: exp.company,
          position: exp.position,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate,
          current: exp.current,
          description: exp.description
        })),
        // Certifications
        certifications: formData.certifications.map(cert => ({
          name: cert.name,
          organization: cert.organization,
          issueDate: cert.issueDate,
          expiryDate: cert.expiryDate,
          credentialID: cert.credentialID,
          description: cert.description
        })),
        // Skills
        skills: formData.skills,
        // Job preferences
        jobPreferences: {
          desiredJobTitle: formData.desiredJobTitle,
          jobType: formData.jobType,
          workEnvironment: formData.workEnvironment,
          salaryMin: formData.salaryMin,
          salaryMax: formData.salaryMax,
          availability: formData.availability
        },
        // Metadata
        lastUpdated: new Date()
      }, { merge: true });
      setNotification({ open: true, message: "Profile updated successfully!", severity: "success" })
    } catch (error) {
      setNotification({ open: true, message: "Failed to update profile.", severity: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  // --- Section Components ---
  const PersonalSection = (
    <Box>
      <SectionTitle>Personal Information</SectionTitle>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} width={"49%"}>
          <InputField
            fullWidth
            label="Full Name"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={e => updateForm("fullName", e.target.value.slice(0, MAX_FIELD_LENGTH))}
            required
            inputProps={{
              maxLength: MAX_FIELD_LENGTH,
              style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} width={"48%"}>
          <InputField
            fullWidth
            label="Job Title"
            placeholder="Software Engineer"
            value={formData.jobTitle}
            onChange={e => updateForm("jobTitle", e.target.value.slice(0, MAX_FIELD_LENGTH))}
            required
            inputProps={{
              maxLength: MAX_FIELD_LENGTH,
              style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} width={"49%"}>
          <InputField
            fullWidth
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={e => updateForm("email", e.target.value.slice(0, MAX_FIELD_LENGTH))}
            required
            inputProps={{
              maxLength: MAX_FIELD_LENGTH,
              style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} width={"48%"}>
          <InputField
            fullWidth
            label="Phone"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={e => updateForm("phone", e.target.value.slice(0, MAX_FIELD_LENGTH))}
            inputProps={{
              maxLength: MAX_FIELD_LENGTH,
              style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} width={"49%"}>
          <InputField
            fullWidth
            label="Location"
            placeholder="City, Country"
            value={formData.location}
            onChange={e => updateForm("location", e.target.value.slice(0, MAX_FIELD_LENGTH))}
            inputProps={{
              maxLength: MAX_FIELD_LENGTH,
              style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
            }}
          />
        </Grid>
        <Grid item xs={12} width={"100%"}>
          <InputField
            fullWidth
            label="Professional Summary"
            multiline
            minRows={3}
            maxRows={3}
            placeholder="Brief overview of your professional background and career goals..."
            value={formData.summary}
            onChange={e => updateForm("summary", e.target.value.slice(0, MAX_SUMMARY_LENGTH))}
            inputProps={{
              maxLength: MAX_SUMMARY_LENGTH
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )

  const EducationSection = (
    <Box>
      <SectionTitle>Education</SectionTitle>
      {formData.education.map((edu, i) => (
        <Accordion key={i} defaultExpanded={i === 0} sx={{ mb: 2, background: "#00574B", color: "white" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
            <Typography>
              {edu.institution ? edu.institution : `Education #${i + 1}`}
              {edu.degree ? ` - ${edu.degree}` : ""}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} width={"49%"}>
                <InputField
                  fullWidth
                  label="Institution"
                  value={edu.institution}
                  onChange={e =>
                    updateArrayField("education", i, "institution", e.target.value.slice(0, MAX_FIELD_LENGTH))
                  }
                  required
                  inputProps={{
                    maxLength: MAX_FIELD_LENGTH,
                    style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} width={"48%"}>
                <InputField
                  fullWidth
                  label="Degree"
                  value={edu.degree}
                  onChange={e => updateArrayField("education", i, "degree", e.target.value.slice(0, MAX_FIELD_LENGTH))}
                  required
                  inputProps={{
                    maxLength: MAX_FIELD_LENGTH,
                    style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} width={"49%"}>
                <InputField
                  fullWidth
                  label="Field of Study"
                  value={edu.fieldOfStudy}
                  onChange={e => updateArrayField("education", i, "fieldOfStudy", e.target.value.slice(0, MAX_FIELD_LENGTH))}
                  inputProps={{
                    maxLength: MAX_FIELD_LENGTH,
                    style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3} width={"49%"}>
                <InputField
                  fullWidth
                  label="Start Date"
                  type="month"
                  value={edu.startDate}
                  onChange={e => updateArrayField("education", i, "startDate", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3} width={"48%"}>
                <InputField
                  fullWidth
                  label="End Date"
                  type="month"
                  value={edu.endDate}
                  onChange={e => updateArrayField("education", i, "endDate", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} width={"100%"}>
                <InputField
                  fullWidth
                  label="Description"
                  multiline
                  minRows={3}
                  maxRows={3}
                  value={edu.description}
                  onChange={e => updateArrayField("education", i, "description", e.target.value.slice(0, MAX_SUMMARY_LENGTH))}
                  inputProps={{
                    maxLength: MAX_SUMMARY_LENGTH
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => removeArrayItem("education", i)}
                  disabled={formData.education.length <= 1}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{ color: "white", borderColor: "#00A389", mt: 1 }}
        onClick={() =>
          addArrayItem("education", {
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
            description: ""
          })
        }
      >
        Add Education
      </Button>
    </Box>
  )

  const ExperienceSection = (
    <Box>
      <SectionTitle>Experience</SectionTitle>
      {formData.experience.map((exp, i) => (
        <Accordion key={i} defaultExpanded={i === 0} sx={{ mb: 2, background: "#00574B", color: "white" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
            <Typography>
              {exp.position ? exp.position : `Position #${i + 1}`}
              {exp.company ? ` at ${exp.company}` : ""}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} width={"49%"}>
                <InputField
                  fullWidth
                  label="Company"
                  value={exp.company}
                  onChange={e => updateArrayField("experience", i, "company", e.target.value.slice(0, MAX_FIELD_LENGTH))}
                  required
                  inputProps={{
                    maxLength: MAX_FIELD_LENGTH,
                    style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} width={"48%"}>
                <InputField
                  fullWidth
                  label="Position"
                  value={exp.position}
                  onChange={e => updateArrayField("experience", i, "position", e.target.value.slice(0, MAX_FIELD_LENGTH))}
                  required
                  inputProps={{
                    maxLength: MAX_FIELD_LENGTH,
                    style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} width={"49%"}>
                <InputField
                  fullWidth
                  label="Location"
                  value={exp.location}
                  onChange={e => updateArrayField("experience", i, "location", e.target.value.slice(0, MAX_FIELD_LENGTH))}
                  inputProps={{
                    maxLength: MAX_FIELD_LENGTH,
                    style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={exp.current}
                      onChange={e => updateArrayField("experience", i, "current", e.target.checked)}
                    />
                  }
                  label="Current Position"
                  sx={{ color: "white" }}
                />
              </Grid >

              <Grid item xs={12} md={3} width={"49%"}>
                <InputField
                  fullWidth
                  label="Start Date"
                  type="month"
                  value={exp.startDate}
                  onChange={e => updateArrayField("experience", i, "startDate", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              {!exp.current && (
                <Grid item xs={12} md={6} width={"48%"}>
                  <InputField
                    fullWidth
                    label="End Date"
                    type="month"
                    value={exp.endDate}
                    onChange={e => updateArrayField("experience", i, "endDate", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
              <Grid item xs={12} width={"100%"}>
                <InputField
                  fullWidth
                  label="Description"
                  multiline
                  minRows={3}
                  maxRows={3}
                  value={exp.description}
                  onChange={e => updateArrayField("experience", i, "description", e.target.value.slice(0, MAX_SUMMARY_LENGTH))}
                  inputProps={{
                    maxLength: MAX_SUMMARY_LENGTH
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => removeArrayItem("experience", i)}
                  disabled={formData.experience.length <= 1}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{ color: "white", borderColor: "#00A389", mt: 1 }}
        onClick={() =>
          addArrayItem("experience", {
            company: "",
            position: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            description: ""
          })
        }
      >
        Add Experience
      </Button>
    </Box>
  )

  const CertificationsSection = (
    <Box>
      <SectionTitle>Certifications</SectionTitle>
      {formData.certifications.map((cert, i) => (
        <Accordion key={i} defaultExpanded={i === 0} sx={{ mb: 2, background: "#00574B", color: "white" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
            <Typography>
              {cert.name ? cert.name : `Certification #${i + 1}`}
              {cert.organization ? ` - ${cert.organization}` : ""}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} width={"49%"}>
                <InputField
                  fullWidth
                  label="Certification Name"
                  value={cert.name}
                  onChange={e => updateArrayField("certifications", i, "name", e.target.value.slice(0, MAX_FIELD_LENGTH))}
                  required
                  inputProps={{
                    maxLength: MAX_FIELD_LENGTH,
                    style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} width={"48%"}>
                <InputField
                  fullWidth
                  label="Issuing Organization"
                  value={cert.organization}
                  onChange={e => updateArrayField("certifications", i, "organization", e.target.value.slice(0, MAX_FIELD_LENGTH))}
                  required
                  inputProps={{
                    maxLength: MAX_FIELD_LENGTH,
                    style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3} width={"49%"}>
                <InputField
                  fullWidth
                  label="Issue Date"
                  type="month"
                  value={cert.issueDate}
                  onChange={e => updateArrayField("certifications", i, "issueDate", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6} width={"100%"}>
                <InputField
                  fullWidth
                  label="URL (Optional)"
                  value={cert.credentialID}
                  onChange={e => updateArrayField("certifications", i, "credentialID", e.target.value.slice(0, MAX_FIELD_LENGTH))}
                  inputProps={{
                    maxLength: MAX_FIELD_LENGTH,
                    style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
                  }}
                />
              </Grid>
              <Grid item xs={12} width={"100%"}>
                <InputField
                  fullWidth
                  label="Description"
                  multiline
                  minRows={3}
                  maxRows={3}
                  value={cert.description || ""}
                  onChange={e => updateArrayField("certifications", i, "description", e.target.value.slice(0, MAX_SUMMARY_LENGTH))}
                  inputProps={{
                    maxLength: MAX_SUMMARY_LENGTH
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => removeArrayItem("certifications", i)}
                  disabled={formData.certifications.length <= 1}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{ color: "white", borderColor: "#00A389", mt: 1 }}
        onClick={() =>
          addArrayItem("certifications", {
            name: "",
            organization: "",
            issueDate: "",
            expiryDate: "",
            credentialID: "",
            description: ""
          })
        }
      >
        Add Certification
      </Button>
    </Box>
  )

  const SkillsSection = (
    <Box>
      <SectionTitle>Skills</SectionTitle>
      <Box sx={{ mb: 2 }}>
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {formData.skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              onDelete={() => {
                const newSkills = formData.skills.filter((_, i) => i !== index);
                updateForm("skills", newSkills);
              }}
              sx={{
                backgroundColor: "#00A389",
                color: "white",
                "& .MuiChip-deleteIcon": {
                  color: "white"
                }
              }}
            />
          ))}
        </Box>
        <Box display="flex" gap={2}>
          <InputField
            fullWidth
            label="Add a skill"
            placeholder="e.g., JavaScript, Project Management"
            value={formData.currentSkill || ""}
            onChange={e => updateForm("currentSkill", e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (formData.currentSkill?.trim()) {
                  const newSkills = [...formData.skills, formData.currentSkill.trim()];
                  updateForm("skills", newSkills);
                  updateForm("currentSkill", "");
                }
              }
            }}
          />
          <Button
            variant="contained"
            onClick={() => {
              if (formData.currentSkill?.trim()) {
                const newSkills = [...formData.skills, formData.currentSkill.trim()];
                updateForm("skills", newSkills);
                updateForm("currentSkill", "");
              }
            }}
            disabled={!formData.currentSkill?.trim()}
            sx={{ backgroundColor: "#00A389", "&:hover": { backgroundColor: "#00897B" } }}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  )

  const JobPreferencesSection = (
    <Box>
      <SectionTitle>Job Preferences</SectionTitle>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} width={"49%"}>
          <InputField
            fullWidth
            label="Desired Job Title"
            placeholder="Software Engineer, Project Manager, etc."
            value={formData.desiredJobTitle}
            onChange={e => updateForm("desiredJobTitle", e.target.value.slice(0, MAX_FIELD_LENGTH))}
            inputProps={{
              maxLength: MAX_FIELD_LENGTH,
              style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} width={"48%"}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>Job Type</InputLabel>
            <Select
              value={formData.jobType}
              onChange={e => updateForm("jobType", e.target.value)}
              sx={{ color: "white" }}
            >
              <MenuItem value="">Select Job Type</MenuItem>
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Freelance">Freelance</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} width={"49%"}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>Work Environment</InputLabel>
            <Select
              value={formData.workEnvironment}
              onChange={e => updateForm("workEnvironment", e.target.value)}
              sx={{ color: "white" }}
            >
              <MenuItem value="">Select Work Environment</MenuItem>
              <MenuItem value="On-site">On-site</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} width={"48%"}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>Availability</InputLabel>
            <Select
              value={formData.availability}
              onChange={e => updateForm("availability", e.target.value)}
              sx={{ color: "white" }}
            >
              <MenuItem value="">Select Availability</MenuItem>
              <MenuItem value="Immediately">Immediately</MenuItem>
              <MenuItem value="2 weeks">2 weeks</MenuItem>
              <MenuItem value="1 month">1 month</MenuItem>
              <MenuItem value="More than 1 month">More than 1 month</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} width={"49%"}>
          <InputField
            fullWidth
            label="Minimum Salary"
            placeholder="50000"
            type="number"
            value={formData.salaryMin}
            onChange={e => updateForm("salaryMin", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} width={"48%"}>
          <InputField
            fullWidth
            label="Maximum Salary"
            placeholder="80000"
            type="number"
            value={formData.salaryMax}
            onChange={e => updateForm("salaryMax", e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  )

   return (
    <>
      <Navbar/>
      <PageWrapper>
        <FormWrapper>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ color: "white", mb: 2 }}>Back</Button>
          <Title>Edit Profile</Title>
          <Subtitle>Update your details below to keep your profile up to date</Subtitle>
          <DividerBox />
          <form onSubmit={handleSubmit} autoComplete="off">
            {PersonalSection}
            <SectionDivider />
            {EducationSection}
            <SectionDivider />
            {ExperienceSection}
            <SectionDivider />
            {CertificationsSection}
            <SectionDivider />
            {SkillsSection}
            <SectionDivider />
            {JobPreferencesSection}
            <SectionDivider />
            <RegisterButton type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? "Updating..." : "Save Changes"}
            </RegisterButton>
          </form>
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
        </FormWrapper>
      </PageWrapper>
      <Footer/>
    </>
  )
}

export default EditProfile