"use client"

import { Box, Container, Typography, useTheme, useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"

// Styled components
const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: "#fff",
  position: "relative",
}))

const ContentContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
}))

const ImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  maxWidth: "500px",
  left: "90px",
  marginRight:"80px",
  marginBottom: theme.spacing(4),
  alignSelf: "center",
  [theme.breakpoints.up("md")]: {
    width: "35%",
    marginBottom: 0,
    alignSelf: "flex-start",
  },
}))

const PersonImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "auto",
  borderRadius: "12px",
  objectFit: "cover",
  objectPosition: "center top",
  backgroundColor: "#0a4a3a",
}))

const TextContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    width: "65%",
    paddingLeft: theme.spacing(6),
  },
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "36px",
  color: "#0a4a3a", // Dark green color from the design
  marginBottom: theme.spacing(2),
  lineHeight: 1.2,
  [theme.breakpoints.down("sm")]: {
    fontSize: "28px",
  },
}))

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  color: "#333",
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
  },
}))

const StepContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(3),
  alignItems: "flex-start",
}))

const StepNumber = styled(Box)(({ theme }) => ({
  width: "40px",
  height: "40px",
  backgroundColor: "#f0f7f4", // Light green background for step numbers
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(2),
  borderRadius: "4px",
  flexShrink: 0,
}))

const StepNumberText = styled(Typography)(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 700,
  color: "#0a4a3a", // Dark green color for the number
}))

const StepContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}))

const StepTitle = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: 600,
  color: "#0a4a3a", // Dark green color for step titles
  marginBottom: theme.spacing(0.5),
}))

const StepDescription = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: "#666", // Gray color for descriptions
  lineHeight: 1.5,
}))

function StepsSection() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const steps = [
    {
      number: 1,
      title: "Complete your profile",
      description: "complete your profile so that recruiters can see information about you",
    },
    {
      number: 2,
      title: "Upload your Resume",
      description: "You can upload your resume or CV, and Recruiters soon will be reviewed",
    },
    {
      number: 3,
      title: "Find Job",
      description: "You can find your dream job according to your abilities and passion",
    },
    {
      number: 4,
      title: "Apply Job",
      description: "When you have choosen your suitable job and have read the job desk, You can apply the job.",
    },
  ]

  return (
    <SectionContainer>
      <ContentContainer maxWidth="lg">
        <ImageContainer data-aos="fade-right">
          <PersonImage src="./images/person-image1.png" alt="Person thinking about career" />
        </ImageContainer>

        <TextContainer data-aos="fade-left">
          <SectionTitle variant="h2">
            Follow our Step, We Will
            <br />
            Help You
          </SectionTitle>

          <SectionSubtitle>
            Follow these Steps to get the job you want. We will help you to find a job that suits your Passion
          </SectionSubtitle>

          {steps.map((step) => (
            <StepContainer key={step.number} data-aos="fade-up" data-aos-delay={step.number * 100}>
              <StepNumber>
                <StepNumberText>{step.number}</StepNumberText>
              </StepNumber>

              <StepContent>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </StepContent>
            </StepContainer>
          ))}
        </TextContainer>
      </ContentContainer>
    </SectionContainer>
  )
}

export default StepsSection
