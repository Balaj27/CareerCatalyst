"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Button,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
} from "@mui/material"
import { Search, Email, Phone, LocationOn, Work, School, Star } from "@mui/icons-material"

const CandidateCard = ({ candidate, onViewProfile, onSendMessage }) => (
  <Card sx={{ mb: 2, "&:hover": { boxShadow: 3 } }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <Avatar src={candidate.avatar} sx={{ width: 60, height: 60, bgcolor: "#1a5f5f" }}>
          {candidate.name.charAt(0)}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {candidate.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {candidate.title}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Star sx={{ color: "#ffc107", fontSize: 16 }} />
              <Typography variant="body2">{candidate.rating}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {candidate.location}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Work sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {candidate.experience} years exp.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
            {candidate.skills.slice(0, 4).map((skill, index) => (
              <Chip key={index} label={skill} size="small" variant="outlined" />
            ))}
            {candidate.skills.length > 4 && <Chip label={`+${candidate.skills.length - 4} more`} size="small" />}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" size="small" onClick={() => onViewProfile(candidate)}>
              View Profile
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<Email />}
              onClick={() => onSendMessage(candidate)}
              sx={{ bgcolor: "#1a5f5f", "&:hover": { bgcolor: "#0d4f4f" } }}
            >
              Message
            </Button>
          </Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
)

const CandidateProfile = ({ candidate, open, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar src={candidate?.avatar} sx={{ width: 50, height: 50, bgcolor: "#1a5f5f" }}>
          {candidate?.name?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6">{candidate?.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {candidate?.title}
          </Typography>
        </Box>
      </Box>
    </DialogTitle>
    <DialogContent>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Email sx={{ fontSize: 16 }} />
            <Typography variant="body2">{candidate?.email}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Phone sx={{ fontSize: 16 }} />
            <Typography variant="body2">{candidate?.phone}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOn sx={{ fontSize: 16 }} />
            <Typography variant="body2">{candidate?.location}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Experience & Education
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Work sx={{ fontSize: 16 }} />
            <Typography variant="body2">{candidate?.experience} years experience</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <School sx={{ fontSize: 16 }} />
            <Typography variant="body2">{candidate?.education}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Rating value={candidate?.rating} readOnly size="small" />
            <Typography variant="body2">({candidate?.rating}/5)</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Skills
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {candidate?.skills?.map((skill, index) => (
              <Chip key={index} label={skill} variant="outlined" />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            About
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {candidate?.about}
          </Typography>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
      <Button variant="contained" sx={{ bgcolor: "#1a5f5f" }}>
        Schedule Interview
      </Button>
    </DialogActions>
  </Dialog>
)

const CandidatesList = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterJob, setFilterJob] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)

  // Dummy data
  const candidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Senior React Developer",
      location: "New York, NY",
      experience: 5,
      rating: 4.8,
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      education: "BS Computer Science, MIT",
      skills: ["React", "JavaScript", "TypeScript", "Node.js", "GraphQL"],
      about: "Experienced React developer with a passion for creating user-friendly applications...",
      appliedFor: "Senior React Developer",
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "UI/UX Designer",
      location: "San Francisco, CA",
      experience: 3,
      rating: 4.6,
      email: "michael.chen@email.com",
      phone: "+1 (555) 987-6543",
      education: "BFA Design, Stanford",
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
      about: "Creative designer focused on user-centered design principles...",
      appliedFor: "UI/UX Designer",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "Backend Developer",
      location: "Austin, TX",
      experience: 4,
      rating: 4.7,
      email: "emily.rodriguez@email.com",
      phone: "+1 (555) 456-7890",
      education: "MS Software Engineering, UT Austin",
      skills: ["Python", "Django", "PostgreSQL", "AWS", "Docker"],
      about: "Backend specialist with expertise in scalable system architecture...",
      appliedFor: "Backend Developer",
    },
  ]

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesJob = !filterJob || candidate.appliedFor === filterJob
    return matchesSearch && matchesJob
  })

  const handleViewProfile = (candidate) => {
    setSelectedCandidate(candidate)
    setProfileOpen(true)
  }

  const handleSendMessage = (candidate) => {
    // Handle sending message logic
    console.log("Sending message to:", candidate.name)
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#1a5f5f">
        Candidates
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Review and manage job applications from talented candidates.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Job</InputLabel>
                <Select value={filterJob} onChange={(e) => setFilterJob(e.target.value)} label="Filter by Job">
                  <MenuItem value="">All Jobs</MenuItem>
                  <MenuItem value="Senior React Developer">Senior React Developer</MenuItem>
                  <MenuItem value="UI/UX Designer">UI/UX Designer</MenuItem>
                  <MenuItem value="Backend Developer">Backend Developer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">
                {filteredCandidates.length} candidates found
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box>
        {filteredCandidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onViewProfile={handleViewProfile}
            onSendMessage={handleSendMessage}
          />
        ))}
      </Box>

      <CandidateProfile candidate={selectedCandidate} open={profileOpen} onClose={() => setProfileOpen(false)} />
    </Box>
  )
}

export default CandidatesList
