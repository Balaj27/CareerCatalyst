"use client"

import { useState, useEffect } from "react"
import { getApplicationsForEmployer } from "../../lib/firestore-application"
import MessageEmailDialog from "./MessageEmailDialog"
import { useAuth } from "../../lib/auth-context"
import { getResumeData } from "../../Services/resumeAPI"
import { sendCandidateEmail } from "../../Services/sendCandidateEmail";
import { useState as useReactState } from "react"
import { db } from "../../lib/firebase"
import { doc, getDoc } from "firebase/firestore"
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

const CandidateCard = ({ candidate, onViewProfile, onSendMessage, onShortlist, isShortlisted }) => (
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
                {candidate.email}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Star sx={{ color: "#ffc107", fontSize: 16 }} />
              <Typography variant="body2">{candidate.rating}</Typography>
            </Box>
          </Box>

          {/* Job info */}
          {candidate.job && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">Applied for: {candidate.job.title || candidate.appliedFor}</Typography>
              <Typography variant="body2" color="text.secondary">{candidate.job.company} | {candidate.job.location}</Typography>
              <Typography variant="body2" color="text.secondary">{candidate.job.description?.slice(0, 100)}...</Typography>
            </Box>
          )}

          {/* Cover letter */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">Cover Letter:</Typography>
            <Typography variant="body2" color="text.secondary">{candidate.coverLetter}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Phone sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {candidate.phone}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {candidate.location}
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
            <Button
              variant={isShortlisted ? "outlined" : "contained"}
              size="small"
              color={isShortlisted ? "success" : "primary"}
              onClick={() => onShortlist(candidate)}
              disabled={isShortlisted}
              sx={{ minWidth: 110 }}
            >
              {isShortlisted ? "Shortlisted" : "Shortlist"}
            </Button>
          </Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
)

