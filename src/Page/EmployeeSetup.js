import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Firebase imports
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, collection } from 'firebase/firestore';
import { useAuth } from '../lib/auth-context';

// MUI imports
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';

import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Check as CheckIcon
} from '@mui/icons-material';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import Footer from "../components/Footer";
import Navbar from '../components/landing-page/Navbar';

// THEME - matches your dark/green palette
const theme = createTheme({
  palette: {
    primary: {
      main: "#004d40",
    },
    secondary: {
      main: "#00897b",
    },
    background: {
      default: "#002b23",
      paper: "#004d40",
    },
    text: {
      primary: "#fff",
      secondary: "rgba(255,255,255,0.7)"
    },
    success: {
      main: "#00A389"
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, color: "#fff" },
    h5: { fontWeight: 600, color: "#fff" },
    h6: { fontWeight: 600, color: "#fff" },
    button: { fontWeight: 600 },
    body1: { color: "#fff" },
    body2: { color: "#fff" }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#004d40",
          color: "#fff",
          borderRadius: 10,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "12px",
          '& .MuiOutlinedInput-root': {
            color: "white",
            background: "rgba(255,255,255,0.03)",
            '& fieldset': {
              borderColor: "#00A389",
            },
            '&:hover fieldset': {
              borderColor: "#00A389",
            },
            '&.Mui-focused fieldset': {
              borderColor: "#00A389",
            },
          },
          '& .MuiInputLabel-root': {
            color: "#a7ffeb",
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: "#00A389",
          },
        }
      }
    }
  }
});

