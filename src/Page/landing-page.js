import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import Navbar from "../components/landing-page/Navbar"
import HeroSection from "../components/landing-page/HeroSection"
import PartnerLogos from "../components/landing-page/PartnerLogos"
import JobCategories from "../components/landing-page/JobCategories"
import PopularJobs from "../components/landing-page/PopularJobs"
import StepsSection from "../components/landing-page/StepsSection"
import ReviewsSection from "../components/landing-page/ReviewsSection"
import UploadCVSection from "../components/landing-page/UploadCVSection"
import Footer from "../components/Footer"

// Create a theme with Poppins font
const theme = createTheme({
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 500,
      textTransform: "none",
    },
  },
  palette: {
    primary: {
      main: "#006D5B", // The green color from your design
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
})

function LandingPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <HeroSection />
        <PartnerLogos />
        <JobCategories />
        <PopularJobs />
        <StepsSection />
        <ReviewsSection />
        <UploadCVSection />
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default LandingPage
