import React, { useEffect, useState } from "react";
import { getAllResumeData } from "../../Services/resumeAPI";
import AddResume from "../../components/AddResume";
import ResumeCard from "../../components/ResumeCard";
import {
  Typography,
  Grid,
  Container,
  ThemeProvider,
  createTheme,
  Box,
  Divider,
} from "@mui/material";
import Navbar from "../../components/landing-page/Navbar";

// CareerCatalyst theme
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
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
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
});

function Resume() {
  const [resumeList, setResumeList] = useState([]);

  const fetchAllResumeData = async () => {
    try {
      const resumes = await getAllResumeData();
      setResumeList(resumes);
    } catch (error) {
      console.log("Error from dashboard", error.message);
    }
  };

  useEffect(() => {
    fetchAllResumeData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box minHeight="100vh" bgcolor="#f5f5f5">
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Resume
          </Typography>
          <Typography variant="body1" gutterBottom>
            Start creating your AI resume for your next job role.
          </Typography>

          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} sm={6} md={4}>
              <AddResume refreshData={fetchAllResumeData} />
            </Grid>
          </Grid>

          {resumeList.length > 0 && (
            <Box mt={6}>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                My Resumes
              </Typography>
              <Grid container spacing={3}>
                {resumeList.map((resume) => (
                  <Grid item xs={12} sm={6} md={4} key={resume.id}>
                    <ResumeCard resume={resume} refreshData={fetchAllResumeData} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Resume;