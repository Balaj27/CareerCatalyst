import React from "react"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import "@fontsource/poppins/300.css"
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/500.css"
import "@fontsource/poppins/600.css"
import "@fontsource/poppins/700.css"
import {
  Typography,
  Container,
  Box,
  Button,
  Paper,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material"
import Footer from "../components/Footer"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/landing-page/Navbar"
import { getEmployeeSkills } from "../Services/GetEmployeeSkills"
import { getCareerPathsFromSkills } from "../Services/CareerPathAPI"

// Custom theme for CareerCatalyst
const theme = createTheme({
  palette: {
    primary: {
      main: "#004d40",
    },
    secondary: {
      main: "#00897b",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    body1: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    body2: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
  },
})

const CareerPathPredictor = () => {
  const muiTheme = useTheme()
  const isSmall = useMediaQuery(muiTheme.breakpoints.down("sm"))
  const navigate = useNavigate()

  const [careerPaths, setCareerPaths] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [userSkills, setUserSkills] = React.useState([])

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const skills = await getEmployeeSkills()
        setUserSkills(skills)
        if (skills && skills.length > 0) {
          const paths = await getCareerPathsFromSkills(skills)
          setCareerPaths(paths)
        } else {
          setError("No skills found in your profile.")
        }
      } catch (err) {
        setError("Failed to generate career paths. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleRecommendSkills = () => {
    navigate("/Recommend-Skill-Training")
  }

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "#002b23",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            my: { xs: 2, sm: 4 },
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box
            sx={{
              position: "relative",
              maxWidth: "1000px",
              width: "100%",
              mx: "auto",
              flexGrow: 1,
              "&::before": {
                content: '""',
                position: "absolute",
                top: -1,
                left: -1,
                right: -1,
                bottom: -1,
                borderRadius: "8px",
                background: "linear-gradient(45deg, rgba(0,137,123,0.4), rgba(0,77,64,0.1))",
                filter: "blur(8px)",
                zIndex: 0,
              },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: "6px",
                backgroundColor: "#004d40",
                color: "white",
                minHeight: { xs: "auto", sm: "70vh" },
                height: "100%",
                position: "relative",
                zIndex: 1,
                border: "4px solid rgba(0,137,123,0.3)",
              }}
            >
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                sx={{
                  mb: 4,
                  fontWeight: 600,
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                Career Path Predictor
              </Typography>

              {/* Show user's skills */}
              {userSkills.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ color: "#b2dfdb", fontWeight: 500 }}>
                    Your Detected Skills:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                    {userSkills.map((skill, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          background: "#00695c",
                          borderRadius: 2,
                          color: "#fff",
                          fontSize: "0.9rem",
                        }}
                      >
                        {skill}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Loading and Error State */}
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                  <CircularProgress sx={{ color: "#80cbc4" }} />
                  <Typography sx={{ ml: 2 }}>Generating tailored career paths...</Typography>
                </Box>
              ) : error ? (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              ) : (
                <Box sx={{ pl: { xs: 0, sm: 1 } }}>
                  {careerPaths && careerPaths.length > 0 ? (
                    careerPaths.map((path) => (
                      <Box key={path.id} sx={{ mb: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 500,
                            fontSize: { xs: "1rem", sm: "1.1rem" },
                            mb: 0.5,
                            fontFamily: '"Poppins", sans-serif',
                          }}
                        >
                          {path.id}. {path.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontFamily: '"Poppins", sans-serif',
                            fontSize: { xs: "0.85rem", sm: "0.9rem" },
                            lineHeight: 1.5,
                            ml: { xs: 0.5, sm: 1.5 },
                          }}
                        >
                          {path.description}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography>No career paths found for your skills.</Typography>
                  )}
                </Box>
              )}

              <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 6, sm: 10 } }}>
                <Button
                  variant="contained"
                  size={isSmall ? "small" : "medium"}
                  onClick={handleRecommendSkills}
                  sx={{
                    px: 3,
                    py: 1,
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    backgroundColor: "#00897b",
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 500,
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "#00695c",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Recommend Skills & Training
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default CareerPathPredictor