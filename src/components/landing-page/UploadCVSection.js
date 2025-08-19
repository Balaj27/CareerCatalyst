"use client"

import { Box, Container, Typography, Button, useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined"
import { useTheme } from "@mui/material/styles"

const SectionContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#0a4a3a", // Dark green color from the image
  color: "white",
  borderRadius: "12px",
  margin: theme.spacing(4, 0),
  padding: theme.spacing(6),
  position: "relative",
  overflow: "visible", // Important: Allow content to overflow
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(4, 3),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3, 2),
    margin: theme.spacing(2, 0),
  },
}))

const UploadButton = styled(Button)(({ theme }) => ({
  backgroundColor: "white",
  color: "#0a4a3a",
  padding: "12px 24px",
  borderRadius: "6px",
  fontWeight: 500,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "10px 20px",
    fontSize: "0.875rem",
  },
}))

const ContentWrapper = styled(Box)(({ theme }) => ({
  width: "60%",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}))

function UploadCVSection() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Container
      maxWidth="lg"
      sx={{
        my: { xs: 2, sm: 3, md: 4 },
        position: "relative",
        px: { xs: 2, sm: 3, md: 3 },
      }}
    >
      <SectionContainer>
        <ContentWrapper>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: { xs: 2, sm: 3, md: 4 },
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
              lineHeight: 1.2,
            }}
          >
            Get your Dream Job, Just by
            <br />
            Uploading your CV
          </Typography>

          <UploadButton variant="contained" startIcon={<FileUploadOutlinedIcon />}>
            Upload Resume
          </UploadButton>
        </ContentWrapper>
      </SectionContainer>

      {/* Person image positioned outside the container - Desktop/Tablet */}
      <Box
        sx={{
          position: "absolute",
          right: { md: 60, lg: 60 },
          top: { md: -115, lg: -115 },
          bottom: 0,
          width: { md: "80%" },
          height: { md: "400px" },
          display: { xs: "none", md: "block" },
          zIndex: 1,
        }}
      >
        <Box
          component="img"
          src="./images/resume-icon.png"
          alt="Professional in suit"
          sx={{
            height: "100%", // Make image taller than container
            width: "auto",
            maxWidth: "none",
            position: "absolute",
            right: "5%",
            bottom: "-20px", // Position slightly below container
          }}
        />
      </Box>

      {/* Mobile version of the image */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          mt: 2,
          textAlign: "center",
          position: "relative",
          height: { xs: "250px", sm: "300px" },
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src="./images/person-image2.png"
          alt="Professional in suit"
          sx={{
            maxWidth: "none",
            height: "100%",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </Box>
    </Container>
  )
}

export default UploadCVSection
