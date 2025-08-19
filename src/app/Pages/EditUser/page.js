// app/Pages/EditUser/page.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  TextField,
  Divider,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import Head from 'next/head';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


// Education Section Component
const EducationSection = ({ education, updateArrayField, addEducation, removeEducation }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 500,
            color: "text.primary" 
          }}
        >
          Education
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />}
          onClick={addEducation}
        >
          Add Education
        </Button>
      </Box>
      
      {education.map((edu, index) => (
        <Accordion key={index} defaultExpanded={index === 0} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {edu.institution ? edu.institution : `Education #${index + 1}`}
              {edu.degree ? ` - ${edu.degree}` : ''}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Institution"
                  placeholder="University/College Name"
                  variant="outlined"
                  value={edu.institution}
                  onChange={(e) => updateArrayField('education', index, 'institution', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Degree"
                  placeholder="e.g. Bachelor's, Master's"
                  variant="outlined"
                  value={edu.degree}
                  onChange={(e) => updateArrayField('education', index, 'degree', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Field of Study"
                  placeholder="e.g. Computer Science"
                  variant="outlined"
                  value={edu.fieldOfStudy}
                  onChange={(e) => updateArrayField('education', index, 'fieldOfStudy', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="month"
                  variant="outlined"
                  value={edu.startDate}
                  onChange={(e) => updateArrayField('education', index, 'startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="month"
                  variant="outlined"
                  value={edu.endDate}
                  onChange={(e) => updateArrayField('education', index, 'endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  placeholder="Achievements, activities, etc."
                  variant="outlined"
                  multiline
                  rows={3}
                  value={edu.description}
                  onChange={(e) => updateArrayField('education', index, 'description', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  color="error" 
                  startIcon={<DeleteIcon />} 
                  onClick={() => removeEducation(index)}
                  disabled={education.length <= 1}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

// Experience Section Component
const ExperienceSection = ({ experience, updateArrayField, addExperience, removeExperience }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 500,
            color: "text.primary" 
          }}
        >
          Experience
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />}
          onClick={addExperience}
        >
          Add Experience
        </Button>
      </Box>
      
      {experience.map((exp, index) => (
        <Accordion key={index} defaultExpanded={index === 0} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {exp.position ? exp.position : `Position #${index + 1}`}
              {exp.company ? ` at ${exp.company}` : ''}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  placeholder="Company Name"
                  variant="outlined"
                  value={exp.company}
                  onChange={(e) => updateArrayField('experience', index, 'company', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Position"
                  placeholder="e.g. Software Engineer"
                  variant="outlined"
                  value={exp.position}
                  onChange={(e) => updateArrayField('experience', index, 'position', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  placeholder="City, Country"
                  variant="outlined"
                  value={exp.location}
                  onChange={(e) => updateArrayField('experience', index, 'location', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="month"
                  variant="outlined"
                  value={exp.startDate}
                  onChange={(e) => updateArrayField('experience', index, 'startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={exp.current}
                        onChange={(e) => updateArrayField('experience', index, 'current', e.target.checked)}
                      />
                    }
                    label="Current Position"
                  />
                </Box>
              </Grid>
              {!exp.current && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="month"
                    variant="outlined"
                    value={exp.endDate}
                    onChange={(e) => updateArrayField('experience', index, 'endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  placeholder="Responsibilities, achievements, etc."
                  variant="outlined"
                  multiline
                  rows={3}
                  value={exp.description}
                  onChange={(e) => updateArrayField('experience', index, 'description', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  color="error" 
                  startIcon={<DeleteIcon />} 
                  onClick={() => removeExperience(index)}
                  disabled={experience.length <= 1}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

// Certifications Section Component
const CertificationsSection = ({ certifications, updateArrayField, addCertification, removeCertification }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 500,
            color: "text.primary" 
          }}
        >
          Certifications
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />}
          onClick={addCertification}
        >
          Add Certification
        </Button>
      </Box>
      
      {certifications.map((cert, index) => (
        <Accordion key={index} defaultExpanded={index === 0} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {cert.name ? cert.name : `Certification #${index + 1}`}
              {cert.organization ? ` - ${cert.organization}` : ''}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Certification Name"
                  placeholder="e.g. AWS Certified Solutions Architect"
                  variant="outlined"
                  value={cert.name}
                  onChange={(e) => updateArrayField('certifications', index, 'name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Issuing Organization"
                  placeholder="e.g. Amazon Web Services"
                  variant="outlined"
                  value={cert.organization}
                  onChange={(e) => updateArrayField('certifications', index, 'organization', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Issue Date"
                  type="month"
                  variant="outlined"
                  value={cert.issueDate}
                  onChange={(e) => updateArrayField('certifications', index, 'issueDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  type="month"
                  variant="outlined"
                  value={cert.expiryDate}
                  onChange={(e) => updateArrayField('certifications', index, 'expiryDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Credential ID"
                  placeholder="e.g. ABC123XYZ"
                  variant="outlined"
                  value={cert.credentialID}
                  onChange={(e) => updateArrayField('certifications', index, 'credentialID', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  color="error" 
                  startIcon={<DeleteIcon />} 
                  onClick={() => removeCertification(index)}
                  disabled={certifications.length <= 1}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

// Job Preferences Section Component
const JobPreferencesSection = ({ jobPreferences, updateNestedField }) => {
  return (
    <Box>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 4, 
          fontWeight: 500,
          color: "text.primary" 
        }}
      >
        Job Preferences
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Desired Role"
            placeholder="e.g. Senior Software Engineer"
            variant="outlined"
            value={jobPreferences.desiredRole}
            onChange={(e) => updateNestedField('jobPreferences', 'desiredRole', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Desired Industry"
            placeholder="e.g. Technology, Finance"
            variant="outlined"
            value={jobPreferences.desiredIndustry}
            onChange={(e) => updateNestedField('jobPreferences', 'desiredIndustry', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="employment-type-label">Employment Type</InputLabel>
            <Select
              labelId="employment-type-label"
              value={jobPreferences.employmentType}
              label="Employment Type"
              onChange={(e) => updateNestedField('jobPreferences', 'employmentType', e.target.value)}
            >
              <MenuItem value="">Select Type</MenuItem>
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Freelance">Freelance</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Desired Salary"
            placeholder="e.g. $80,000 - $100,000"
            variant="outlined"
            value={jobPreferences.desiredSalary}
            onChange={(e) => updateNestedField('jobPreferences', 'desiredSalary', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="remote-preference-label">Remote Preference</InputLabel>
            <Select
              labelId="remote-preference-label"
              value={jobPreferences.remotePreference}
              label="Remote Preference"
              onChange={(e) => updateNestedField('jobPreferences', 'remotePreference', e.target.value)}
            >
              <MenuItem value="">Select Preference</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
              <MenuItem value="On-site">On-site</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
              <MenuItem value="Flexible">Flexible</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={jobPreferences.willingToRelocate}
                onChange={(e) => updateNestedField('jobPreferences', 'willingToRelocate', e.target.checked)}
              />
            }
            label="Willing to Relocate"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Availability"
            placeholder="e.g. Immediately, In 2 weeks, etc."
            variant="outlined"
            value={jobPreferences.availability}
            onChange={(e) => updateNestedField('jobPreferences', 'availability', e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  ); 

}
export default function EditProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // User profile form state
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    
    // Education
    education: [{
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: ''
    }],
    
    // Experience
    experience: [{
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }],
    
    // Certifications
    certifications: [{
      name: '',
      organization: '',
      issueDate: '',
      expiryDate: '',
      credentialID: ''
    }],
    
    // Job Preferences
    jobPreferences: {
      desiredRole: '',
      desiredIndustry: '',
      employmentType: '',
      desiredSalary: '',
      remotePreference: '',
      willingToRelocate: false,
      availability: ''
    }
  });

  // Handle form field updates
  const updateForm = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle nested object updates (for job preferences)
  const updateNestedField = (parentField, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value
      }
    }));
  };

  // Handle array field updates (education, experience, certifications)
  const updateArrayField = (arrayField, index, field, value) => {
    setFormData(prev => {
      const newArray = [...prev[arrayField]];
      newArray[index] = {
        ...newArray[index],
        [field]: value
      };
      return {
        ...prev,
        [arrayField]: newArray
      };
    });
  };

  // Add new item to array fields
  const addArrayItem = (arrayField, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      [arrayField]: [...prev[arrayField], defaultItem]
    }));
  };

  // Remove item from array fields
  const removeArrayItem = (arrayField, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayField]: prev[arrayField].filter((_, i) => i !== index)
    }));
  };

  // Mock function to simulate loading user data from API
  useEffect(() => {
    // In a real application, you would fetch user data here
    const fetchUserProfile = async () => {
      // Simulating API call
      setIsLoading(true);
      try {
        // Replace with actual API call
        // const response = await fetch('/api/user/profile');
        // const data = await response.json();
        
        // Simulated data
        const userData = {
          // Personal Info
          fullName: 'John Doe',
          jobTitle: 'Senior Software Engineer',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          location: 'New York, NY',
          summary: 'Experienced software engineer with 8+ years of expertise in web development, specializing in React, Next.js, and Node.js. Passionate about creating responsive, user-friendly applications with clean, maintainable code.',
          
          // Education
          education: [
            {
              institution: 'University of Technology',
              degree: 'Bachelor of Science',
              fieldOfStudy: 'Computer Science',
              startDate: '2012-09',
              endDate: '2016-05',
              description: 'Specialized in software engineering and data structures. Graduated with honors.'
            }
          ],
          
          // Experience
          experience: [
            {
              company: 'Tech Solutions Inc.',
              position: 'Senior Software Engineer',
              location: 'New York, NY',
              startDate: '2020-03',
              endDate: '',
              current: true,
              description: 'Lead developer for customer-facing web applications. Implemented CI/CD pipelines and reduced deployment time by 40%.'
            },
            {
              company: 'Digital Innovations',
              position: 'Software Developer',
              location: 'Boston, MA',
              startDate: '2016-06',
              endDate: '2020-02',
              current: false,
              description: 'Developed and maintained e-commerce platforms. Improved site performance by 25% through code optimization.'
            }
          ],
          
          // Certifications
          certifications: [
            {
              name: 'AWS Certified Solutions Architect',
              organization: 'Amazon Web Services',
              issueDate: '2021-08',
              expiryDate: '2024-08',
              credentialID: 'AWS-123456'
            }
          ],
          
          // Job Preferences
          jobPreferences: {
            desiredRole: 'Lead Software Engineer',
            desiredIndustry: 'Technology, Finance',
            employmentType: 'Full-time',
            desiredSalary: '$120,000 - $150,000',
            remotePreference: 'Hybrid',
            willingToRelocate: true,
            availability: 'Available with 2 weeks notice'
          }
        };
        
        // Update form with user data
        setFormData(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setNotification({
          open: true,
          message: 'Failed to load profile data',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real application, you would save the data to your backend
      // await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNotification({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <Head>
        <title>Edit Profile | My Resume Builder</title>
        <meta name="description" content="Edit your profile information" />
      </Head>

      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => router.back()}
            sx={{ mb: 3 }}
          >
            Back
          </Button>

          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              mb: 4, 
              fontWeight: 600,
              color: 'primary.main' 
            }}
          >
            Edit Profile
          </Typography>

          <Paper 
            elevation={2} 
            sx={{ 
              p: { xs: 2, sm: 4 }, 
              borderRadius: 2,
              mb: 4
            }}
          >
            <form onSubmit={handleSubmit}>
              <PersonalInfoSection formData={formData} updateForm={updateForm} />
              
              <Divider sx={{ my: 4 }} />
              
              <EducationSection 
                education={formData.education} 
                updateArrayField={updateArrayField} 
                addEducation={() => addArrayItem('education', {
                  institution: '',
                  degree: '',
                  fieldOfStudy: '',
                  startDate: '',
                  endDate: '',
                  description: ''
                })}
                removeEducation={index => removeArrayItem('education', index)}
              />
              
              <Divider sx={{ my: 4 }} />
              
              <ExperienceSection
                experience={formData.experience}
                updateArrayField={updateArrayField}
                addExperience={() => addArrayItem('experience', {
                  company: '',
                  position: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  description: ''
                })}
                removeExperience={index => removeArrayItem('experience', index)}
              />
              
              <Divider sx={{ my: 4 }} />
              
              <CertificationsSection
                certifications={formData.certifications}
                updateArrayField={updateArrayField}
                addCertification={() => addArrayItem('certifications', {
                  name: '',
                  organization: '',
                  issueDate: '',
                  expiryDate: '',
                  credentialID: ''
                })}
                removeCertification={index => removeArrayItem('certifications', index)}
              />
              
              <Divider sx={{ my: 4 }} />
              
              <JobPreferencesSection
                jobPreferences={formData.jobPreferences}
                updateNestedField={updateNestedField}
              />
              
              <Divider sx={{ my: 4 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  startIcon={<SaveIcon />}
                  disabled={isLoading}
                >
                  Save Changes
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

// Personal Information Component
const PersonalInfoSection = ({ formData, updateForm }) => {
  return (
    <Box>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mb: 4, 
          fontWeight: 500,
          color: "text.primary" 
        }}
      >
        Personal Information
      </Typography>
      
      <Grid container spacing={3}>
        {/* First row - Full name and Job Title */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            placeholder="John Doe"
            variant="outlined"
            size="medium"
            value={formData.fullName || ''}
            onChange={(e) => updateForm('fullName', e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              }
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Job Title"
            placeholder="Software Engineer"
            variant="outlined"
            size="medium"
            value={formData.jobTitle || ''}
            onChange={(e) => updateForm('jobTitle', e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              }
            }}
            required
          />
        </Grid>

        {/* Second row - Email and Phone */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            placeholder="john@example.com"
            variant="outlined"
            type="email"
            size="medium"
            value={formData.email || ''}
            onChange={(e) => updateForm('email', e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              }
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            placeholder="+1 (555) 123-4567"
            variant="outlined"
            size="medium"
            value={formData.phone || ''}
            onChange={(e) => updateForm('phone', e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              }
            }}
          />
        </Grid>

        {/* Third row - Location */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Location"
            placeholder="City, Country"
            variant="outlined"
            size="medium"
            value={formData.location || ''}
            onChange={(e) => updateForm('location', e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              }
            }}
          />
        </Grid>

        {/* Fourth row - Professional Summary */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Professional Summary"
            placeholder="Brief overview of your professional background and career goals..."
            variant="outlined"
            multiline
            rows={4}
            value={formData.summary || ''}
            onChange={(e) => updateForm('summary', e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};