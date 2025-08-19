"use client"

import { useState, useEffect } from "react"
import { Box, Container, Typography, Grid, Paper } from "@mui/material"
import { styled } from "@mui/material/styles"

// Styled components
const SectionContainer = styled(Box)(() => ({
  padding: "80px 0",
  backgroundColor: "#fff",
  display: "flex",
  justifyContent: "center",
}))

const ContentContainer = styled(Container)(() => ({
  maxWidth: "1200px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}))

const SectionTitle = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: "32px",
  textAlign: "center",
  marginBottom: "8px",
}))

const SectionSubtitle = styled(Typography)(() => ({
  color: "#666",
  fontSize: "16px",
  textAlign: "center",
  maxWidth: "600px",
  margin: "0 auto",
  marginBottom: "40px",
}))

// Fixed width for all cards - removed space-between
const CategoryCard = styled(Paper)(() => ({
  width: "100%",
  height: "190px",
  padding: "24px",
  borderRadius: "8px",
  border: "1px solid #eaeaea",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start", // Changed from space-between to flex-start
  transition: "all 0.3s ease",
  cursor: "pointer",
  boxShadow: "none",
  borderColor: "#878383",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
    "& .category-icon": {
      transform: "scale(1.1)",
    },
  },
}))

const IconContainer = styled(Box)(() => ({
  marginBottom: "7px", // Exact 7px spacing
  marginTop: "0",
  padding: "0",
  "& img": {
    height: "40px",
    width: "auto",
    transition: "transform 0.3s ease",
  },
}))

const CategoryTitle = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: "18px",
  color: "#333",
  lineHeight: 1.3,
  margin: 0,
  padding: 0,
}))

const JobCount = styled(Typography)(() => ({
  color: "#666",
  fontSize: "14px",
  margin: 0,
  padding: 0,
  marginTop: "7px", // Exact 7px spacing
}))

const AnimatedBox = styled(Box)(({ delay }) => ({
  animation: "fadeInUp 0.8s ease forwards",
  opacity: 0,
  transform: "translateY(20px)",
  animationDelay: `${delay}ms`,
  height: "100%", // Ensure full height
  width: "100%", // Ensure full width
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

// Custom line break formatter per card index
const formatTitle = (title, index) => {
  const breakPoints = [2, 2, 3, 1, 3, 2, 1, 1]
  const words = title.split(" ")
  const breakAt = breakPoints[index]

  if (words.length <= breakAt) return title

  const firstPart = words.slice(0, breakAt).join(" ")
  const secondPart = words.slice(breakAt).join(" ")

  return (
    <>
      {firstPart}
      <br />
      {secondPart}
    </>
  )
}

function JobCategories() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const categories = [
    {
      title: "Marketing & Communication",
      count: "200+ Jobs Available",
      icon: "./images/logos/marketing-icon.png",
    },
    {
      title: "Design & Development",
      count: "200+ Jobs Available",
      icon: "./images/logos/design-icon.png",
    },
    {
      title: "Human Research & Development",
      count: "200+ Jobs Available",
      icon: "./images/logos/human-research-icon.png",
    },
    {
      title: "Finance Management",
      count: "200+ Jobs Available",
      icon: "./images/logos/finance-icon.png",
    },
    {
      title: "Armforce Guide & Security",
      count: "200+ Jobs Available",
      icon: "./images/logos/security-icon.png",
    },
    {
      title: "Business & Consulting",
      count: "200+ Jobs Available",
      icon: "./images/logos/business-icon.png",
    },
    {
      title: "Customer Support Care",
      count: "200+ Jobs Available",
      icon: "./images/logos/customer-support-icon.png",
    },
    {
      title: "Project Management",
      count: "200+ Jobs Available",
      icon: "./images/logos/project-icon.png",
    },
  ]

  const firstRow = categories.slice(0, 4)
  const secondRow = categories.slice(4, 8)

  return (
    <SectionContainer>
      <ContentContainer>
        <SectionTitle variant="h4" component="h2">
          Get Work in Different Categories
        </SectionTitle>
        <SectionSubtitle variant="body1">
          Get the most exciting jobs from all around the world and grow your career fast with other
        </SectionSubtitle>

        {/* First row */}
        <Grid
          container
          spacing={3}
          sx={{
            mb: 3,
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {firstRow.map((category, index) => (
            <Box
              key={index}
              sx={{
                width: "100%",
                height: "100%",
              }}
            >
              <AnimatedBox delay={index * 100}>
                <CategoryCard>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <IconContainer>
                      <img src={category.icon || "/placeholder.svg"} alt={category.title} className="category-icon" />
                    </IconContainer>
                    <CategoryTitle variant="h6">{formatTitle(category.title, index)}</CategoryTitle>
                    <JobCount>{category.count}</JobCount>
                  </Box>
                </CategoryCard>
              </AnimatedBox>
            </Box>
          ))}
        </Grid>

        {/* Second row */}
        <Grid
          container
          spacing={3}
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {secondRow.map((category, index) => (
            <Box
              key={index + 4}
              sx={{
                width: "100%",
                height: "100%",
              }}
            >
              <AnimatedBox delay={(index + 4) * 100}>
                <CategoryCard>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <IconContainer>
                      <img src={category.icon || "/placeholder.svg"} alt={category.title} className="category-icon" />
                    </IconContainer>
                    <CategoryTitle variant="h6">{formatTitle(category.title, index + 4)}</CategoryTitle>
                    <JobCount>{category.count}</JobCount>
                  </Box>
                </CategoryCard>
              </AnimatedBox>
            </Box>
          ))}
        </Grid>
      </ContentContainer>
    </SectionContainer>
  )
}

export default JobCategories
