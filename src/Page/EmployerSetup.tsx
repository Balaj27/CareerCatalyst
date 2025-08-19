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
  Container,
  Divider,
  Grid,
  Paper,
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
    primary: { main: "#004d40" },
    secondary: { main: "#00897b" },
    background: { default: "#002b23", paper: "#004d40" },
    text: { primary: "#fff", secondary: "rgba(255,255,255,0.7)" },
    success: { main: "#00A389" }
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
        root: { backgroundColor: "#004d40", color: "#fff", borderRadius: 10 }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: "none", fontWeight: 600 }
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "12px",
          '& .MuiOutlinedInput-root': {
            color: "white",
            background: "rgba(255,255,255,0.03)",
            '& fieldset': { borderColor: "#00A389" },
            '&:hover fieldset': { borderColor: "#00A389" },
            '&.Mui-focused fieldset': { borderColor: "#00A389" },
          },
          '& .MuiInputLabel-root': { color: "#a7ffeb" },
          '& .MuiInputLabel-root.Mui-focused': { color: "#00A389" },
        }
      }
    }
  }
});

// --- Section Components ---
const CompanyInfoSection = ({ formData, updateForm }) => (
  <Box>
    <Typography variant="h5" gutterBottom sx={{ color: "#fff" }}>Company Information</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} width={"49%"}>
        <TextField
          fullWidth label="Company Name" placeholder="Acme Corporation"
          variant="outlined" value={formData.companyName || ''}
          onChange={e => updateForm('companyName', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} md={6} width={"48%"}>
        <TextField
          fullWidth label="Company Website" placeholder="https://www.acme.com"
          variant="outlined" value={formData.companyWebsite || ''}
          onChange={e => updateForm('companyWebsite', e.target.value)}
        />
      </Grid>
      
      <Grid item xs={12} md={6} width={"49%"}>
        <TextField
          fullWidth label="Location" placeholder="City, Country"
          variant="outlined" value={formData.companyLocation || ''}
          onChange={e => updateForm('companyLocation', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} width={"100%"}>
        <TextField
          fullWidth label="Company Description"
          placeholder="Brief overview of your company, mission, and culture..."
          variant="outlined" multiline rows={4}
          value={formData.companyDescription || ''}
          onChange={e => updateForm('companyDescription', e.target.value)}
        />
      </Grid>
    </Grid>
  </Box>
);

// Add additional sections if needed, e.g., for posting initial job, team members, etc.

export default function EmployerSetup() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const steps = ['Company Info'];

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    companyWebsite: '',
    companyLocation: '',
    companyDescription: ''
  });

  useEffect(() => {
    const loadEmployerData = async () => {
      try {
        if (!currentUser) return;
        const employerDataRef = doc(collection(db, 'employers', currentUser.uid, 'employer data'), 'profile');
        const docSnap = await getDoc(employerDataRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            companyName: data.companyInfo?.companyName || '',
            companyWebsite: data.companyInfo?.companyWebsite || '',
            companyLocation: data.companyInfo?.companyLocation || '',
            companyDescription: data.companyInfo?.companyDescription || '',
          });
        }
      } catch (error) {
        setError('Failed to load employer data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    loadEmployerData();
  }, [currentUser]);

  const updateForm = (field, value) => setFormData({ ...formData, [field]: value });

  const handleNext = () => {
    if (activeStep === 0 && !formData.companyName) {
      setError('Please fill in required fields (Company Name)');
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
      const companyProfile = {
        companyInfo: {
          companyName: formData.companyName,
          companyWebsite: formData.companyWebsite,
          companyLocation: formData.companyLocation,
          companyDescription: formData.companyDescription
        },
        metadata: {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          profileComplete: true
        }
      };
      const basicCompanyInfo = {
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        companyLocation: formData.companyLocation,
        profileComplete: true,
        lastUpdated: serverTimestamp()
      };
      const companyDocRef = doc(db, 'employers', currentUser.uid);
      await setDoc(companyDocRef, basicCompanyInfo, { merge: true });
      const employerDataRef = doc(collection(db, 'employers', currentUser.uid, 'employer data'), 'profile');
      await setDoc(employerDataRef, companyProfile, { merge: true });

      setSuccess(true);
      setTimeout(() => {
        navigate('/employer-dashboard');
      }, 1500);

    } catch (error) {
      setError('Failed to save employer profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0: return <CompanyInfoSection formData={formData} updateForm={updateForm} />;
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
            minHeight: { xs: "auto", sm: "50vh" },
            border: "3px solid #00A389",
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.12)",
          }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ color: "#fff" }}>
                Set Up Your Company Profile
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Complete your company profile to post jobs and access employer dashboard
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
                  Company profile saved successfully! Redirecting to dashboard...
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