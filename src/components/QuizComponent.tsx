"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
} from "@mui/material"
import { ArrowBack, Timer as TimerIcon, BarChart as BarChartIcon } from "@mui/icons-material"
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
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes
  const [loading, setLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  // Generate questions using AI
  useEffect(() => {
    generateQuestions()
  }, [jobTitle, difficulty])

  // Timer
  useEffect(() => {
    if (loading || quizCompleted) return

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
  }, [loading, quizCompleted])

  const generateQuestions = async () => {
    setLoading(true)
    try {
      const generatedQuestions = await generateMCQs(jobTitle, difficulty, 15)
      setQuestions(generatedQuestions)
      setSelectedAnswers(new Array(15).fill(-1))
    } catch (error) {
      console.error("Error generating questions:", error)
      // Fallback to sample questions
      setQuestions(getSampleQuestions())
      setSelectedAnswers(new Array(15).fill(-1))
    }
    setLoading(false)
  }

  const getSampleQuestions = (): Question[] => {
    const sampleQuestions = [
      {
        id: 1,
        question: `What is a key skill required for a ${jobTitle}?`,
        options: ["Communication", "Technical expertise", "Problem-solving", "All of the above"],
        correctAnswer: 3,
        explanation: "All these skills are essential for success in this role.",
      },
      {
        id: 2,
        question: `Which programming language is commonly used in ${jobTitle} positions?`,
        options: ["Python", "JavaScript", "Java", "Depends on the specific role"],
        correctAnswer: 3,
        explanation: "The choice of programming language depends on the specific requirements of the role and company.",
      },
      {
        id: 3,
        question: `What is the most important aspect of ${jobTitle} work?`,
        options: ["Speed", "Quality", "Collaboration", "All are equally important"],
        correctAnswer: 3,
        explanation: "Success in this role requires balancing speed, quality, and collaboration.",
      },
    ]

    // Repeat questions to reach 15
    const questions: Question[] = []
    for (let i = 0; i < 15; i++) {
      const baseQuestion = sampleQuestions[i % sampleQuestions.length]
      questions.push({
        ...baseQuestion,
        id: i + 1,
        question: baseQuestion.question.replace(/\${jobTitle}/g, jobTitle),
      })
    }

    return questions
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = () => {
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

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "#4caf50"
    if (percentage >= 60) return "#ff9800"
    return "#f44336"
  }

  if (loading) {
    return (
      <Box
        sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Card sx={{ p: 4, textAlign: "center", minWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Generating Questions...
          </Typography>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Creating personalized questions for {jobTitle} ({difficulty} level)
          </Typography>
        </Card>
      </Box>
    )
  }

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
              Quiz Completed!
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

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
              <Chip label={`Job: ${jobTitle}`} sx={{ bgcolor: "#00695c", color: "white" }} />
              <Chip label={`Level: ${difficulty}`} sx={{ bgcolor: "#00897b", color: "white" }} />
            </Box>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button variant="outlined" onClick={onBack} sx={{ px: 3, py: 1.5, borderRadius: 2 }}>
                Take Another Quiz
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{ px: 3, py: 1.5, borderRadius: 2, bgcolor: "#00695c" }}
              >
                Back to Home
              </Button>
            </Box>
          </Card>
        </Container>
      </Box>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

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
            </Box>
            <Chip
              icon={<TimerIcon />}
              label={formatTime(timeLeft)}
              sx={{
                bgcolor: timeLeft < 300 ? "rgba(244, 67, 54, 0.2)" : "rgba(255,255,255,0.2)",
                color: "white",
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
              {jobTitle} • {difficulty}
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Paper>

        {/* Question */}
        <Card elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
              {currentQ?.question}
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedAnswers[currentQuestion]}
                onChange={(e) => handleAnswerSelect(Number.parseInt(e.target.value))}
              >
                {currentQ?.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio />}
                    label={option}
                    sx={{
                      mb: 2,
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      "&:hover": { bgcolor: "#f5f5f5" },
                      ...(selectedAnswers[currentQuestion] === index && {
                        bgcolor: "#e8f5e8",
                        border: "2px solid #00695c",
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
            sx={{ px: 3, py: 1.5, borderRadius: 2, bgcolor: "#017d6eff", color: "white", "&:hover": { bgcolor: "#004d40" } }}
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
