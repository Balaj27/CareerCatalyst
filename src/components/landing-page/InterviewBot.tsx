"use client"

import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  ArrowBack,
  SmartToy as RobotIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as SpeakIcon,
  BarChart as BarChartIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
} from "@mui/icons-material"
import { generateInterviewQuestions, analyzeInterviewPerformance } from "../../Services/McqApi"

interface InterviewBotProps {
  jobTitle: string
  difficulty: string
  onBack: () => void
}

interface InterviewResponse {
  question: string
  answer: string
  duration: number
}

const InterviewBot: React.FC<InterviewBotProps> = ({ jobTitle, difficulty, onBack }) => {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<string[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [responses, setResponses] = useState<InterviewResponse[]>([])
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewCompleted, setInterviewCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [performanceAnalysis, setPerformanceAnalysis] = useState<any>(null)
  const [answerStartTime, setAnswerStartTime] = useState<number>(0)
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setCurrentAnswer(finalTranscript.trim())
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        if (event.error === "not-allowed") {
          setShowPermissionDialog(true)
        }
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    synthRef.current = window.speechSynthesis
    generateQuestions()

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [jobTitle, difficulty])

  const generateQuestions = async () => {
    setLoading(true)
    try {
      const generatedQuestions = await generateInterviewQuestions(jobTitle, difficulty, 8)
      setQuestions(generatedQuestions)
    } catch (error) {
      console.error("Error generating questions:", error)
      // Fallback questions
      setQuestions([
        `Tell me about yourself and your experience with ${jobTitle}.`,
        `What interests you most about this ${jobTitle} position?`,
        "Describe a challenging project you've worked on recently.",
        "How do you handle tight deadlines and pressure?",
        "What are your greatest strengths and how do they apply to this role?",
        "Where do you see yourself in 5 years?",
        "Do you have any questions for us?",
      ])
    }
    setLoading(false)
  }

  const speakText = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
        // Start listening after question is spoken
        if (interviewStarted && currentQuestionIndex < questions.length) {
          setTimeout(() => startListening(), 1000)
        }
      }

      synthRef.current.speak(utterance)
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setCurrentAnswer("")
      setAnswerStartTime(Date.now())
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const startInterview = () => {
    setInterviewStarted(true)
    setCurrentQuestionIndex(0)
    speakText(`Hello! I'm your AI interviewer. Let's begin the interview for the ${jobTitle} position. ${questions[0]}`)
  }

  const nextQuestion = () => {
    if (currentAnswer.trim()) {
      const duration = Date.now() - answerStartTime
      const newResponse: InterviewResponse = {
        question: questions[currentQuestionIndex],
        answer: currentAnswer,
        duration,
      }

      setResponses((prev) => [...prev, newResponse])
      setCurrentAnswer("")

      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1
        setCurrentQuestionIndex(nextIndex)
        speakText(`Thank you. Next question: ${questions[nextIndex]}`)
      } else {
        completeInterview([...responses, newResponse])
      }
    }
  }

  const completeInterview = async (allResponses: InterviewResponse[]) => {
    setInterviewCompleted(true)
    speakText("Thank you for completing the interview. I'm now analyzing your performance.")

    try {
      const analysis = await analyzeInterviewPerformance(jobTitle, difficulty, allResponses)
      setPerformanceAnalysis(analysis)
      setShowResults(true)
    } catch (error) {
      console.error("Error analyzing performance:", error)
      // Fallback analysis
      setPerformanceAnalysis({
        overallScore: 75,
        confidence: "Good",
        tone: "Professional",
        answerQuality: "Satisfactory",
        strengths: ["Clear communication", "Relevant experience"],
        improvements: ["Provide more specific examples", "Elaborate on technical skills"],
        feedback: "Overall good performance with room for improvement in providing detailed examples.",
      })
      setShowResults(true)
    }
  }

  const skipQuestion = () => {
    const duration = Date.now() - answerStartTime
    const newResponse: InterviewResponse = {
      question: questions[currentQuestionIndex],
      answer: "No response provided",
      duration,
    }

    setResponses((prev) => [...prev, newResponse])

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      speakText(`Moving to the next question: ${questions[nextIndex]}`)
    } else {
      completeInterview([...responses, newResponse])
    }
  }

  if (loading) {
    return (
      <Box
        sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Card sx={{ p: 4, textAlign: "center", minWidth: 300 }}>
          <Avatar sx={{ bgcolor: "#00695c", width: 60, height: 60, mx: "auto", mb: 2 }}>
            <RobotIcon sx={{ fontSize: 30 }} />
          </Avatar>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Preparing Interview...
          </Typography>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Setting up questions for {jobTitle} ({difficulty} level)
          </Typography>
        </Card>
      </Box>
    )
  }

  if (showResults && performanceAnalysis) {
    return (
      <Box sx={{ minHeight: "100vh", background: "#00695c" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{ background: "linear-gradient(135deg, #00695c 0%, #004d40 100%)" }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ py: 2 }}>
              <BarChartIcon sx={{ color: "white", fontSize: 28, mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                CareerCatalyst - Interview Results
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="md" sx={{ pt: 4 }}>
          <Card elevation={3} sx={{ borderRadius: 3, p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Avatar sx={{ bgcolor: "#00695c", width: 80, height: 80, mx: "auto", mb: 2 }}>
                <RobotIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                Interview Analysis Complete
              </Typography>
              <Typography variant="h2" sx={{ color: "#00695c", fontWeight: "bold", mb: 2 }}>
                {performanceAnalysis.overallScore}%
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Performance Breakdown:
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <Chip label={`Confidence: ${performanceAnalysis.confidence}`} color="primary" />
                <Chip label={`Tone: ${performanceAnalysis.tone}`} color="secondary" />
                <Chip label={`Answer Quality: ${performanceAnalysis.answerQuality}`} color="success" />
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#4caf50" }}>
                Strengths:
              </Typography>
              {performanceAnalysis.strengths?.map((strength: string, index: number) => (
                <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                  • {strength}
                </Typography>
              ))}
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#ff9800" }}>
                Areas for Improvement:
              </Typography>
              {performanceAnalysis.improvements?.map((improvement: string, index: number) => (
                <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                  • {improvement}
                </Typography>
              ))}
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Overall Feedback:
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {performanceAnalysis.feedback}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button variant="outlined" onClick={onBack} sx={{ px: 3, py: 1.5, borderRadius: 2 }}>
                Practice Again
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

  return (
    <Box sx={{ minHeight: "100vh", background: "#00695c" }}>
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
                AI Interview Bot
              </Typography>
            </Box>
            <Chip
              label={`${jobTitle} • ${difficulty}`}
              sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
            />
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ pt: 4 }}>
        {/* Progress */}
        {interviewStarted && (
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={((currentQuestionIndex + 1) / questions.length) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Paper>
        )}

        {/* Main Interview Card */}
        <Card elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            {/* Robot Avatar */}
            <Avatar
              sx={{
                bgcolor: isSpeaking ? "#4caf50" : "#00695c",
                width: 120,
                height: 120,
                mx: "auto",
                mb: 3,
                transition: "all 0.3s ease",
                animation: isSpeaking ? "pulse 1.5s infinite" : "none",
              }}
            >
              <RobotIcon sx={{ fontSize: 60 }} />
            </Avatar>

            {!interviewStarted ? (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                  Ready to Start Your Interview?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  I'll ask you {questions.length} questions about the {jobTitle} position. Speak clearly and take your
                  time to answer each question.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={startInterview}
                  sx={{
                    bgcolor: "#00695c",
                    "&:hover": { bgcolor: "#004d40" },
                    px: 4,
                    py: 2,
                    borderRadius: 3,
                    fontSize: "1.1rem",
                  }}
                >
                  Start Interview
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                  {questions[currentQuestionIndex]}
                </Typography>

                {/* Speaking/Listening Status */}
                <Box sx={{ mb: 3 }}>
                  {isSpeaking && (
                    <Chip
                      icon={<SpeakIcon />}
                      label="AI is speaking..."
                      color="success"
                      sx={{ mr: 2 }}
                    />
                  )}
                  {isListening && (
                    <Chip
                      icon={<MicIcon />}
                      label="Listening..."
                      color="error"
                      sx={{ animation: "pulse 1.5s infinite" }}
                    />
                  )}
                </Box>

                {/* Current Answer Display */}
                {currentAnswer && (
                  <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
                    <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                      "{currentAnswer}"
                    </Typography>
                  </Paper>
                )}

                {/* Control Buttons */}
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                  {!isSpeaking && (
                    <>
                      <IconButton
                        onClick={isListening ? stopListening : startListening}
                        sx={{
                          bgcolor: isListening ? "#f44336" : "#00695c",
                          color: "white",
                          "&:hover": { bgcolor: isListening ? "#d32f2f" : "#004d40" },
                          width: 60,
                          height: 60,
                        }}
                      >
                        {isListening ? <MicOffIcon /> : <MicIcon />}
                      </IconButton>

                      <Button
                        variant="contained"
                        onClick={nextQuestion}
                        disabled={!currentAnswer.trim()}
                        sx={{
                          bgcolor: "#4caf50",
                          "&:hover": { bgcolor: "#388e3c" },
                          px: 3,
                          py: 1.5,
                        }}
                      >
                        Next Question
                      </Button>

                      <Button
                        variant="outlined"
                        onClick={skipQuestion}
                        sx={{ px: 3, py: 1.5 }}
                      >
                        Skip
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Permission Dialog */}
      <Dialog open={showPermissionDialog} onClose={() => setShowPermissionDialog(false)}>
        <DialogTitle>Microphone Permission Required</DialogTitle>
        <DialogContent>
          <Typography>
            Please allow microphone access to participate in the voice interview. You can enable this in your browser
            settings.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPermissionDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </Box>
  )
}

export default InterviewBot;
