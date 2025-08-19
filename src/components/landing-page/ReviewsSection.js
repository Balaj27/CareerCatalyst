import React, { useState, useEffect } from "react"
import { Box, Container, Typography, Paper, Avatar, IconButton, useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { useTheme } from "@mui/material/styles"

const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(4, 0),
  },
}))

const TestimonialPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  maxWidth: "800px",
  margin: "0 auto",
  boxShadow: "none",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3, 2),
  },
}))

const AvatarGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(3),
  },
}))

const TestimonialAvatar = styled(Avatar)(({ theme, active }) => ({
  width: active ? 80 : 60,
  height: active ? 80 : 60,
  margin: theme.spacing(0, 1),
  border: active ? `3px solid ${theme.palette.primary.main}` : "none",
  transition: "all 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    width: active ? 60 : 40,
    height: active ? 60 : 40,
    margin: theme.spacing(0, 0.5),
  },
}))

const NavigationButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
  },
}))

// Review data
const reviews = [
  {
    id: 1,
    name: "Justin Blake",
    position: "Visual Designer at Facebook",
    testimonial:
      "Browse through the listings and apply directly from the website within a few clicks. Found my dream job in just 2 weeks. The platform is intuitive and easy to use. I recommend it to all job seekers.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "Frontend Developer at Google",
    testimonial:
      "CareerCatalyst transformed my job search experience. The personalized job recommendations matched my skills perfectly, and the interview preparation resources were invaluable. I landed a position at my dream company within a month!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Michael Chen",
    position: "Product Manager at Amazon",
    testimonial:
      "After struggling with traditional job boards, CareerCatalyst was a breath of fresh air. The AI-powered matching system connected me with opportunities I wouldn't have found otherwise. The application process was streamlined and efficient.",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    position: "UX Researcher at Microsoft",
    testimonial:
      "The career coaching services provided by CareerCatalyst were game-changing. My coach helped refine my resume and prepare for interviews. The platform's user-friendly interface made tracking applications simple. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
  },
  {
    id: 5,
    name: "David Wilson",
    position: "Data Scientist at Netflix",
    testimonial:
      "CareerCatalyst helped me transition to a new industry seamlessly. The skill assessment tools identified my transferable skills, and the learning resources filled my knowledge gaps. I received multiple offers within weeks of using the platform.",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
]

function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleAvatars, setVisibleAvatars] = useState([])
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Update visible avatars when active index changes
  useEffect(() => {
    updateVisibleAvatars()
  }, [activeIndex])

  const updateVisibleAvatars = () => {
    const totalAvatars = reviews.length
    const maxVisible = isMobile ? 3 : 5
    
    let avatars = []
    if (totalAvatars <= maxVisible) {
      avatars = [...Array(totalAvatars).keys()]
    } else {
      // Calculate which avatars to show centered around the active one
      const halfVisible = Math.floor(maxVisible / 2)
      let start = activeIndex - halfVisible
      let end = activeIndex + halfVisible
      
      // Handle edge cases
      if (start < 0) {
        end += Math.abs(start)
        start = 0
      }
      if (end >= totalAvatars) {
        start -= (end - totalAvatars + 1)
        end = totalAvatars - 1
      }
      
      // Ensure we show exactly maxVisible avatars
      start = Math.max(0, start)
      end = Math.min(totalAvatars - 1, start + maxVisible - 1)
      
      for (let i = start; i <= end; i++) {
        avatars.push(i)
      }
    }
    
    setVisibleAvatars(avatars)
  }

  const handlePrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === reviews.length - 1 ? 0 : prevIndex + 1))
  }

  const handleAvatarClick = (index) => {
    setActiveIndex(index)
  }

  const activeReview = reviews[activeIndex]

  return (
    <SectionContainer>
      <Container>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: { xs: 4, md: 6 }, 
            fontWeight: 700,
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}
        >
          Reviews of People who Have
          <br />
          Found Jobs Through CareerCatalyst
        </Typography>

        <Box sx={{ position: "relative" }}>
          <NavigationButton
            aria-label="previous review"
            onClick={handlePrevious}
            sx={{ 
              position: "absolute", 
              left: { xs: -16, sm: -20 }, 
              top: "50%", 
              transform: "translateY(-50%)",
              zIndex: 2
            }}
          >
            <ArrowBackIosNewIcon fontSize={isMobile ? "small" : "medium"} />
          </NavigationButton>

          <TestimonialPaper>
            <AvatarGroup>
              {visibleAvatars.map((index) => (
                <TestimonialAvatar
                  key={reviews[index].id}
                  active={index === activeIndex}
                  src={reviews[index].avatar}
                  alt={reviews[index].name}
                  onClick={() => handleAvatarClick(index)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </AvatarGroup>

            <Typography 
              variant="body1" 
              paragraph
              sx={{ 
                minHeight: { xs: '120px', sm: '150px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              "{activeReview.testimonial}"
            </Typography>

            <Typography variant="h6" component="p" sx={{ fontWeight: 600 }}>
              {activeReview.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {activeReview.position}
            </Typography>
          </TestimonialPaper>

          <NavigationButton
            aria-label="next review"
            onClick={handleNext}
            sx={{ 
              position: "absolute", 
              right: { xs: -16, sm: -20 }, 
              top: "50%", 
              transform: "translateY(-50%)",
              zIndex: 2
            }}
          >
            <ArrowForwardIosIcon fontSize={isMobile ? "small" : "medium"} />
          </NavigationButton>
        </Box>
      </Container>
    </SectionContainer>
  )
}

export default ReviewsSection