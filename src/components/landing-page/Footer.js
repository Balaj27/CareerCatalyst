import { Box, Container, Typography, Grid, Link, Divider } from "@mui/material"
import { styled } from "@mui/material/styles"

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  padding: theme.spacing(6, 0, 2),
}))

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: "none",
  "&:hover": {
    color: theme.palette.primary.main,
    textDecoration: "none",
  },
  display: "block",
  marginBottom: theme.spacing(1),
}))

const FooterHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}))

function Footer() {
  return (
    <FooterContainer>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <FooterHeading variant="h6">CareerCatalyst</FooterHeading>
            <Typography variant="body2" color="textSecondary" paragraph>
              Smart Paths, Strong Careers
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FooterHeading variant="h6">Services</FooterHeading>
            <FooterLink href="#">Find Jobs</FooterLink>
            <FooterLink href="#">Post Jobs</FooterLink>
            <FooterLink href="#">Resume Builder</FooterLink>
            <FooterLink href="#">Career Path Predictor</FooterLink>
            <FooterLink href="#">Recruitment Chatbot</FooterLink>
            <FooterLink href="#">Skill Training</FooterLink>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FooterHeading variant="h6">About</FooterHeading>
            <FooterLink href="#">Our Team</FooterLink>
            <FooterLink href="#">FAQ</FooterLink>
            <FooterLink href="#">Privacy & Policy</FooterLink>
            <FooterLink href="#">Terms & Conditions</FooterLink>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FooterHeading variant="h6">Contact</FooterHeading>
            <Typography variant="body2" color="textSecondary">
              careercatalyst@gmail.com
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="textSecondary" align="center">
          © All Rights Reserved 2023. Made in Pakistan
        </Typography>
      </Container>
    </FooterContainer>
  )
}

export default Footer
