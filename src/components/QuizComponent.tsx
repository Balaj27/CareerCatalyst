"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Paper,
  Chip,
  AppBar,
  Toolbar,
  Alert,
} from "@mui/material"
import { ArrowBack, Timer as TimerIcon, BarChart as BarChartIcon, Refresh, Error as ErrorIcon } from "@mui/icons-material"
import { generateMCQs } from "../Services/McqApi"
import Footer from "../components/Footer"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizComponentProps {
  jobTitle: string
  difficulty: string
  onBack: () => void
}

const QuizComponent: React.FC<QuizComponentProps> = ({ jobTitle, difficulty, onBack }) => {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState<number>(900) // 15 minutes
  const [loading, setLoading] = useState<boolean>(true)
  const [showResults, setShowResults] = useState<boolean>(false)
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState<number>(0)
  const [generationAttempt, setGenerationAttempt] = useState<number>(0)

  // Generate questions using AI - NO FALLBACK
  useEffect(() => {
    generateQuestions()
  }, [jobTitle, difficulty, generationAttempt])

  // Timer
  useEffect(() => {
    if (loading || quizCompleted || error) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, quizCompleted, error])

  const generateQuestions = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      console.log(`🚀 Generating unique questions for ${jobTitle} (${difficulty}) - Attempt ${retryCount + 1}`)
      
      // Call the AI API - this should generate unique questions each time
      const generatedQuestions = await generateMCQs(jobTitle, difficulty, 15)
      
      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error("No questions received from AI")
      }

      console.log(`✅ Successfully received ${generatedQuestions.length} questions`)
      console.log("Sample question:", generatedQuestions[0]?.question.substring(0, 100) + "...")
      
      setQuestions(generatedQuestions)
      setSelectedAnswers(new Array(generatedQuestions.length).fill(-1))
      setError(null)
      setRetryCount(0)
      
    } catch (error: any) {
      console.error("❌ Error generating questions:", error)
      const errorMessage = error.message || "Unknown error occurred"
      setError(`Failed to generate AI questions: ${errorMessage}`)
      setQuestions([])
      setRetryCount(prev => prev + 1)
    }
    
    setLoading(false)
  }

  const handleRetry = (): void => {
    setGenerationAttempt(prev => prev + 1)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answerIndex: number): void => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = (): void => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = (): void => {
    setQuizCompleted(true)
    setShowResults(true)
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) }
  }

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return "#4caf50"
    if (percentage >= 60) return "#ff9800"
    return "#f44336"
  }

  // Loading State
  if (loading) {
    return (
      <Box
        sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Card sx={{ p: 4, textAlign: "center", minWidth: 400, maxWidth: 500 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "#00695c" }}>
            🤖 AI Generating Unique Questions...
          </Typography>
          <LinearProgress sx={{ mb: 3, height: 6, borderRadius: 3 }} />
          <Typography variant="body1" color="text.primary" sx={{ mb: 1, fontWeight: "medium" }}>
            Creating personalized {jobTitle} questions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Difficulty: {difficulty} • Count: 15 questions
          </Typography>
          
          {retryCount > 0 && (
            <Alert severity="info" sx={{ mt: 2, textAlign: "left" }}>
              <Typography variant="body2">
                <strong>Retry {retryCount + 1}:</strong> Ensuring questions are unique for your {jobTitle} role
              </Typography>
            </Alert>
          )}
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
            Please wait while we generate fresh questions...
          </Typography>
        </Card>
      </Box>
    )
  }

  // Error State - NO FALLBACK, Force User to Retry
  if (error || questions.length === 0) {
    return (
      <Box
        sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Card sx={{ p: 4, textAlign: "center", maxWidth: 600 }}>
          <ErrorIcon sx={{ fontSize: 48, color: "#f44336", mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, color: "#f44336", fontWeight: "bold" }}>
            Unable to Generate Questions
          </Typography>
          
          <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>
            <Typography variant="body2">
              <strong>Error:</strong> {error || "No questions were generated"}
            </Typography>
          </Alert>
          
          <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            We're trying to generate unique, AI-powered questions for:
          </Typography>
          
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3 }}>
            <Chip label={jobTitle} sx={{ bgcolor: "#00695c", color: "white" }} />
            <Chip label={difficulty} sx={{ bgcolor: "#00897b", color: "white" }} />
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            This ensures you get fresh, relevant questions each time. No generic templates!
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button 
              variant="contained" 
              onClick={handleRetry}
              startIcon={<Refresh />}
              sx={{ 
                bgcolor: "#00695c", 
                "&:hover": { bgcolor: "#004d40" },
                px: 3, 
                py: 1.5 
              }}
            >
              Try Again
            </Button>
            <Button 
              variant="outlined" 
              onClick={onBack}
              sx={{ px: 3, py: 1.5 }}
            >
              Back to Setup
            </Button>
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: "block" }}>
            Attempts: {retryCount + 1} • Session: {generationAttempt + 1}
          </Typography>
        </Card>
      </Box>
    )
  }

  // Results State
  if (showResults) {
    const score = calculateScore()
    return (
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{ background: "linear-gradient(135deg, #00695c 0%, #004d40 100%)" }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ py: 2 }}>
              <BarChartIcon sx={{ color: "white", fontSize: 28, mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                CareerCatalyst - Quiz Results
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="md" sx={{ pt: 4 }}>
          <Card elevation={3} sx={{ borderRadius: 3, p: 4, textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
              🎉 Quiz Completed!
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: "bold",
                  color: getScoreColor(score.percentage),
                  mb: 2,
                }}
              >
                {score.percentage}%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                You scored {score.correct} out of {score.total} questions correctly
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4, flexWrap: "wrap" }}>
              <Chip label={`Job: ${jobTitle}`} sx={{ bgcolor: "#00695c", color: "white" }} />
              <Chip label={`Level: ${difficulty}`} sx={{ bgcolor: "#00897b", color: "white" }} />
              <Chip label="🤖 AI Generated" sx={{ bgcolor: "#4caf50", color: "white" }} />
              <Chip label="Unique Questions" sx={{ bgcolor: "#2196f3", color: "white" }} />
            </Box>

            <Alert severity="success" sx={{ mb: 3, textAlign: "left" }}>
              <Typography variant="body2">
                <strong>🎯 Personalized Quiz:</strong> These questions were uniquely generated by AI specifically for your {jobTitle} role at {difficulty} level. 
                Taking the quiz again will generate completely different questions!
              </Typography>
            </Alert>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button 
                variant="outlined" 
                onClick={onBack} 
                sx={{ px: 3, py: 1.5, borderRadius: 2 }}
              >
                📝 Generate New Quiz
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{ px: 3, py: 1.5, borderRadius: 2, bgcolor: "#00695c" }}
              >
                🏠 Back to Home
              </Button>
            </Box>
          </Card>
        </Container>
      </Box>
    )
  }

  // Quiz Interface
  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (!currentQ) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Alert severity="error">
          <Typography>Question not found. Please restart the quiz.</Typography>
          <Button onClick={onBack} sx={{ mt: 2 }}>Back to Setup</Button>
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#00695c", pb: 4 }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ background: "linear-gradient(135deg, #00695c 0%, #004d40 100%)" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 2, justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mr: 2, color: "white" }}>
                Back
              </Button>
              <BarChartIcon sx={{ color: "white", fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                CareerCatalyst Quiz
              </Typography>
              <Chip 
                label="🤖 AI Generated" 
                size="small" 
                sx={{ 
                  ml: 2, 
                  bgcolor: "rgba(76,175,80,0.8)", 
                  color: "white",
                  fontWeight: "bold"
                }} 
              />
            </Box>
            <Chip
              icon={<TimerIcon />}
              label={formatTime(timeLeft)}
              sx={{
                bgcolor: timeLeft < 300 ? "rgba(244, 67, 54, 0.8)" : "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: "bold"
              }}
            />
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ pt: 4 }}>
        {/* Progress */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">
              Question {currentQuestion + 1} of {questions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {jobTitle} • {difficulty} • AI Powered
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Paper>

        {/* Question */}
        <Card elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4, lineHeight: 1.4 }}>
              {currentQ.question}
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedAnswers[currentQuestion] !== -1 ? selectedAnswers[currentQuestion] : ""}
                onChange={(e) => handleAnswerSelect(Number.parseInt(e.target.value))}
              >
                {currentQ.options.map((option, index) => (
                  <FormControlLabel
                    key={`option-${index}`}
                    value={index}
                    control={<Radio />}
                    label={option}
                    sx={{
                      mb: 2,
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      transition: "all 0.2s ease",
                      "&:hover": { 
                        bgcolor: "#f5f5f5",
                        borderColor: "#00695c"
                      },
                      ...(selectedAnswers[currentQuestion] === index && {
                        bgcolor: "#e8f5e8",
                        border: "2px solid #00695c",
                        transform: "scale(1.02)"
                      }),
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            sx={{ 
              px: 3, 
              py: 1.5, 
              borderRadius: 2, 
              bgcolor: "#017d6eff", 
              color: "white", 
              "&:hover": { bgcolor: "#004d40" },
              "&:disabled": { bgcolor: "#ccc", color: "#666" }
            }}
          >
            Previous
          </Button>

          <Box sx={{ display: "flex", gap: 2 }}>
            {currentQuestion === questions.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmitQuiz}
                sx={{
                  bgcolor: "#00695c",
                  "&:hover": { bgcolor: "#017d6eff" },
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold"
                }}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  bgcolor: "#017d6eff",
                  "&:hover": { bgcolor: "#004d40" },
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  )
}

export default QuizComponent