const CandidateProfile = ({ candidate, open, onClose }) => {
  const [resume, setResume] = useReactState(null);
  const [resumeOpen, setResumeOpen] = useReactState(false);
  const [resumeError, setResumeError] = useReactState("");

  const handlePreviewResume = async () => {
    setResume(null);
    setResumeError("");
    if (candidate?.resumeId && candidate?.application?.userId) {
      try {
        const data = await getResumeData(candidate.resumeId, candidate.application.userId);
        if (!data) {
          setResumeError("Resume not found.");
        } else {
          setResume(data);
        }
      } catch (err) {
        setResumeError("Failed to load resume.");
      }
      setResumeOpen(true);
    } else {
      setResumeError("No resume attached.");
      setResumeOpen(true);
    }
  };

  return (
    <>
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
            {candidate?.resumeId && (
              <Grid item xs={12}>
                <Button variant="outlined" onClick={handlePreviewResume} sx={{ mt: 2 }}>
                  Preview Resume
                </Button>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button variant="contained" sx={{ bgcolor: "#1a5f5f" }}>
            Schedule Interview
          </Button>
        </DialogActions>
      </Dialog>
      {/* Resume Preview Dialog */}
      <Dialog open={resumeOpen} onClose={() => setResumeOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Resume Preview</DialogTitle>
        <DialogContent dividers>
          {resumeError ? (
            <Typography color="error">{resumeError}</Typography>
          ) : resume ? (
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {resume.title || resume.name || "Resume"}
              </Typography>
              {/* Personal Info */}
              {resume.personal && (
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">Personal Information</Typography>
                  <Typography>Name: {resume.personal.firstName} {resume.personal.lastName}</Typography>
                  <Typography>Email: {resume.personal.email}</Typography>
                  <Typography>Phone: {resume.personal.phone}</Typography>
                  <Typography>Address: {resume.personal.address}</Typography>
                  <Typography>Job Title: {resume.personal.jobTitle}</Typography>
                </Box>
              )}
              {/* Summary */}
              {resume.summary && (
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">Summary</Typography>
                  <Typography>{resume.summary}</Typography>
                </Box>
              )}
              {/* Experience */}
              {resume.experience && resume.experience.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">Experience</Typography>
                  {resume.experience.map((exp, idx) => {
                    // Support both old and new property names
                    const position = exp.position || exp.title || "";
                    const company = exp.company || exp.companyName || "";
                    const description = exp.description || exp.workSummary || "";
                    const startDate = exp.startDate || "";
                    const endDate = exp.endDate || "Present";
                    return (
                      <Box key={idx} mb={1} pl={2}>
                        <Typography><b>{position}</b> at {company} ({startDate} - {endDate})</Typography>
                        <Typography variant="body2">{description && <span dangerouslySetInnerHTML={{ __html: description }} />}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
              {/* Education */}
              {resume.education && resume.education.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">Education</Typography>
                  {resume.education.map((edu, idx) => {
                    // Support both old and new property names
                    const institution = edu.institution || edu.universityName || "";
                    const startYear = edu.startYear || edu.startDate || "";
                    const endYear = edu.endYear || edu.endDate || "";
                    const description = edu.description || "";
                    return (
                      <Box key={idx} mb={1} pl={2}>
                        <Typography><b>{edu.degree}</b> at {institution} ({startYear} - {endYear})</Typography>
                        {description && <Typography variant="body2">{description}</Typography>}
                      </Box>
                    );
                  })}
                </Box>
              )}
              {/* Skills */}
              {resume.skills && resume.skills.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">Skills</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {resume.skills.map((skill, idx) => {
                      // If skill is an object, use skill.name; else use skill as string
                      const label = typeof skill === 'object' && skill !== null ? skill.name : skill;
                      return <Chip key={idx} label={label} variant="outlined" />;
                    })}
                  </Box>
                </Box>
              )}
              {/* Projects */}
              {resume.projects && resume.projects.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">Projects</Typography>
                  {resume.projects.map((proj, idx) => {
                    // Support both old and new property names
                    const title = proj.title || proj.projectName || "";
                    const description = proj.description || proj.projectSummary || "";
                    const techStack = proj.techStack || "";
                    return (
                      <Box key={idx} mb={1} pl={2}>
                        <Typography><b>{title}</b>{techStack && ` [${techStack}]`}</Typography>
                        {description && <Typography variant="body2"><span dangerouslySetInnerHTML={{ __html: description }} /></Typography>}
                      </Box>
                    );
                  })}
                </Box>
              )}
              {/* Certifications */}
              {resume.certifications && resume.certifications.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">Certifications</Typography>
                  {resume.certifications.map((cert, idx) => (
                    <Box key={idx} mb={1} pl={2}>
                      <Typography><b>{cert.name}</b> - {cert.issuer} ({cert.year})</Typography>
                    </Box>
                  ))}
                </Box>
              )}
              {/* Languages */}
              {resume.languages && resume.languages.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">Languages</Typography>
                  <Typography>{resume.languages.join(', ')}</Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Typography>Loading resume...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResumeOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


const CandidatesList = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("")
  const [filterJob, setFilterJob] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)

  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [messageCandidate, setMessageCandidate] = useState(null)
  const [messageJob, setMessageJob] = useState(null)
  const [shortlistedIds, setShortlistedIds] = useState([])
  const [shortlistLoading, setShortlistLoading] = useState(false)
  // Shortlist handler
  const handleShortlist = async (candidate) => {
    setShortlistLoading(true);
    try {
      setShortlistedIds((prev) => [...prev, candidate.id]);
      // Send email notification
      await sendCandidateEmail({
        to: candidate.email,
        subject: `You have been shortlisted for ${candidate.job?.title || "the job"}`,
        body: `Congratulations! You have been shortlisted for the position of <b>${candidate.job?.title || "the job"}</b> at <b>${candidate.job?.company || "the company"}</b>.<br><br>The team will reach out to you in the coming days.`,
        company: candidate.job?.company || "Company",
        jobTitle: candidate.job?.title || "Job Title",
        candidateName: candidate.name || candidate.email,
      });
    } catch (err) {
      // Optionally show error
    } finally {
      setShortlistLoading(false);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true)
      setError("")
      try {
        // Use employerId from current authenticated user
        const employerId = currentUser?.uid;
        if (!employerId) {
          setError("No employer ID found. Please log in as an employer.");
          setLoading(false);
          return;
        }
        const apps = await getApplicationsForEmployer(employerId)
        // Fetch resume and job details for each application
        const candidatesWithResume = await Promise.all(apps.map(async (app) => {
          let resume = null;
          let job = null;
          // Resume fetching for preview is handled in the dialog; here we just pass resumeId
          try {
            if (app.jobId) {
              const jobDoc = await getDoc(doc(db, "jobs", app.jobId));
              job = jobDoc.exists() ? { id: jobDoc.id, ...jobDoc.data() } : null;
            }
          } catch {}
          return {
            id: app.id,
            name: resume?.personal?.firstName || app.email?.split("@")[0] || app.email || "-",
            title: resume?.personal?.jobTitle || "-",
            location: resume?.personal?.address || job?.location || "-",
            experience: resume?.experience?.length || 0,
            rating: 0,
            email: app.email || "-",
            phone: app.phone || "-",
            education: resume?.education?.[0]?.degree || "-",
            skills: resume?.skills || [],
            about: resume?.summary || app.coverLetter || "-",
            appliedFor: app.jobId || "-",
            coverLetter: app.coverLetter || "-",
            resumeTitle: resume?.title || resume?.name || "Resume",
            resumeId: app.resumeId,
            application: app,
            job: job,
            noResume: !resume,
          };
        }));
        setCandidates(candidatesWithResume);
      } catch (err) {
        setError("Failed to load applications.")
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [currentUser])

  // Add filter for shortlisted
  const [showShortlistedOnly, setShowShortlistedOnly] = useState(false);
  const filteredCandidates = candidates
    .filter((candidate) => {
      const matchesSearch =
        (candidate.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (candidate.title || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesJob = !filterJob || candidate.appliedFor === filterJob;
      const matchesShortlist = !showShortlistedOnly || shortlistedIds.includes(candidate.id);
      return matchesSearch && matchesJob && matchesShortlist;
    })
    // Optionally, sort shortlisted candidates to top
    .sort((a, b) => {
      const aShort = shortlistedIds.includes(a.id) ? 1 : 0;
      const bShort = shortlistedIds.includes(b.id) ? 1 : 0;
      return bShort - aShort;
    });

  const handleViewProfile = (candidate) => {
    setSelectedCandidate(candidate)
    setProfileOpen(true)
  }

  const handleSendMessage = (candidate) => {
    setMessageCandidate(candidate);
    setMessageJob(candidate.job);
    setMessageDialogOpen(true);
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
            <Grid item xs={12} md={5}>
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
                  {/* Dynamically list jobs from applications */}
                  {[...new Set(candidates.map(c => c.appliedFor))].filter(Boolean).map(jobId => (
                    <MenuItem key={jobId} value={jobId}>{jobId}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant={showShortlistedOnly ? "contained" : "outlined"}
                color="success"
                onClick={() => setShowShortlistedOnly((prev) => !prev)}
                sx={{ minWidth: 120 }}
              >
                {showShortlistedOnly ? "Show All" : "Show Shortlisted"}
              </Button>
            </Grid>
            <Grid item xs={12} md={1}>
              <Typography variant="body2" color="text.secondary">
                {loading ? "Loading..." : `${filteredCandidates.length} found`}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {loading ? (
        <Typography>Loading applications...</Typography>
      ) : (
        <Box>
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onViewProfile={handleViewProfile}
              onSendMessage={handleSendMessage}
              onShortlist={handleShortlist}
              isShortlisted={shortlistedIds.includes(candidate.id)}
            />
          ))}
        </Box>
      )}

      <CandidateProfile candidate={selectedCandidate} open={profileOpen} onClose={() => setProfileOpen(false)} />
      <MessageEmailDialog
        open={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        candidate={messageCandidate}
        job={messageJob}
      />
    </Box>
  )
}

export default CandidatesList
