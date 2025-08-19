import  React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Chip,
  AppBar,
  Toolbar,
} from "@mui/material"
import { ArrowBack, Quiz as QuizIcon, BarChart as BarChartIcon } from "@mui/icons-material"
import QuizComponent from "../components/QuizComponent"
import Footer from "../components/Footer"

const jobTitles = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
  "DevOps Engineer",
  "Business Analyst",
  "Marketing Manager",
  "Sales Representative",
  "Project Manager",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Machine Learning Engineer",
  "Cybersecurity Analyst",
  "Digital Marketing Specialist",
]

const difficultyLevels = [
  { value: "beginner", label: "Beginner", description: "Basic concepts and fundamentals" },
  { value: "intermediate", label: "Intermediate", description: "Moderate complexity with practical scenarios" },
  { value: "advanced", label: "Advanced", description: "Complex problems and expert-level questions" },
]

const MCQsPage = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedJob, setSelectedJob] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [showQuiz, setShowQuiz] = useState(false)

  const steps = ["Select Job Title", "Choose Difficulty", "Take Quiz"]

  const handleStartQuiz = () => {
    if (selectedJob && selectedDifficulty) {
      setShowQuiz(true)
      setCurrentStep(2)
    }
  }

  const handleNext = () => {
    if (currentStep === 0 && selectedJob) {
      setCurrentStep(1)
    } else if (currentStep === 1 && selectedDifficulty) {
      handleStartQuiz()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setShowQuiz(false)
    }
  }

  if (showQuiz) {
    return (
      <QuizComponent
        jobTitle={selectedJob}
        difficulty={selectedDifficulty}
        onBack={() => {
          setShowQuiz(false)
          setCurrentStep(1)
        }}
      />
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#00695c" }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ background: "linear-gradient(135deg, #00695c 0%, #004d40 100%)" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 2, justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button startIcon={<ArrowBack />} onClick={() => navigate("/")} sx={{ mr: 2, color: "white" }}>
                Back to Home
              </Button>
              <BarChartIcon sx={{ color: "white", fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                CareerCatalyst
              </Typography>
            </Box>
            <Chip icon={<QuizIcon />} label="MCQ Practice" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }} />
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
        {/* Progress Stepper */}
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, background: "#00695c" }}>
          <Stepper activeStep={currentStep} alternativeLabel >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Step Content */}
        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {currentStep === 0 && (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
                  Select Your Target Job Title
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
                  Choose the job role you're preparing for to get relevant questions
                </Typography>

                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel>Job Title</InputLabel>
                  <Select value={selectedJob} label="Job Title" onChange={(e) => setSelectedJob(e.target.value)}>
                    {jobTitles.map((job) => (
                      <MenuItem key={job} value={job}>
                        {job}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleNext}
                    disabled={!selectedJob}
                    sx={{
                      bgcolor: "#00695c",
                      "&:hover": { bgcolor: "#004d40" },
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    Continue
                  </Button>
                </Box>
              </Box>
            )}

            {currentStep === 1 && (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
                  Choose Difficulty Level
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
                  Selected Job: <strong>{selectedJob}</strong>
                </Typography>

                <Box sx={{ mb: 4 }}>
                  {difficultyLevels.map((level) => (
                    <Card
                      key={level.value}
                      sx={{
                        mb: 2,
                        cursor: "pointer",
                        border: selectedDifficulty === level.value ? "2px solid #00695c" : "1px solid #e0e0e0",
                        "&:hover": { boxShadow: 3 },
                      }}
                      onClick={() => setSelectedDifficulty(level.value)}
                    >
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                              {level.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {level.description}
                            </Typography>
                          </Box>
                          {selectedDifficulty === level.value && (
                            <Chip label="Selected" sx={{ bgcolor: "#00695c", color: "white" }} size="small" />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="outlined" onClick={handleBack} sx={{ px: 3, py: 1.5, borderRadius: 2 }}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleNext}
                    disabled={!selectedDifficulty}
                    sx={{
                      bgcolor: "#00695c",
                      "&:hover": { bgcolor: "#004d40" },
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    Start Quiz
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
      
      <Footer/>
    </Box>
  )
}

export default MCQsPage
