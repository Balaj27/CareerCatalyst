"use client"

import { useEffect, useState } from "react"
import { Box, Container, useTheme, useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"

// Styled components
const LogoContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  padding: theme.spacing(5, 0),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}))

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  [theme.breakpoints.down("md")]: {
    flexWrap: "wrap",
    justifyContent: "center",
    gap: theme.spacing(5),
  },
}))

// Modified to accept `isIndeed` prop
const LogoImage = styled("img", {
  shouldForwardProp: (prop) => prop !== "isIndeed",
})(({ theme, isIndeed }) => ({
  height: isIndeed ? "60px" : "40px",
  opacity: 0.7,
  filter: "grayscale(100%)",
  transition: "all 0.4s ease",
  cursor: "pointer",
  padding: theme.spacing(0, 2),
  objectFit: "contain",
  "&:hover": {
    opacity: 1,
    filter: "grayscale(0%)",
    transform: "scale(1.1)",
  },
  [theme.breakpoints.down("md")]: {
    height: isIndeed ? "50px" : "35px",
    margin: theme.spacing(0, 3),
  },
  [theme.breakpoints.down("sm")]: {
    height: isIndeed ? "45px" : "30px",
    margin: theme.spacing(2, 2),
  },
}))

const AnimatedBox = styled(Box)(({ delay }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  animation: "fadeInUp 0.8s ease forwards",
  opacity: 0,
  transform: "translateY(20px)",
  animationDelay: `${delay}ms`,
  "@keyframes fadeInUp": {
    "0%": {
      opacity: 0,
      transform: "translateY(20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}))

const PulseAnimation = styled("div")(({ delay }) => ({
  animation: "pulse 5s infinite ease-in-out",
  animationDelay: `${delay}s`,
  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
    },
    "50%": {
      transform: "scale(1.05)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
}))

function PartnerLogos() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const logos = [
    {
      name: "Upwork",
      src: "./images/logos/upwork-logo.svg",
      url: "https://www.upwork.com",
    },
    {
      name: "99designs",
      src: "./images/logos/99designs-logo.svg",
      url: "https://99designs.com",
    },
    {
      name: "Craigslist",
      src: "./images/logos/craigslist-logo.svg",
      url: "https://www.craigslist.org",
    },
    {
      name: "LinkedIn",
      src: "./images/logos/linkedin-logo.svg",
      url: "https://www.linkedin.com",
    },
    {
      name: "Indeed",
      src: "./images/logos/indeed-logo.svg",
      url: "https://www.indeed.com",
    },
  ]

  const handleLogoClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <LogoContainer>
      <Container>
        <LogoWrapper>
          {logos.map((logo, index) => (
            <AnimatedBox key={logo.name} delay={index * 150}>
              <PulseAnimation delay={index}>
                <LogoImage
                  src={logo.src}
                  alt={logo.name}
                  loading="lazy"
                  onClick={() => handleLogoClick(logo.url)}
                  title={`Visit ${logo.name}`}
                  isIndeed={logo.name === "Indeed"}
                />
              </PulseAnimation>
            </AnimatedBox>
          ))}
        </LogoWrapper>
      </Container>
    </LogoContainer>
  )
}

export default PartnerLogos
