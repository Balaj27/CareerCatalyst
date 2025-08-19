import React from "react";
import { Box, Container, Grid, Typography, Link, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";

// Color constants based on the image
const HEADING_COLOR = "#0d3c3f"; // Dark green/teal for all headings
const BACKGROUND_COLOR = "#f0f0f0"; // Light gray background
const TEXT_COLOR = "#333333"; // Text color
const HOVER_COLOR = "#5a9ea0"; // Lighter teal for hover effects

// Styled components
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: BACKGROUND_COLOR,
  padding: theme.spacing(4, 0),
  color: TEXT_COLOR,
  fontFamily: "'Poppins', sans-serif",
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const FooterLogo = styled("img")({
  height: "80px", // Increased to 80px as requested
  marginRight: "10px",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const BrandName = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: "1.25rem",
  color: HEADING_COLOR,
  marginLeft: "-30px",
  transition: "color 0.3s ease",
  "&:hover": {
    color: HOVER_COLOR,
  },
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: "1rem",
  color: HEADING_COLOR, // Same color as CareerCatalyst heading
  marginBottom: theme.spacing(2),
  position: "relative",
  display: "inline-block",
  transition: "color 0.3s ease",
  "&:after": {
    content: '""',
    position: "absolute",
    width: "0",
    height: "2px",
    bottom: "-4px",
    left: "0",
    backgroundColor: HOVER_COLOR,
    transition: "width 0.3s ease",
  },
  "&:hover": {
    color: HOVER_COLOR,
  },
  "&:hover:after": {
    width: "100%",
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  color: TEXT_COLOR,
  textDecoration: "none",
  display: "block",
  fontSize: "0.9rem",
  marginBottom: theme.spacing(1),
  transition: "color 0.3s ease, transform 0.2s ease",
  "&:hover": {
    color: HOVER_COLOR,
    transform: "translateX(5px)",
    textDecoration: "none",
  },
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  color: TEXT_COLOR,
  fontSize: "0.9rem",
  marginBottom: theme.spacing(2),
  transition: "opacity 0.3s ease",
  "&:hover": {
    opacity: 0.8,
  },
}));

const Copyright = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  textAlign: "center",
  fontSize: "0.875rem",
  color: TEXT_COLOR,
  padding: theme.spacing(1, 0),
  transition: "opacity 0.3s ease",
  "&:hover": {
    opacity: 0.8,
  },
}));

const ColumnContainer = styled(Grid)(({ theme }) => ({
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

function Footer() {
  return (
    <FooterContainer component="footer">
      {/* Import Poppins font from Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      `}</style>
      
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and description column */}
          <ColumnContainer item xs={12} md={3}>
            <LogoContainer>
              <FooterLogo src="/green-logo-noBG.png" alt="CareerCatalyst" />
              <BrandName>CareerCatalyst</BrandName>
            </LogoContainer>
            <DescriptionText>
              There are many versions of passages Lorem Ipsum available
            </DescriptionText>
          </ColumnContainer>

          {/* Services column */}
          <ColumnContainer item xs={12} md={3}>
            <SectionHeading>Services</SectionHeading>
            <FooterLink href="#">Find Jobs</FooterLink>
            <FooterLink href="#">Post Jobs</FooterLink>
            <FooterLink href="#">AI-Resume Builder</FooterLink>
            <FooterLink href="#">Career Path Predictor</FooterLink>
            <FooterLink href="#">Recommend Courses</FooterLink>
            <FooterLink href="#">Mock-Interview Preperations</FooterLink>
          </ColumnContainer>

          {/* About column */}
          <ColumnContainer item xs={12} md={3}>
            <SectionHeading>About</SectionHeading>
            <FooterLink href="#">Our Team</FooterLink>
            <FooterLink href="#">FAQ</FooterLink>
            <FooterLink href="#">Privacy & Policy</FooterLink>
            <FooterLink href="#">Terms & Conditions</FooterLink>
          </ColumnContainer>

          {/* Contact column */}
          <ColumnContainer item xs={12} md={3}>
            <SectionHeading>Contact</SectionHeading>
            <FooterLink href="mailto:careercatalyst@gmail.com">
              careercatalyst@gmail.com
            </FooterLink>
          </ColumnContainer>
        </Grid>

        <Divider sx={{ 
          mt: 4, 
          mb: 2, 
          backgroundColor: "#d0d0d0",
          opacity: 0.7,
          transition: "opacity 0.3s ease",
          "&:hover": {
            opacity: 1,
          },
        }} />

        <Copyright>
          © All Rights Reserved 2025, Made in Pakistan
        </Copyright>
      </Container>
    </FooterContainer>
  );
}

export default Footer;