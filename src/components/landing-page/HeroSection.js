"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import SearchIcon from "@mui/icons-material/Search"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import MyLocationIcon from "@mui/icons-material/MyLocation"

// Styled components
const HeroContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#004D40", // Dark green background
  color: "white",
  padding: theme.spacing(8, 0, 6),
  textAlign: "center",
}))

// Completely redesigned search container with explicit CSS
const SearchContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  maxWidth: "950px",
  margin: "0 auto",
  marginTop: theme.spacing(4),
  backgroundColor: "white",
  borderRadius: "50px",
  padding: "6px",
  position: "relative", // For absolute positioning of children if needed
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    borderRadius: "25px",
    padding: "10px",
  },
}))

// First element - Search Input
const SearchInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
  flex: "1 1 40%", // Take 40% of the space
  [theme.breakpoints.down("md")]: {
    width: "100%",
    marginBottom: "10px",
  },
}))

// Middle element - Location Input
const LocationInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
      borderLeft: "1px solid #e0e0e0",
    },
    "&:hover fieldset": {
      border: "none",
      borderLeft: "1px solid #e0e0e0",
    },
    "&.Mui-focused fieldset": {
      border: "none",
      borderLeft: "1px solid #e0e0e0",
    },
  },
  flex: "1 1 30%", // Take 30% of the space
  [theme.breakpoints.down("md")]: {
    width: "100%",
    marginBottom: "10px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "none",
        borderTop: "1px solid #e0e0e0",
        borderBottom: "1px solid #e0e0e0",
      },
      "&:hover fieldset": {
        border: "none",
        borderTop: "1px solid #e0e0e0",
        borderBottom: "1px solid #e0e0e0",
      },
      "&.Mui-focused fieldset": {
        border: "none",
        borderTop: "1px solid #e0e0e0",
        borderBottom: "1px solid #e0e0e0",
      },
    },
  },
}))

// Last element - Search Button
const SearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#004D40",
  color: "white",
  borderRadius: "50px",
  padding: "10px 40px",
  fontWeight: 500,
  fontSize: "16px",
  textTransform: "none",
  flex: "0 0 auto", // Don't grow or shrink, stay at natural size
  "&:hover": {
    backgroundColor: "#00695C",
  },
  [theme.breakpoints.down("md")]: {
    width: "100%",
    borderRadius: "25px",
  },
}))

function HeroSection() {
  const [location, setLocation] = useState("Islamabad, Pakistan")
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [nearbyLocations, setNearbyLocations] = useState([])

  const popularLocations = [
    "Islamabad, Pakistan",
    "Lahore, Pakistan",
    "Karachi, Pakistan",
    "New York, USA",
    "London, UK",
    "Toronto, Canada",
    "Sydney, Australia",
  ]

  const handleLocationClick = () => {
    setIsLocationDialogOpen(true)
  }

  const handleLocationDialogClose = () => {
    setIsLocationDialogOpen(false)
  }

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation)
    setIsLocationDialogOpen(false)
  }

  const getNearbyLocations = async (latitude, longitude) => {
    try {
      // Get the main location
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
      )
      const data = await response.json()

      let mainLocation = "Unknown Location"
      if (data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.county
        const country = data.address.country
        if (city && country) {
          mainLocation = `${city}, ${country}`
        }
      }

      // Set the main location
      setLocation(mainLocation)

      // Get nearby locations
      const nearbyResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=cities+near&lat=${latitude}&lon=${longitude}&addressdetails=1&limit=5`,
      )
      const nearbyData = await nearbyResponse.json()

      const locations = nearbyData
        .map((item) => {
          const city = item.address?.city || item.address?.town || item.address?.village || item.address?.county
          const country = item.address?.country
          if (city && country) {
            return `${city}, ${country}`
          }
          return null
        })
        .filter(Boolean)
        .filter((loc) => loc !== mainLocation) // Remove the main location from nearby

      setNearbyLocations(locations)
    } catch (error) {
      console.error("Error getting location data:", error)
      setNearbyLocations([])
    }
  }

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    setNearbyLocations([])

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          getNearbyLocations(latitude, longitude).finally(() => {
            setIsGettingLocation(false)
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocation("Location access denied")
          setIsGettingLocation(false)
        },
      )
    } else {
      setLocation("Geolocation not supported")
      setIsGettingLocation(false)
    }
  }

  return (
    <HeroContainer>
      <Container>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700, fontSize: { xs: "2.5rem", md: "3.5rem" } }}
        >
          Find Your Dream Job Easy &<br />
          Fast with CareerCatalyst
        </Typography>

        <Typography variant="subtitle1" sx={{ maxWidth: "700px", margin: "0 auto", mb: 4, opacity: 0.9 }}>
          Search and find your dream job is now easier than
          <br />
          ever you just browse and find job if you need it
        </Typography>

        {/* Search container with explicit order */}
        <SearchContainer>
          {/* 1. Search Input - First position */}
          <SearchInput
            placeholder="Job Title or Keyword"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#757575" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* 2. Location Input - Middle position */}
          <LocationInput
            placeholder="Location"
            variant="outlined"
            value={location}
            onClick={handleLocationClick}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon sx={{ color: "#757575" }} />
                </InputAdornment>
              ),
              readOnly: true,
              style: { cursor: "pointer" },
            }}
          />

          {/* 3. Search Button - Last position */}
          <SearchButton variant="contained">Search</SearchButton>
        </SearchContainer>

        <Typography variant="body2" sx={{ mt: 3, fontStyle: "italic", opacity: 0.8 }}>
          • Popular Search: UI, Software Engineer
        </Typography>
      </Container>

      {/* Location Dialog */}
      <Dialog open={isLocationDialogOpen} onClose={handleLocationDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle>Choose Location</DialogTitle>
        <DialogContent dividers>
          <Button
            startIcon={isGettingLocation ? <CircularProgress size={20} /> : <MyLocationIcon />}
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          >
            {isGettingLocation ? "Getting your location..." : "Use my current location"}
          </Button>

          {nearbyLocations.length > 0 && (
            <>
              <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>
                Nearby Locations
              </Typography>
              <List>
                {nearbyLocations.map((loc) => (
                  <ListItem
                    button
                    key={loc}
                    onClick={() => handleLocationSelect(loc)}
                    sx={{
                      borderRadius: "4px",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <ListItemText primary={loc} />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
            </>
          )}

          <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>
            Popular Locations
          </Typography>

          <List>
            {popularLocations.map((loc) => (
              <ListItem
                button
                key={loc}
                onClick={() => handleLocationSelect(loc)}
                sx={{
                  borderRadius: "4px",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <ListItemText primary={loc} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLocationDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </HeroContainer>
  )
}

export default HeroSection
