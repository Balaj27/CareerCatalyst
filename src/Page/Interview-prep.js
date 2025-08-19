import React from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material"
import {
  Quiz as QuizIcon,
  VideoCall as VideoCallIcon,
} from "@mui/icons-material"
import Navbar from "../components/landing-page/Navbar"
import Footer from "../components/Footer"

const InterviewPrep = () => {
  const navigate = useNavigate()

  const features = [
    {
      title: "AI-Generated MCQs",
      description:
        "Practice with intelligent multiple-choice questions tailored to your target job role and difficulty level.",
      icon: <QuizIcon sx={{ fontSize: 40, color: "white" }} />,
      action: () => navigate("/mcqs"),
      buttonText: "Start MCQ Practice",
      gradient: "linear-gradient(135deg, #00695c 0%, #004d40 100%)",
    },
    {
      title: "Live Mock Interview",
      description: "Experience realistic interview scenarios with AI-powered feedback and assessment.",
      icon: <VideoCallIcon sx={{ fontSize: 40, color: "white" }} />,
      action: () => navigate("/interview"),
      buttonText: "Start Mock Interview",
      gradient: "linear-gradient(135deg, #00796b 0%, #00695c 100%)",
    },
  ]

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #00695c 0%, #004d40 100%)" }}>
      {/* Navigation Header */}
      <Navbar />

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            textAlign: "center",
            mb: 6,
            fontWeight: "bold",
            color: "white",
            pt: 4,
          }}
        >
          Prepare for Your Dream Career
        </Typography>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
          sx={{
            flexWrap: "nowrap",
            overflowX: { xs: "auto", md: "visible" },
          }}
        >
          {features.map((feature, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              key={index}
              sx={{
                display: "flex",
                alignItems: "stretch",
                minWidth: { xs: 280, sm: 340, md: 380 },
                maxWidth: { xs: 340, sm: 400, md: 440 },
              }}
            >
              <Card
                elevation={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                  // Fixed height for all cards for same size
                  height: { xs: 370, sm: 400, md: 420 },
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 3,
                      p: 3,
                      background: feature.gradient,
                      borderRadius: 3,
                      width: 72,
                      height: 72,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      textAlign: "center",
                      color: "#333",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textAlign: "center",
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 4, pt: 0, justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={feature.action}
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      background: feature.gradient,
                      "&:hover": {
                        background: feature.gradient,
                        opacity: 0.9,
                      },
                    }}
                  >
                    {feature.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Footer Section */}
      <Footer />
    </Box>
  )
}

export default InterviewPrep