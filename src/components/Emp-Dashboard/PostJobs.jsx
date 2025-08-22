"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Alert,
} from "@mui/material"
import { Add, Delete } from "@mui/icons-material"
import AIJobAutoFillButton from "../../Services/AiJobButton"

const PostJob = () => {
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    experience: "",
    salary: "",
    description: "",
    requirements: "",
    skills: [],
  })
  const [skillInput, setSkillInput] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (field) => (event) => {
    setJobData({ ...jobData, [field]: event.target.value })
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && !jobData.skills.includes(skillInput.trim())) {
      setJobData({
        ...jobData,
        skills: [...jobData.skills, skillInput.trim()],
      })
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setJobData({
      ...jobData,
      skills: jobData.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  // This callback is called when AI returns all data
  const handleAIFill = (aiData) => {
    setJobData((prev) => ({
      ...prev,
      description: aiData.description || "",
      requirements: Array.isArray(aiData.requirements) ? aiData.requirements.join('\n') : "",
      skills: Array.isArray(aiData.skills) ? aiData.skills : [],
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Job posted:", jobData)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)

    // Reset form
    setJobData({
      title: "",
      company: "",
      location: "",
      jobType: "",
      experience: "",
      salary: "",
      description: "",
      requirements: "",
      skills: [],
    })
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#1a5f5f">
        Post a New Job
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Fill in the details below to post a new job opening.
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Job posted successfully! It will be reviewed and published shortly.
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} sx={{width: "48%"}}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={jobData.title}
                  onChange={handleInputChange("title")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{width: "48%"}}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={jobData.company}
                  onChange={handleInputChange("company")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{width: "48%"}}>
                <TextField
                  fullWidth
                  label="Location"
                  value={jobData.location}
                  onChange={handleInputChange("location")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{width: "48%"}}>
                <FormControl fullWidth required>
                  <InputLabel>Job Type</InputLabel>
                  <Select value={jobData.jobType} onChange={handleInputChange("jobType")} label="Job Type">
                    <MenuItem value="full-time">Full Time</MenuItem>
                    <MenuItem value="part-time">Part Time</MenuItem>
                    <MenuItem value="contract">Contract</MenuItem>
                    <MenuItem value="internship">Internship</MenuItem>
                    <MenuItem value="remote">Remote</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{width: "48%"}}>
                <FormControl fullWidth required>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    value={jobData.experience}
                    onChange={handleInputChange("experience")}
                    label="Experience Level"
                  >
                    <MenuItem value="entry">Entry Level (0-2 years)</MenuItem>
                    <MenuItem value="mid">Mid Level (2-5 years)</MenuItem>
                    <MenuItem value="senior">Senior Level (5+ years)</MenuItem>
                    <MenuItem value="executive">Executive Level</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{width: "48%"}}>
                <TextField
                  fullWidth
                  label="Salary Range"
                  value={jobData.salary}
                  onChange={handleInputChange("salary")}
                  placeholder="e.g., $50,000 - $70,000"
                />
              </Grid>
              {/* AI Autofill Button */}
              <Grid item xs={12} sx={{width: "100%"}}>
                <AIJobAutoFillButton jobData={jobData} onAIFill={handleAIFill} />
              </Grid>
              <Grid item xs={12} sx={{width: "100%"}}>
                <TextField
                  fullWidth
                  label="Job Description"
                  value={jobData.description}
                  onChange={handleInputChange("description")}
                  multiline
                  rows={4}
                  required
                  sx={{ mt: 1 }}
                />
              </Grid>
              <Grid item xs={12} sx={{width: "100%"}}>
                <TextField
                  fullWidth
                  label="Requirements"
                  value={jobData.requirements}
                  onChange={handleInputChange("requirements")}
                  multiline
                  rows={3}
                  required
                  sx={{ mt: 1 }}
                />
              </Grid>
              {/* Required Skills section */}
              <Grid item xs={12} sx={{width: "100%"}}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Required Skills
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <TextField
                      label="Add Skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                      size="small"
                      sx={{ width: "100%"}}
                    />
                    <Button variant="outlined" onClick={handleAddSkill} startIcon={<Add />}>
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {jobData.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        deleteIcon={<Delete />}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
                {/* Buttons centered under Required Skills */}
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
                  <Button variant="outlined" size="large">
                    Save as Draft
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ bgcolor: "#1a5f5f", "&:hover": { bgcolor: "#0d4f4f" } }}
                  >
                    Post Job
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default PostJob