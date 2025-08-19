import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  Typography,
  Container,
  Box,
  Button,
  Paper,
  useMediaQuery,
  useTheme,
  Link,
  CircularProgress,
} from "@mui/material";
import Footer from "../components/Footer";
import Navbar from "../components/landing-page/Navbar";
import { useNavigate } from "react-router-dom";
import { getEmployeeSkills } from "../Services/GetEmployeeSkills";
import { getEmployeeJobTitle } from "../Services/getEmployeeJobTitle";
import { getRecommendedTraining } from "../Services/recommendTrainingAI";

const theme = createTheme({
  palette: {
    primary: { main: "#004d40" },
    secondary: { main: "#00897b" },
    background: { default: "#f5f5f5", paper: "#ffffff" },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif' },
    body1: { fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif' },
    body2: { fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif' },
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
});

const RecommendSkills = () => {
  const muiTheme = useTheme();
  const isSmall = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [trainingData, setTrainingData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [userSkills, setUserSkills] = React.useState([]);
  const [jobTitle, setJobTitle] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [skills, job] = await Promise.all([
          getEmployeeSkills(),
          getEmployeeJobTitle(),
        ]);
        setUserSkills(skills);
        setJobTitle(job);
        if (skills && skills.length > 0 && job) {
          const recommendations = await getRecommendedTraining(skills, job);
          setTrainingData(recommendations);
        } else {
          setError("No skills or job title found in your profile.");
        }
      } catch (err) {
        setError("Failed to recommend skills and training. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBackToDashboard = () => {
    navigate("/career-path-predictor");
  };

  const courseLinkStyle = {
    color: "#4db6ac",
    textDecoration: "none",
    fontWeight: 500,
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#80cbc4",
      textDecoration: "underline",
    },
  };

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
                Recommend Skills & Training
              </Typography>

              {/* Show user's job title and skills */}
              {(jobTitle || userSkills.length > 0) && (
                <Box sx={{ mb: 3 }}>
                  {jobTitle && (
                    <Typography variant="subtitle1" sx={{ color: "#b2dfdb", fontWeight: 500 }}>
                      Job Title: <span style={{ color: "#fff" }}>{jobTitle}</span>
                    </Typography>
                  )}
                  {userSkills.length > 0 && (
                    <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
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
                  )}
                </Box>
              )}

              {/* Loading and Error State */}
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                  <CircularProgress sx={{ color: "#80cbc4" }} />
                  <Typography sx={{ ml: 2 }}>Recommending skills and training...</Typography>
                </Box>
              ) : error ? (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              ) : (
                <Box sx={{ pl: { xs: 0, sm: 1 } }}>
                  {trainingData && trainingData.length > 0 ? (
                    trainingData.map((path) => (
                      <Box key={path.id} sx={{ mb: 4 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 500,
                            fontSize: { xs: "1rem", sm: "1.1rem" },
                            mb: 1,
                            fontFamily: '"Poppins", sans-serif',
                          }}
                        >
                          {path.id}. {path.title}
                        </Typography>
                        {path.courses && path.courses.map((course, index) => (
                          <Box key={index} sx={{ ml: { xs: 1, sm: 2 }, mb: 1.5 }}>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: { xs: "0.9rem", sm: "0.95rem" },
                                mb: 0.5,
                                fontFamily: '"Poppins", sans-serif',
                              }}
                            >
                              {course.platform}:{" "}
                              <Link href={course.link} sx={courseLinkStyle} target="_blank" rel="noopener">
                                {course.name}
                              </Link>
                            </Typography>
                            <Typography
                              component="li"
                              sx={{
                                color: "rgba(255, 255, 255, 0.8)",
                                fontFamily: '"Poppins", sans-serif',
                                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                                lineHeight: 1.5,
                                ml: 1,
                              }}
                            >
                              {course.description}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    ))
                  ) : (
                    <Typography>No recommendations found for your skills and job title.</Typography>
                  )}
                </Box>
              )}

              <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 4, sm: 6 } }}>
                <Button
                  variant="contained"
                  size={isSmall ? "small" : "medium"}
                  onClick={handleBackToDashboard}
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
                  Back to Careeer Path Predictor
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default RecommendSkills;