// --- Section Components ---
const PersonalInfoSection = ({ formData, updateForm }) => (
  <Box>
    <Typography variant="h5" gutterBottom sx={{ color: "#fff" }}>Personal Information</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} width={"49%"}>
        <TextField
          fullWidth label="Full Name" placeholder="John Doe"
          variant="outlined" value={formData.fullName || ''}
          onChange={e => updateForm('fullName', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6} width={"48%"}>
        <TextField
          fullWidth label="Job Title" placeholder="Software Engineer"
          variant="outlined" value={formData.jobTitle || ''}
          onChange={e => updateForm('jobTitle', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6} width={"49%"}>
        <TextField
          fullWidth label="Email" placeholder="john@example.com"
          variant="outlined" type="email" value={formData.email || ''}
          onChange={e => updateForm('email', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6} width={"48%"}>
        <TextField
          fullWidth label="Phone" placeholder="+1 (555) 123-4567"
          variant="outlined" value={formData.phone || ''}
          onChange={e => updateForm('phone', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} width={"49%"}>
        <TextField
          fullWidth label="Location" placeholder="City, Country"
          variant="outlined" value={formData.location || ''}
          onChange={e => updateForm('location', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}width={"100%"}>
        <TextField
          fullWidth label="Professional Summary"
          placeholder="Brief overview of your professional background and career goals..."
          variant="outlined" multiline rows={4}
          value={formData.summary || ''}
          onChange={e => updateForm('summary', e.target.value)}
        />
      </Grid>
    </Grid>
  </Box>
);

const EducationSection = ({ formData, updateForm }) => {
  const [education, setEducation] = useState(formData.education || []);
  const [currentItem, setCurrentItem] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const addEducation = () => {
    if (!currentItem.institution || !currentItem.degree) return;

    const newEducation = [...education, currentItem];
    setEducation(newEducation);
    updateForm('education', newEducation);
    setCurrentItem({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  const removeEducation = (index) => {
    const newEducation = education.filter((_, i) => i !== index);
    setEducation(newEducation);
    updateForm('education', newEducation);
  };

  useEffect(() => {
    setEducation(formData.education || []);
  }, [formData.education]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: "#fff" }}>Education</Typography>

      {education.map((edu, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2, background: "#00574B", color: "#fff" }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ color: "#fff" }}>
              {edu.institution} - {edu.degree}
            </Typography>
            <IconButton 
              color="error" 
              onClick={() => removeEducation(index)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="rgba(255,255,255,0.7)">
            {edu.field} ({edu.startDate} - {edu.endDate})
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {edu.description}
          </Typography>
        </Paper>
      ))}
      
      <Card sx={{ mt: 3, background: "#00382f" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>Add New Education</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} width={"49%"}>
              <TextField
                fullWidth
                label="Institution*"
                placeholder="University Name"
                variant="outlined"
                value={currentItem.institution}
                onChange={(e) => setCurrentItem({...currentItem, institution: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} width={"48%"}>
              <TextField
                fullWidth
                label="Degree*"
                placeholder="Bachelor's, Master's, etc."
                variant="outlined"
                value={currentItem.degree}
                onChange={(e) => setCurrentItem({...currentItem, degree: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} width={"100%"}>
              <TextField
                fullWidth
                label="Field of Study"
                placeholder="Computer Science"
                variant="outlined"
                value={currentItem.field}
                onChange={(e) => setCurrentItem({...currentItem, field: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={3} width={"49%"}>
              <TextField
                fullWidth
                label="Start Date"
                placeholder="MM/YYYY"
                variant="outlined"
                value={currentItem.startDate}
                onChange={(e) => setCurrentItem({...currentItem, startDate: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={3} width={"48%"}>
              <TextField
                fullWidth
                label="End Date"
                placeholder="MM/YYYY or Present"
                variant="outlined"
                value={currentItem.endDate}
                onChange={(e) => setCurrentItem({...currentItem, endDate: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} width={"100%"}>
              <TextField
                fullWidth
                label="Description"
                placeholder="Relevant courses, achievements, etc."
                variant="outlined"
                multiline
                rows={3}
                value={currentItem.description}
                onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={addEducation}
            sx={{ mt: 2 }}
            disabled={!currentItem.institution || !currentItem.degree}
          >
            Add Education
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

const ExperienceSection = ({ formData, updateForm }) => {
  const [experience, setExperience] = useState(formData.experience || []);
  const [currentItem, setCurrentItem] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const addExperience = () => {
    if (!currentItem.company || !currentItem.position) return;

    const newExperience = [...experience, currentItem];
    setExperience(newExperience);
    updateForm('experience', newExperience);
    setCurrentItem({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  const removeExperience = (index) => {
    const newExperience = experience.filter((_, i) => i !== index);
    setExperience(newExperience);
    updateForm('experience', newExperience);
  };

  useEffect(() => {
    setExperience(formData.experience || []);
  }, [formData.experience]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: "#fff" }}>Work Experience</Typography>
      {experience.map((exp, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2, background: "#00574B", color: "#fff" }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ color: "#fff" }}>
              {exp.position} at {exp.company}
            </Typography>
            <IconButton 
              color="error" 
              onClick={() => removeExperience(index)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="rgba(255,255,255,0.7)">
            {exp.location} ({exp.startDate} - {exp.endDate})
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {exp.description}
          </Typography>
        </Paper>
      ))}
      <Card sx={{ mt: 3, background: "#00382f" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>Add New Experience</Typography>
          <Grid container spacing={2} >
            <Grid item xs={12} md={6} width={"49%"}>
              <TextField
                fullWidth
                label="Company*"
                placeholder="Company Name"
                variant="outlined"
                value={currentItem.company}
                onChange={(e) => setCurrentItem({...currentItem, company: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} width={"48%"}>
              <TextField
                fullWidth
                label="Position*"
                placeholder="Job Title"
                variant="outlined"
                value={currentItem.position}
                onChange={(e) => setCurrentItem({...currentItem, position: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} width={"49%"}>
              <TextField
                fullWidth
                label="Location"
                placeholder="City, Country or Remote"
                variant="outlined"
                value={currentItem.location}
                onChange={(e) => setCurrentItem({...currentItem, location: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={3} width={"49%"}>
              <TextField
                fullWidth
                label="Start Date"
                placeholder="MM/YYYY"
                variant="outlined"
                value={currentItem.startDate}
                onChange={(e) => setCurrentItem({...currentItem, startDate: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={3} width={"48%"}>
              <TextField
                fullWidth
                label="End Date"
                placeholder="MM/YYYY or Present"
                variant="outlined"
                value={currentItem.endDate}
                onChange={(e) => setCurrentItem({...currentItem, endDate: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} width={"100%"}>
              <TextField
                fullWidth
                label="Description"
                placeholder="Detail your responsibilities and achievements"
                variant="outlined"
                multiline
                rows={4}
                value={currentItem.description}
                onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={addExperience}
            sx={{ mt: 2 }}
            disabled={!currentItem.company || !currentItem.position}
          >
            Add Experience
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

const CertificationsSection = ({ formData, updateForm }) => {
  const [certifications, setCertifications] = useState(formData.certifications || []);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    issuer: '',
    date: '',
    url: ''
  });

  const addCertification = () => {
    if (!currentItem.name || !currentItem.issuer) return;

    const newCertifications = [...certifications, currentItem];
    setCertifications(newCertifications);
    updateForm('certifications', newCertifications);
    setCurrentItem({
      name: '',
      issuer: '',
      date: '',
      url: ''
    });
  };

  const removeCertification = (index) => {
    const newCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(newCertifications);
    updateForm('certifications', newCertifications);
  };

  useEffect(() => {
    setCertifications(formData.certifications || []);
  }, [formData.certifications]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: "#fff" }}>Certifications & Licenses</Typography>
      {certifications.map((cert, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2, background: "#00574B", color: "#fff" }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ color: "#fff" }}>
              {cert.name}
            </Typography>
            <IconButton 
              color="error" 
              onClick={() => removeCertification(index)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="rgba(255,255,255,0.7)">
            {cert.issuer} ({cert.date})
          </Typography>
          {cert.url && (
            <Typography variant="body2" color="secondary" sx={{ mt: 1 }}>
              {cert.url}
            </Typography>
          )}
        </Paper>
      ))}
      
      <Card sx={{ mt: 3, background: "#00382f" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>Add New Certification</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} width={"49%"}>
              <TextField
                fullWidth
                label="Certificate Name*"
                placeholder="AWS Certified Solutions Architect"
                variant="outlined"
                value={currentItem.name}
                onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} width={"48%"}>
              <TextField
                fullWidth
                label="Issuing Organization*"
                placeholder="Amazon Web Services"
                variant="outlined"
                value={currentItem.issuer}
                onChange={(e) => setCurrentItem({...currentItem, issuer: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} width={"49%"}>
              <TextField
                fullWidth
                label="Issue Date"
                placeholder="MM/YYYY"
                variant="outlined"
                value={currentItem.date}
                onChange={(e) => setCurrentItem({...currentItem, date: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6} width={"100%"}>
              <TextField
                fullWidth
                label="Credential URL (optional)"
                placeholder="https://www.credential.net/..."
                variant="outlined"
                value={currentItem.url}
                onChange={(e) => setCurrentItem({...currentItem, url: e.target.value})}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={addCertification}
            sx={{ mt: 2 }}
            disabled={!currentItem.name || !currentItem.issuer}
          >
            Add Certification
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

const JobPreferencesSection = ({ formData, updateForm }) => {
  const [skills, setSkills] = useState(formData.skills || []);
  const [currentSkill, setCurrentSkill] = useState('');

  const addSkill = () => {
    if (currentSkill.trim() !== '') {
      const newSkills = [...skills, currentSkill.trim()];
      setSkills(newSkills);
      updateForm('skills', newSkills);
      setCurrentSkill('');
    }
  };

  const removeSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
    updateForm('skills', newSkills);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  useEffect(() => {
    setSkills(formData.skills || []);
  }, [formData.skills]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: "#fff" }}>Job Preferences & Skills</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} width={"49%"}>
          <TextField
            fullWidth
            label="Desired Job Title"
            placeholder="Software Engineer, Project Manager, etc."
            variant="outlined"
            value={formData.desiredJobTitle || ''}
            onChange={(e) => updateForm('desiredJobTitle', e.target.value)}
          />
        </Grid>
        
        <Grid item xs={12} md={6} width={"49%"}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ color: "#a7ffeb" }}>Job Type</InputLabel>
            <Select
              label="Job Type"
              value={formData.jobType || ''}
              onChange={(e) => updateForm('jobType', e.target.value)}
              sx={{ color: "#fff" }}
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
        
        <Grid item xs={12} md={6} width={"48%"}>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ color: "#a7ffeb" }}>Work Environment</InputLabel>
            <Select
              label="Work Environment"
              value={formData.workEnvironment || ''}
              onChange={(e) => updateForm('workEnvironment', e.target.value)}
              sx={{ color: "#fff" }}
            >
              <MenuItem value="">Select Work Environment</MenuItem>
              <MenuItem value="On-site">On-site</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} width={"100%"}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "#fff" }}>Desired Salary Range</Typography>
          <Grid container spacing={2} width={"100%"}>
            <Grid item xs={12} md={6} width={"49%"}>
              <TextField
                fullWidth
                label="Minimum"
                placeholder="50,000"
                variant="outlined"
                type="number"
                value={formData.salaryMin || ''}
                onChange={(e) => updateForm('salaryMin', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6} width={"48%"}>
              <TextField
                fullWidth
                label="Maximum"
                placeholder="80,000"
                variant="outlined"
                type="number"
                value={formData.salaryMax || ''}
                onChange={(e) => updateForm('salaryMax', e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} width={"49%"}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "#fff" }}>Availability</Typography>
          <FormControl fullWidth variant="outlined">
            <InputLabel sx={{ color: "#a7ffeb" }}>Availability</InputLabel>
            <Select
              label="Availability"
              value={formData.availability || ''}
              onChange={(e) => updateForm('availability', e.target.value)}
              sx={{ color: "#fff" }}
            >
              <MenuItem value="">Select Availability</MenuItem>
              <MenuItem value="Immediately">Immediately</MenuItem>
              <MenuItem value="2 weeks">2 weeks</MenuItem>
              <MenuItem value="1 month">1 month</MenuItem>
              <MenuItem value="More than 1 month">More than 1 month</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} width={"100%"}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "#fff" }}>Skills</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={() => removeSkill(index)}
                color="primary"
                sx={{ bgcolor: "#00897b", color: "#fff" }}
                variant="outlined"
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Add a skill"
              placeholder="e.g., JavaScript, Project Management"
              variant="outlined"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              variant="contained"
              onClick={addSkill}
              startIcon={<AddIcon />}
              sx={{ minWidth: '120px', backgroundColor: "#00897b", "&:hover": { backgroundColor: "#00695c" } }}
              disabled={!currentSkill.trim()}
            >
              Add
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// Main component
export default function ProfileSetup() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const steps = ['Personal Info', 'Education', 'Experience', 'Certifications', 'Job Preferences'];

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    jobTitle: '',
    email: currentUser?.email || '',
    phone: '',
    location: '',
    summary: '',
    education: [],
    experience: [],
    certifications: [],
    desiredJobTitle: '',
    jobType: '',
    workEnvironment: '',
    salaryMin: '',
    salaryMax: '',
    availability: '',
    skills: []
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        if (!currentUser) return;
        const employeeDataRef = doc(collection(db, 'employees', currentUser.uid, 'employee data'), 'profile');
        const docSnap = await getDoc(employeeDataRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            fullName: data.personalInfo?.fullName || '',
            jobTitle: data.personalInfo?.jobTitle || '',
            email: data.personalInfo?.email || currentUser.email || '',
            phone: data.personalInfo?.phone || '',
            location: data.personalInfo?.location || '',
            summary: data.personalInfo?.summary || '',
            education: data.education || [],
            experience: data.experience || [],
            certifications: data.certifications || [],
            desiredJobTitle: data.jobPreferences?.desiredJobTitle || '',
            jobType: data.jobPreferences?.jobType || '',
            workEnvironment: data.jobPreferences?.workEnvironment || '',
            salaryMin: data.jobPreferences?.salaryMin || '',
            salaryMax: data.jobPreferences?.salaryMax || '',
            availability: data.jobPreferences?.availability || '',
            skills: data.skills || []
          });
        }
      } catch (error) {
        setError('Failed to load profile data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [currentUser]);

  const updateForm = (field, value) => setFormData({ ...formData, [field]: value });

  const handleNext = () => {
    if (activeStep === 0 && (!formData.fullName || !formData.jobTitle || !formData.email)) {
      setError('Please fill in all required fields (Name, Job Title, Email)');
      return;
    }
    setError(null);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setError(null);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);
      if (!currentUser) throw new Error('No authenticated user found');
      const userProfile = {
        personalInfo: {
          fullName: formData.fullName,
          jobTitle: formData.jobTitle,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          summary: formData.summary
        },
        education: formData.education || [],
        experience: formData.experience || [],
        certifications: formData.certifications || [],
        jobPreferences: {
          desiredJobTitle: formData.desiredJobTitle,
          jobType: formData.jobType,
          workEnvironment: formData.workEnvironment,
          salaryMin: formData.salaryMin,
          salaryMax: formData.salaryMax,
          availability: formData.availability
        },
        skills: formData.skills || [],
        metadata: {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          profileComplete: true
        }
      };
      const basicUserInfo = {
        displayName: formData.fullName,
        email: formData.email,
        jobTitle: formData.jobTitle,
        profileComplete: true,
        lastUpdated: serverTimestamp()
      };
      const userDocRef = doc(db, 'employees', currentUser.uid);
      await setDoc(userDocRef, basicUserInfo, { merge: true });
      const employeeDataRef = doc(collection(db, 'employees', currentUser.uid, 'employee data'), 'profile');
      await setDoc(employeeDataRef, userProfile, { merge: true });

      setSuccess(true);
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 1500);

    } catch (error) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0: return <PersonalInfoSection formData={formData} updateForm={updateForm} />;
      case 1: return <EducationSection formData={formData} updateForm={updateForm} />;
      case 2: return <ExperienceSection formData={formData} updateForm={updateForm} />;
      case 3: return <CertificationsSection formData={formData} updateForm={updateForm} />;
      case 4: return <JobPreferencesSection formData={formData} updateForm={updateForm} />;
      default: return 'Unknown step';
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: "100vh", bgcolor: "#002b23", pt: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={60} color="success" />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Navbar/>
      <Box sx={{ minHeight: "100vh", bgcolor: "#002b23", pb: 0 }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper elevation={0} sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: "12px",
            backgroundColor: "#004d40",
            color: "white",
            minHeight: { xs: "auto", sm: "70vh" },
            border: "3px solid #00A389",
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.12)",
          }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ color: "#fff" }}>
                Set Up Your CareerCatalyst Profile
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Complete your profile to generate your AI-powered resume
              </Typography>
            </Box>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, color: "#fff" }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel sx={{ color: "#fff", '& .MuiStepLabel-label': { color: "#fff" } }}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Divider sx={{ mb: 4, borderColor: "#00A389" }} />

            <Box>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Profile saved successfully! Redirecting to dashboard...
                </Alert>
              )}

              {getStepContent(activeStep)}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBack}
                  disabled={activeStep === 0 || saving}
                  sx={{
                    color: "#fff",
                    borderColor: "#00A389",
                    "&:hover": { borderColor: "#00897b", background: "rgba(0,137,123,0.15)" }
                  }}
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="success"
                    endIcon={saving ? <CircularProgress size={24} color="inherit" /> : <CheckIcon />}
                    onClick={handleSubmit}
                    disabled={saving}
                    sx={{
                      backgroundColor: "#00897b",
                      "&:hover": { backgroundColor: "#00695c" }
                    }}
                  >
                    {saving ? 'Saving...' : 'Complete Profile'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleNext}
                    disabled={saving}
                    sx={{
                      backgroundColor: "#00897b",
                      "&:hover": { backgroundColor: "#00695c" }
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}